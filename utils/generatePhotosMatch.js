import { Types } from 'mongoose'

// Photos Match
export function generatePhotosMatch(query){
  const page = query?.page;
  const next = query?.next;
  const id = query?.id;


  const paginate_id = {
    _id: next ? { $lt: new Types.ObjectId(next) } : { $exists: true }
  }

  const paginate_updatedAt = {
    updatedAt: next ? { $lt: new Date(next) } : { $exists: true }
  }
  

  if(page === 'public')
    return { public: true, user: new Types.ObjectId(id), ...paginate_id };

  if(page === 'private')
    return { public: false, user: new Types.ObjectId(id), ...paginate_id };

  if(page === 'favorite')
    return { favorite_users: new Types.ObjectId(id), ...paginate_updatedAt };

  // Home, Search Photos
  if(page === 'home' || page === 'photos')
    return { public: true, ...paginate_id };
}