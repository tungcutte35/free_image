'use server'
import getServerUser from "./getServerUser"
import { Types } from 'mongoose'

// Photos Pipeline
export async function generatePhotosPipeline({ sort, limit, match, search }){
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
      // populate("users", "name avatar")
      $lookup: {
        from: 'users', // users model
        let: { user_id: '$user' }, // user field in photo model 
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$user_id"] } } },
          { $project: { name: 1, avatar: 1 } }
        ],
        as: 'user' // user: [ [Object] ]
      }
    },
    { $unwind: '$user' }, // array => object => user: [ [Object] ] => Object
    {
      // create a new field named isFavorite with value true|false
      // Value: if (userId in $favorite_users) ==> true else ==> false
      $addFields: {
        isFavorite: {
          $cond: [{ $in: [userId, "$favorite_users"] }, true, false]
        },
        total_favorite: { $size: '$favorite_users' },
        myUserId: userId
      }
    },
    {
      $project: {
        favorite_users: 0 // select('-favorite_users')
      }
    }
  ];

  const search_pipeline = [
    {
      $search: {
        index: "searchPhotos",
        text: {
          query: search,
          path: ["title", "tags"],
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


export async function generatePhotosCountPipeline({ match, search }){

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
        index: "searchPhotos",
        text: {
          query: search,
          path: ["title", "tags"],
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