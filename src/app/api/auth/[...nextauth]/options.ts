// import NextAuthOptions from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/user";
import { authConfig } from "@/auth.config";

// console.log(authConfig);
export const authOptions = {
  ...authConfig,
  providers: [
    CredentialsProvider({
      //   id: "credentials",
      name: "credentials",
      credentials: {},

      async authorize(credentials: any): Promise<any> {
        // console.log(credentials);
        await dbConnect();
        try {
          const user = await User.findOne({
            email: credentials.email,
          });
          // console.log(user);
          if (!user) {
            throw new Error("No user found");
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isPasswordValid) {
            throw new Error("Password is incorrect");
          } else {
            return user;
          }
        } catch (err: any) {
          //   console.log(error);
          throw new Error(err);
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token?._id;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/signin",
  },
};
