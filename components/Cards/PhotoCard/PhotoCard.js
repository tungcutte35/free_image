import React, { useState } from 'react'
import './PhotoCard.css'
import Image from 'next/image'
import Link from 'next/link'
import { handleDownloadImage } from '@/utils/downloadImage'
import { signIn } from 'next-auth/react'
import { deletePhoto, favoritePhoto } from '@/actions/photoActions'
import { toast } from 'react-toastify'
import UploadCard from '../UploadCard/UploadCard'

const PhotoCard = React.memo(({ photo, setPhotos, index, setPIndex }) => {
  const [isEdit, setIsEdit] = useState(false);

  async function handleFavoritePhoto(){
    if(!photo?.myUserId)
      return signIn('google');

    const newPhoto = {...photo, isFavorite: !photo?.isFavorite};

    setPhotos(photos => photos.map(item => item._id === newPhoto?._id ? newPhoto : item))

    const res = await favoritePhoto(photo);

    if(res?.errMsg)
      toast.error(res.errMsg)
  }


  async function handleDeletePhoto(){
    if(confirm('Are you sure want to delete this photo?')){
      setPhotos(photos => photos.filter((_, i) => i !== index))

      const res = await deletePhoto(photo);

      if(res?.errMsg)
        toast.error(res.errMsg);
    }
  }


  if(isEdit)
    return (
      <UploadCard
        file={photo}
        setFiles={setPhotos}
        index={index}
        setIsEdit={setIsEdit}
      />
    )

  return (
    <div className='photo_card'>
      <Image src={photo?.imgUrl} alt={photo?.title}
      width={280} height={280} sizes='60vw'
      placeholder='blur' blurDataURL={photo?.blurHash} />

      <div className="p_c_top">
        {
          photo?.myUserId === photo?.user?._id
            ? <>
              <button className='btn p_c_btn' onClick={handleDeletePhoto}>
                <i className='material-icons'>delete</i>
              </button>

              <button className='btn p_c_btn' onClick={() => setIsEdit(true)}>
                <i className='material-icons'>edit</i>
              </button>
            </>
            : null
        }

        <button className='btn p_c_btn' onClick={handleFavoritePhoto}>
          {
            photo?.isFavorite
              ? <i className='material-icons' style={{color: 'red'}}>favorite</i>
              : <i className='material-icons'>favorite_border</i>
          }
        </button>
      </div>
      
      <div className="p_c_bottom">
        <Link href={`/profile/${photo?.user?._id}`} className='author' title={photo?.user?.name}>

          <div className="avatar">
            <Image src={photo?.user?.avatar} alt={photo?.user?.name}
            width={40} height={40} sizes='25vw' />
          </div>

          <span className='text-ellipsis'>
            {photo?.user?.name}
          </span>

        </Link>

        <button className='btn p_c_btn' onClick={() => handleDownloadImage(photo)}>
          <i className='material-icons-outlined'>file_download</i>
        </button>
      </div>

      <button className='p_c_btn_overflow' onClick={() => setPIndex(index)} />
    </div>
  )
})

export default PhotoCard