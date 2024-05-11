'use client'
import React, { experimental_useOptimistic as useOptimistic, useState} from 'react'
import './Photo.css'
import Link from 'next/link';
import Image from 'next/image';
import formatNumber from '@/utils/formatNumber';
import { handleDownloadImage } from '@/utils/downloadImage';
import { signIn } from 'next-auth/react';
import { favoritePhoto } from '@/actions/photoActions';


const PhotoDetail = ({ photo, setPhotos, type }) => {
  const [isFavorite, setIsFavorite] = useOptimistic(photo?.isFavorite);
  const [zoom, setZoom] = useState(false);

  async function handleFavoritePhoto(){
    if(!photo?.myUserId)
      return signIn('google');

    if(setPhotos){
      const newPhoto = {...photo, isFavorite: !photo?.isFavorite};
      setPhotos(photos => photos.map(item => item._id === newPhoto?._id ? newPhoto : item))
    }else{
      setIsFavorite(prev => !prev)
    }

    const res = await favoritePhoto(photo);

    if(res?.errMsg)
      toast.error(res.errMsg)
  }

  return (
    <div className={`container ${type}`}>

      <div className="p_d_header">
        <Link href={`/profile/${photo?.user?._id}`} className='p_d_author'>
          <div className="avatar">
            <Image src={photo?.user?.avatar} alt={photo?.user?.name}
            width={40} height={40} sizes='25vw' />
          </div>

          <span>{photo?.user?.name}</span>
        </Link>

        <div className="p_d_btns">
          {
            type
              ? <Link href={`/photo/${photo?._id}?s=${photo?.slug}`} className='btn btn_icon'>
                  <i className='material-icons' style={{color: 'red'}}>share</i>
              </Link>
              : null
          }

          <button className='btn btn_icon' onClick={handleFavoritePhoto}>
            {
              isFavorite
                ? <i className='material-icons' style={{color: 'red'}}>favorite</i>
                : <i className='material-icons'>favorite_border</i>
            }
          </button>

          <button className='btn btn_icon' onClick={() => handleDownloadImage(photo)}>
            Download
          </button>

        </div>

      </div>

      <div className="p_d_photo">
        <div className={`p_d_photo_box ${zoom ? 'zoom' : ''}`} 
        onClick={() => setZoom(z =>!z)} >

          <Image src={photo?.imgUrl} alt={photo?.title}
          width={340} height={340} sizes='70vw'
          placeholder='blur' blurDataURL={photo?.blurHash} />

          <i className='material-icons'>
            { zoom ? 'zoom_in_map' : 'zoom_out_map' }
          </i>

        </div>

      </div>

      <div className="p_d_footer">
        <h3>{photo?.title}</h3>

        <div title='favorite'>
          <i className='material-icons'>favorite_border</i>
          <span>{formatNumber(photo?.total_favorite)}</span>
        </div>

        <div title='published'>
          <i className='material-icons'>date_range</i>
          <span>{new Date(photo?.createdAt).toDateString()}</span>
        </div>

        <div className="p_d_tags">
          {
            photo?.tags?.map(tag => (
              <Link key={tag} href={`/search/photos/${tag}`}>
                {tag}
              </Link>
            ))
          }
        </div>

      </div>
      
    </div>
  )
}

export default PhotoDetail