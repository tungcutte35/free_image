export function generateNextCursor({ sort, limit, data }){
  if(sort === 'updatedAt')
    return new Date(data[limit - 1]?.updatedAt).getTime() || 'stop';
    
  return data[limit - 1]?._id || 'stop'; 
}