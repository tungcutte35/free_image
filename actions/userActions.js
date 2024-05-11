'use server'

import UserModel from "@/models/userModel";
import { destroyFromCloudinary, uploadToCloudinary } from "@/utils/cloudinary";
import { generateNextCursor } from "@/utils/generateNextCursor";
import { generateUsersMatch } from "@/utils/generateUsersMatch";
import { generateUsersCountPipeline, generateUsersPipeline } from "@/utils/generateUsersPipeline";
import { revalidatePath } from "next/cache";


export async function getUserById({ myUser, id }){
  try {
    if(myUser?._id === id)
      return { user: myUser };

    const user = await UserModel.findById(id);
    if(!user) throw new Error('User does not exist!');

    const newUser = {
      ...user._doc,
      _id: user?._id.toString(),
      total_followers: user?.followers.length,
      total_followings: user?.followings.length,
      followers: [],
      followings: [],
      isFollowing: user?.followers.includes(myUser?._id),
      myUserId: myUser?._id
    }

    return { user: newUser };
  } catch (error) {
    return { errMsg: error.message }
  }
}


export async function updateUser({ formData, name, user }){
  try {
    const files = formData.getAll('files');

    if(!files.length){
      // avatar not change, only name change
      await UserModel.findByIdAndUpdate(user?._id, { name });
    }else{
      // avatar change
      const [res] = await uploadToCloudinary(files, user?._id);
      // upload avatar to cloudinary
      // then change it in mongodb and 
      // delete old avatar on cloudinary if there is public_id
      await Promise.all([
        UserModel.findByIdAndUpdate(user?._id, {
          name, avatar: res?.secure_url, public_id: res?.public_id
        }),
        destroyFromCloudinary(user?.public_id)
      ])
    }
    
    revalidatePath("/");
    return { msg: 'Update Success!' }
  } catch (error) {
    return { errMsg: error.message }
  }
}


export async function followUser({ myUserId, _id, isFollowing }){
  try {
    if(isFollowing){
      await Promise.all([
        UserModel.findByIdAndUpdate(myUserId, { // myUser => followings
          $pull: { followings: _id }
        }),
        UserModel.findByIdAndUpdate(_id, { // otherUser => followers
          $pull: { followers: myUserId }
        })
      ])
    }else{
      await Promise.all([
        UserModel.findByIdAndUpdate(myUserId, { // myUser => followings
          $push: { followings: _id }
        }),
        UserModel.findByIdAndUpdate(_id, { // otherUser => followers
          $push: { followers: myUserId }
        })
      ])
    }
    
    revalidatePath("/");
    return { msg: 'Follow Success!' }
  } catch (error) {
    return { errMsg: error.message }
  }
}


export async function getUsers(query){
  try {
    const limit = query?.limit * 1 || 12;
    const sort = query?.sort || '_id';
    const search = query?.search;

    const match = generateUsersMatch(query);

    const pipeline = await generateUsersPipeline({ sort, limit, match, search });
    
    const users = JSON.parse(JSON.stringify(await UserModel.aggregate(pipeline)));

    const next_cursor = generateNextCursor({ sort, limit, data: users });

    return { data: users, next_cursor };
  } catch (error) {
    return { errMsg: error.message }
  }
}


export async function getUsersCount(query){
  try {
    const search = query?.search;
    const match = generateUsersMatch(query);

    const pipeline = await generateUsersCountPipeline({ match, search });

    const [result] = JSON.parse(JSON.stringify(await UserModel.aggregate(pipeline)));

    return result?.total || 0;
  } catch (error) {
    return { errMsg: error.message }
  }
}