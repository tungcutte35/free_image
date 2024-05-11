import { getPhotoById } from "@/actions/photoActions"
import Error from "@/components/UI/Error/Error";
import PhotoDetail from "@/components/UI/Photo/Photo";


export async function generateMetadata({ params: { id }, searchParams: { s } }){
  return{
    title: `${s} | Images`,
    description: `${s} | Images`,
    alternates: {
      canonical: `/photo/${id}?s=${s}`,
      languages: {
        "en-US": `/en-US/photo/${id}?s=${s}`
      }
    }
  }
}

const PhotoPage = async ({ params: { id } }) => {
  const res = await getPhotoById(id);

  return (
    <>
      {
        res?.errMsg
          ? <Error errMsg={res.errMsg} />
          : <PhotoDetail photo={res?.data} />
      }
    </>
  )
}

export default PhotoPage