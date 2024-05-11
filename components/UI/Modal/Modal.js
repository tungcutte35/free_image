'use client'
import { useEffect } from 'react';
import './Modal.css'
import { useRouter } from 'next/navigation'

const Modal = ({children, open, url}) => {
  const router = useRouter();

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.documentElement.style = "";
    }
  }, [])


  function handleClose(){
    if(open)
      return open(false);

    router.push(url || '/');
  }


  return (
    <div className='modal'>
      <div className="modal_close" onClick={handleClose} />

      <div className="modal_container">
        <button onClick={handleClose} className='modal_btn_close'>
          <i className='material-icons'>close</i>
        </button>

        <div className="modal_content">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal