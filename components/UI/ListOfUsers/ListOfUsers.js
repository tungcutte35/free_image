'use client'
import UserCard from '@/components/Cards/UserCard/UserCard';
import useInView from '@/hooks/useInView';
import React, { useEffect, useState } from 'react'

const ListOfUsers = ({ data, next_cursor, fetchingData, query }) => {
  const [files, setFiles] = useState(data);
  const [next, setNext] = useState(next_cursor);
  const [loading, setLoading] = useState(false);
  const { ref, inView } = useInView();


  async function handleLoadMore(){
    if(next === 'stop' || loading) return;

    setLoading(true);
    const res = await fetchingData({ next, ...query });
    setLoading(false);

    const newData = [...files, ...res?.data];

    setFiles(newData);
    setNext(res?.next_cursor);

  }

  useEffect(() => {
    if(inView){
      handleLoadMore()
    }
  }, [inView])


  return (
    <div className='container'>
      
      <div className="grid" style={{margin: '40px auto'}}>
        {
          files.map(file => (
            <UserCard key={file._id} user={file} />
          ))
        }
      </div>

      <button className='btn_submit' style={{
        margin: '20px auto',
        display: (next && next !== 'stop') ? 'block' : 'none'
      }} 
      disabled={loading} onClick={handleLoadMore} ref={ref}>
        { loading ? 'Loading...' : 'Load More' }
      </button>

    </div>
  )
}

export default ListOfUsers