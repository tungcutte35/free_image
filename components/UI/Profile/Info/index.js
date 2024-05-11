import { getUserById } from '@/actions/userActions'
import './Info.css'
import Error from '../../Error/Error';
import Info from './Info';

const ProfileInfo = async ({ myUser, id }) => {
  const res = await getUserById({ myUser, id });

  return (
    <>
      {
        res?.errMsg
          ? <Error errMsg={res.errMsg} />
          : <Info user={res?.user} />
      }
    </>
  )
}

export default ProfileInfo