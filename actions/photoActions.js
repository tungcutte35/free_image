'use server'

import PhotoModel from "@/models/photoModel";
import { destroyFromCloudinary, uploadToCloudinary } from "@/utils/cloudinary";
import { dynamicBlurDataUrl } from "@/utils/dynamicBlurDataUrl";
import { generateNextCursor } from "@/utils/generateNextCursor";
import { generatePhotosMatch } from "@/utils/generatePhotosMatch";
import { generatePhotosCountPipeline, generatePhotosPipeline } from "@/utils/generatePhotosPipeline";
import getServerUser from "@/utils/getServerUser"
import { slugify } from "@/utils/slugify";
import { revalidatePath } from "next/cache";

export async function uploadPhotos(formData, filesUpload){
  try {
    const user = await getServerUser();
    if(!user) throw new Error('Unauthorization!');

    const files = formData.getAll('files');

    // Upload photos to the cloudinary
    const photos = await uploadToCloudinary(files, user?._id);

    // Generate blurDataURL
    const blurDataPromise = photos.map(photo => dynamicBlurDataUrl(photo.secure_url));
    const blurData = await Promise.all(blurDataPromise);

    const newPhotos = photos.map((photo, index) => (
      {
        user: user?._id,
        public_id: photo.public_id,
        imgUrl: photo.secure_url,
        title: filesUpload[index].title,
        tags: filesUpload[index].tags,
        slug: slugify(filesUpload[index].title),
        imgName: `${slugify(filesUpload[index].title)}.${photo.format}`,
        public: filesUpload[index].public,
        blurHash: blurData[index]
      }
    ))

    await PhotoModel.insertMany(newPhotos);

    revalidatePath("/");
    return { msg: 'Upload Success!' }
  } catch (error) {
    return { errMsg: error.message }
  }
}


export async function getPhotos(query){
  try {
    const limit = query?.limit * 1 || 12;
    const sort = query?.sort || '_id';
    const search = query?.search;

    const match = generatePhotosMatch(query);

    const pipeline = await generatePhotosPipeline({ sort, limit, match, search });
    
    const photos = JSON.parse(JSON.stringify(await PhotoModel.aggregate(pipeline)));

    const next_cursor = generateNextCursor({ sort, limit, data: photos });

    return { data: photos, next_cursor }
  } catch (error) {
    return { errMsg: error.message }
  }
}


export async function getPhotosCount(query){
  try {
    const search = query?.search;
    const match = generatePhotosMatch(query);

    const pipeline = await generatePhotosCountPipeline({ match, search });

    const [result] = JSON.parse(JSON.stringify(await PhotoModel.aggregate(pipeline)));

    return result?.total || 0;
  } catch (error) {
    return { errMsg: error.message }
  }
}


export async function favoritePhoto({ myUserId, _id, isFavorite }){
  try {

    if(isFavorite){
      await PhotoModel.findByIdAndUpdate(_id, {
        $pull: { favorite_users: myUserId }
      })
    }else{
      await PhotoModel.findByIdAndUpdate(_id, {
        $push: { favorite_users: myUserId }
      })
    }
    
    revalidatePath("/");
    return { msg: 'Favorite Success!' }
  } catch (error) {
    return { errMsg: error.message }
  }
}


export async function updatePhoto(photo){
  try {
    await PhotoModel.findByIdAndUpdate(photo?._id, {
      title: photo?.title,
      tags: photo?.tags,
      public: photo?.public,
    })
    
    revalidatePath("/");
    return { msg: 'Update Success!' }
  } catch (error) {
    return { errMsg: error.message }
  }
}


export async function deletePhoto({ _id, public_id }){
  try {
    // delete photos on mongodb and cloudinary
    await Promise.all([
      PhotoModel.findByIdAndDelete(_id),
      destroyFromCloudinary(public_id)
    ])
    
    revalidatePath("/");
    return { msg: 'Delete Success!' }
  } catch (error) {
    return { errMsg: error.message }
  }
}


export async function getPhotoById(id){
  try {
    const [myUser, photo] = await Promise.all([
      getServerUser(),
      PhotoModel.findById(id).populate('user', 'name avatar')
    ])

    if(!photo) throw new Error('Photo does not exist!');

    const newPhoto = {
      ...photo._doc,
      isFavorite: photo.favorite_users.includes(myUser?._id),
      total_favorite: photo.favorite_users.length,
      favorite_users: [],
      myUserId: myUser?._id
    }
    
    return { data: JSON.parse(JSON.stringify(newPhoto)) }
  } catch (error) {
    return { errMsg: error.message }
  }
}