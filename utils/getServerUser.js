'use server'
const { authOptions } = require("@/app/api/auth/[...nextauth]/route")
const { getServerSession } = require("next-auth")

const getServerUser = async () => {
  const session = await getServerSession(authOptions);

  return session?.user;
} 

export default getServerUser;