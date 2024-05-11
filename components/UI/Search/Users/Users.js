import { getUsers } from "@/actions/userActions";
import Error from "../../Error/Error";
import ListOfUsers from "../../ListOfUsers/ListOfUsers";

const SearchUsers = async ({ page, search }) => {
  if(page !== 'users') return null;

  const res = await getUsers({ page, search });


  return (
    <>
      {
        res?.errMsg
          ? <Error errMsg={res.errMsg} />
          : <ListOfUsers
              data={res?.data}
              next_cursor={res?.next_cursor}
              fetchingData={getUsers}
              query={{ page, search }}
          />
      }
    </>
  )
}

export default SearchUsers