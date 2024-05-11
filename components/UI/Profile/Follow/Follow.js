import { getUsers } from '@/actions/userActions';
import './Follow.css'
import Error from '../../Error/Error';
import ListOfUsers from '../../ListOfUsers/ListOfUsers';
import Modal from '../../Modal/Modal';

const ProfileFollow = async ({ id, page }) => {
  // Show only follower, following pages.
  if(page !== 'follower' && page !== 'following') return null;

  const sort = 'updatedAt';
  const res = await getUsers({ id, page, sort });

  return (
    <Modal url={`/profile/${id}`}>
       <div className='follow'>
      
        <h1>List of {page}</h1>

        {
          res?.errMsg
            ? <Error errMsg={res.errMsg} />
            : <ListOfUsers
                data={res?.data}
                next_cursor={res?.next_cursor}
                fetchingData={getUsers}
                query={{ id, page, sort }}
            />
        }

      </div>
    </Modal>
   
  )
}

export default ProfileFollow