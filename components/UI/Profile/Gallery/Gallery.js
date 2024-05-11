import { getPhotos } from "@/actions/photoActions";
import Error from "../../Error/Error";
import Gallery from "../../Gallery/Gallery";

const ProfileGallery = async ({ id, page, myUserId }) => {
  // Show only public, private, favorite pages.
  const pages = ['public', 'private', 'favorite'];
  if(!pages.includes(page)) return null;

  // Other users only show public photos.
  page = id === myUserId ? page : 'public';

  const sort = page === 'favorite' ? 'updatedAt' : '_id';
  const res = await getPhotos({ id, sort, page });


  return (
    <>
      {
        res?.errMsg
          ? <Error errMsg={res.errMsg} />
          : <Gallery
              data={res?.data}
              next_cursor={res?.next_cursor}
              fetchingData={getPhotos}
              query={{ id, sort, page }}
          />
      }
    </>
  )
}

export default ProfileGallery