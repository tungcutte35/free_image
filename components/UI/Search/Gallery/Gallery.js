import { getPhotos } from "@/actions/photoActions";
import Error from "../../Error/Error";
import Gallery from "../../Gallery/Gallery";

const SearchGallery = async ({ page, search, id }) => {
  if(page !== 'photos' && page !== 'private') return null;

  const res = await getPhotos({ page, search, id });

  return (
    <>
      {
        res?.errMsg
          ? <Error errMsg={res.errMsg} />
          : <Gallery
              data={res?.data}
              next_cursor={res?.next_cursor}
              fetchingData={getPhotos}
              query={{ page, search, id }}
          />
      }
    </>
  )
}

export default SearchGallery