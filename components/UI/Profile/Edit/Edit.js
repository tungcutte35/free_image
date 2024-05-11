import React, { useRef, useState } from 'react'
import './Edit.css'
import Image from 'next/image';
import { toast } from 'react-toastify';
import { validFiles } from '@/utils/validFiles';
import { updateUser } from '@/actions/userActions';

const ProfileEdit = ({ user, setIsEdit }) => {
  const [file, setFile] = useState();
  const [name, setName] = useState(user?.name);
  const [loading, setLoading] = useState(false);
  const formRef = useRef();

  const handleInputFiles = (files) => {
    if(!files.length) return;

    [...files].map(file => {
      const result = validFiles(file);

      if(result?.errMsg)
        return toast.error(result.errMsg);

      setFile(result);
    })

    formRef.current.reset();
  }

  const handleDrop = (e) => {
    e.preventDefault();
    const data = e.dataTransfer;
    handleInputFiles(data.files);
  }

  const handleUpdateUser = async (e) => {
    e.preventDefault();

    setLoading(true);
    
    const formData = new FormData();

    if(file){
      formData.append('files', file.fileUpload);
      URL.revokeObjectURL(file.imgUrl);
    }

    const res = await updateUser({ formData, name, user });

    setLoading(false);

    if(res?.errMsg)
      toast.error(res.errMsg);

    setIsEdit(false);
  }

  return (
    <form className='profile_edit' ref={formRef} onSubmit={handleUpdateUser}
      onDrop={handleDrop} onDragOver={e => e.preventDefault()}
    >
      
      <div className="p_e_container">
        <label htmlFor="upload" className='avatar'>
          <Image src={file?.imgUrl || user?.avatar} alt={name}
          width={140} height={140} sizes='50vw' />

          <input type="file" id="upload" accept='.png, .jpg, .jpeg' hidden
          onChange={e => handleInputFiles(e.target.files)} />
        </label>

        <div className="p_e_text">
          <input type="text" defaultValue={user?.email} disabled={true} />

          <input type="text" value={name} required 
          onChange={e => setName(e.target.value)}/>
        </div>
      </div>

      <button className='btn_submit' disabled={loading}>
        { loading ? 'Loading...' : 'Update' }
      </button>
    </form>
  )
}

export default ProfileEdit