import { Types } from 'mongoose'

// Users Match
export function generateUsersMatch(query){
  const page = query?.page;
  const next = query?.next;
  const id = query?.id;

  const paginate_id = {
    _id: next ? { $lt: new Types.ObjectId(next) } : { $exists: true }
  }

  const paginate_updatedAt = {
    updatedAt: next ? { $lt: new Date(next) } : { $exists: true }
  }
  
  if(page === 'following')
    return { followers: new Types.ObjectId(id), ...paginate_updatedAt };

  if(page === 'follower')
    return { followings: new Types.ObjectId(id), ...paginate_updatedAt };

  // Search Users
  if(page === 'users')
    return paginate_id;
}