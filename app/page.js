import { getPhotos } from '@/actions/photoActions'
import Error from '@/components/UI/Error/Error';
import Gallery from '@/components/UI/Gallery/Gallery';
import Header from '@/components/UI/Header/Header'

const HomePage = async () => {
  const res = await getPhotos({ page: 'home' });

  return (
    <>
      <Header />

      {
        res?.errMsg
          ? <Error errMsg={res.errMsg} />
          : <Gallery
              data={res?.data}
              next_cursor={res?.next_cursor}
              fetchingData={getPhotos}
              query={{ page: 'home' }}
          />
      }
    </>
  )
}

export default HomePage