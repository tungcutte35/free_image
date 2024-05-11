'use client'
import PhotoCard from '@/components/Cards/PhotoCard/PhotoCard';
import useInView from '@/hooks/useInView';
import React, { useEffect, useState } from 'react'
import Modal from '../Modal/Modal';
import PhotoDetail from '../Photo/Photo';
import NextPrev from '../NextPrev/NextPrev';

const Gallery = ({ data, next_cursor, fetchingData, query }) => {
  const [files, setFiles] = useState(data);
  const [next, setNext] = useState(next_cursor);
  const [loading, setLoading] = useState(false);
  const [pIndex, setPIndex] = useState(false);
  const { ref, inView } = useInView();


  async function handleLoadMore(){
    if(next === 'stop' || loading) return;

    setLoading(true);
    const res = await fetchingData({ next, ...query });
    setLoading(false);

    const newData = [...files, ...res?.data];

    setFiles(newData);
    setNext(res?.next_cursor);

    return newData;
  }

  useEffect(() => {
    if(inView){
      handleLoadMore()
    }
  }, [inView])


  return (
    <div className='container'>
      
      <div className="masonry" style={{margin: '40px auto'}}>
        {
          files.map((file, index) => (
            <PhotoCard
              key={file._id}
              photo={file}
              setPhotos={setFiles}
              index={index}
              setPIndex={setPIndex}
            />
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


      {
        pIndex !== false
          ? <Modal open={setPIndex}>
              <PhotoDetail
                photo={files[pIndex]}
                setPhotos={setFiles}
                type="modal_active"
              />

              <NextPrev
                setPIndex={setPIndex}
                currentIndex={pIndex}
                latestIndex={files.length - 1}
                next={next}
                handleLoadMore={handleLoadMore}
              />
          </Modal>
          : null
      }

    </div>
  )
}

export default Gallery