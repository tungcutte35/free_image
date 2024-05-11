import SearchGallery from '@/components/UI/Search/Gallery/Gallery';
import SearchMenu from '@/components/UI/Search/Menu/Menu';
import SearchUsers from '@/components/UI/Search/Users/Users';
import getServerUser from '@/utils/getServerUser';
import React from 'react'

const SearchPage = async ({ params: { slug } }) => {
  const page = slug[0], search = decodeURI(slug[1]);
  const myUser = await getServerUser();


  return (
    <>
      <h1 className='container' style={{margin: '30px auto'}}>
        Result for <span style={{color: '#2e8efb'}}>{search}</span>
      </h1>

      <SearchMenu page={page} search={search} id={myUser?._id} />

      <SearchGallery page={page} search={search} id={myUser?._id} />

      <SearchUsers page={page} search={search} />
    </>
  )
}

export default SearchPage