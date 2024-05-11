import { getPhotosCount } from '@/actions/photoActions'
import './Menu.css'
import { getUsersCount } from '@/actions/userActions'
import Link from 'next/link'
import formatNumber from '@/utils/formatNumber'

const SearchMenu = async ({ page, search, id }) => {

  // Show only photos, users, private pages.
  const pages = ['photos', 'users', 'private'];
  if(!pages.includes(page)) return null;
  
  const [photos_count, users_count, pri_count] = await Promise.all([
    getPhotosCount({ page: 'photos', search }),
    getUsersCount({ page: 'users', search }),
    id ? getPhotosCount({ page: 'private', search, id }) : 0
  ])


  return (
    <div className='menu_container'>
      
      <ul className="container">
        <li className={page === 'photos' ? 'active' : ''}>
          <Link href={`/search/photos/${search}`}>
            <i className='material-icons'>collections</i>
            <div>
              Photos {formatNumber(photos_count)}
            </div>
          </Link>
        </li>

        <li className={page === 'users' ? 'active' : ''}>
          <Link href={`/search/users/${search}`}>
            <i className='material-icons'>people</i>
            <div>
              Users {formatNumber(users_count)}
            </div>
          </Link>
        </li>

        {
          id
            ? <li className={page === 'private' ? 'active' : ''}>
              <Link href={`/search/private/${search}`}>
                <i className='material-icons'>lock</i>
                <div>
                  Pri<b>vate</b> <span>Photos</span> {formatNumber(pri_count)}
                </div>
              </Link>
            </li>
            : null
        }
        
      </ul>

    </div>
  )
}

export default SearchMenu