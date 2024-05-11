export const validFiles = (file) => {
  const imgTypes = ["image/jpeg", "image/png"];

  if(!file.type.startsWith('image')){
    return {
      status: 'error',
      errMsg: `This is not an image - ${file.type}`,
      title: file.name,
      imgUrl: '/empty.jpg'
    }
  }

  if(!imgTypes.includes(file.type)){
    return {
      status: 'error',
      errMsg: `This image format is incorrect - only png, jpeg`,
      title: file.name,
      imgUrl: URL.createObjectURL(file)
    }
  }

  if(file.size > 1024 * 1024){
    return {
      status: 'error',
      errMsg: `This image size is larger than 1mb`,
      title: file.name,
      imgUrl: URL.createObjectURL(file)
    }
  }

  return {
    status: 'success',
    title: file.name.replace(/.(jpeg|jpg|png)$/gi, ''),
    tags: ["DevAT-VietNam"],
    public: false,
    imgUrl: URL.createObjectURL(file),
    fileUpload: file
  }
}