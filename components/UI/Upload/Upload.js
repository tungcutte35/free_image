'use client'
import { uploadPhotos } from '@/actions/photoActions';
import UploadCard from '@/components/Cards/UploadCard/UploadCard';
import UploadForm from '@/components/Forms/UploadForm/UploadForm'
import React, { useMemo, useState } from 'react'
import { toast } from 'react-toastify';
import Loading from '../Loading/Loading';

const Upload = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const count = useMemo(() => {
    return files.filter(file => file?.status === 'success').length;
  }, [files])


  const handleUpload = async () => {
    const filesUpload = files.filter(file => file?.status === 'success');

    const formData = new FormData();

    filesUpload.forEach(file => {
      formData.append('files', file.fileUpload);

      if(!file.title){
        file.title = file.name.replace(/.(jpeg|jpg|png)$/gi, '')
      }
    })

    const newFiles = filesUpload.map(file => ({...file, fileUpload: '', imgUrl: ''}));

    setLoading(true)
    const res = await uploadPhotos(formData, newFiles);
    setLoading(false)

    if(res?.errMsg)
      toast.error(res.errMsg);

    files.map(file => URL.revokeObjectURL(file.imgUrl))
    setFiles([])
  }


  return (
    <div className='container'>
      <UploadForm setFiles={setFiles} />

      <div className='masonry'>
        {
          files.map((file, index) => (
            <UploadCard
              key={index}
              file={file}
              setFiles={setFiles}
              index={index}
            />
          ))
        }
      </div>

      <button className='btn_submit' style={{ margin: '20px 0' }} 
      disabled={count <= 0 || count > 5 || loading}
      onClick={handleUpload} >
        {
          loading
            ? 'Loading...'
            : count
                ? `Submit ${count} photos`
                : 'Submit to Novem'
        }
      </button>

      { loading ? <Loading /> : null }
    </div>
  )
}

export default Upload