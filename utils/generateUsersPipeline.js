'use server'

import getServerUser from "./getServerUser"
import { Types } from 'mongoose'

// Users Pipeline
export async function generateUsersPipeline({ sort, limit, match, search }){
  const user = await getServerUser();
  const userId = user ? new Types.ObjectId(user?._id) : undefined;

  const base_pipeline = [
    {
      $sort: sort === '_id' ? { _id: -1 } : { updatedAt: -1 }
    }, // sort before match
    {
      // find(match)
      $match: match
    },
    { // limit after match
      $limit: limit
    },
    {
      // create a new field named isFollowing with value true|false
      // Value: if (userId in $followers) ==> true else ==> false
      $addFields: {
        isFollowing: {
          $cond: [{ $in: [userId, "$followers"] }, true, false]
        },
        myUserId: userId
      }
    },
    {
      $project: {
        followers: 0,
        followings: 0 // select('-followings -followers')
      }
    }
  ];


  const search_pipeline = [
    {
      $search: {
        index: "searchUsers",
        text: {
          query: search,
          path: "name",
          fuzzy: {
            prefixLength: 3
          }
        }
      }
    }
  ];

  if(search)
    return [...search_pipeline, ...base_pipeline];

  return base_pipeline;
}


export async function generateUsersCountPipeline({ match, search }){

  const base_pipeline = [
    {
      // find(match)
      $match: match
    },
    {
      $count: 'total'
    }
  ];

  const search_pipeline = [
    {
      $search: {
        index: "searchUsers",
        text: {
          query: search,
          path: 'name',
          fuzzy: {
            prefixLength: 3
          }
        }
      }
    }
  ];

  if(search)
    return [...search_pipeline, ...base_pipeline];

  return base_pipeline;
}