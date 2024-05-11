'use client'
import React, { useState } from 'react'
import './UserCard.css'
import Image from 'next/image';
import Link from 'next/link';
import { signIn, signOut } from 'next-auth/react';
import { followUser } from '@/actions/userActions';

const UserCard = React.memo(({ user }) => {
  const [isFollowing, setIsFollowing] = useState(user?.isFollowing);

  const handleFollow = async () => {
    if(!user?.myUserId)
      return signIn('google');

    setIsFollowing(prev =>!prev);

    const res = await followUser({...user, isFollowing});

    if(res?.errMsg)
      toast.error(res.errMsg);
  }


  return (
    <div className='user_card'>
      
      <div className="avatar">
        <Image src={user?.avatar} alt={user?.name}
        width={100} height={100} sizes='25vw' />
      </div>

      <div className="u_c_info">
        <h3 className='text-ellipsis'>{user?.name}</h3>
        <small className='text-ellipsis'>{user?.email}</small>
      </div>

      {
        user?._id === user?.myUserId
          ? <button className='btn btn_logout' onClick={signOut}>
              <i className='material-icons'>logout</i>
              <span>Logout</span>
          </button>

          : <button className={`btn ${isFollowing ? 'following' : ''}`}
          onClick={handleFollow}>
              <i className='material-icons'>
                { isFollowing ? 'done' : 'add' }
              </i>
              <span>
                { isFollowing ? 'Following' : 'Follow' }
              </span>
          </button>
      }

      <Link href={`/profile/${user?._id}`} />
    </div>
  )
})

export default UserCard