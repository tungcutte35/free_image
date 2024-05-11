import getServerUser from '@/utils/getServerUser'
import './Nav.css'
import NavBar from './NavBar'

const Nav = async () => {
  const user = await getServerUser();

  return (
    <NavBar user={user} />
  )
}

export default Nav