import NextAuth from "next-auth/next";
import UserModel from "@/models/userModel";
import GoogleProvider from 'next-auth/providers/google';
import connectDB from "@/utils/database";

connectDB();

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ],
  pages: {
    signIn: '/'
  },
  callbacks: {
    async signIn({ profile }){
      return await signInWithOAuth({ profile });
    },
    async jwt({ token }){
      const user = await getUserByEmail({ email: token.email });
      token.user = user;

      return token;
    },
    async session({ session, token }){
      session.user = token.user;
      return session;
    }
  }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

/*----------------------------------------------*/
async function signInWithOAuth({ profile }){
  const user = await UserModel.exists({email: profile.email});
  if(user) return true; // signin

  //if !user => sign up => sign in
  const newUser = new UserModel({
    name: profile.name,
    email: profile.email,
    avatar: profile.picture
  });

  await newUser.save();

  return true;
}

async function getUserByEmail({ email }){
  const user = await UserModel.findOne({ email });
  if(!user) throw new Error('Email does not exist!');

  const newUser = {
    ...user._doc,
    _id: user._id.toString(),
    total_followers: user.followers.length,
    total_followings: user.followings.length,
    followers: [],
    followings: [],
    my_user: true
  }

  return newUser;
}