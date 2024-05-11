// export { default } from 'next-auth/middleware'
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req){
    const { pathname } = req.nextUrl;
    const { token } = req.nextauth;

    const myUserId = token?.user?._id;
    const paths = [`/profile/${myUserId}/favorite`, `/profile/${myUserId}/private`];

    if(!paths.includes(pathname) && pathname.startsWith('/profile')){
      return new NextResponse('You are not authorized!');
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        return !!token; // true => middleware() is run
      }
    }
  }
)


export const config = {
  matcher: [
    "/upload/:path*",
    "/profile/:path*/private",
    "/profile/:path*/favorite",
    "/search/private/:path*"
  ]
}