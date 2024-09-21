import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/user";
import { authConfig } from "@/auth.config";
import { NextAuthOptions } from "next-auth";

// Define interfaces for credentials and user
interface Credentials {
  email: string;
  password: string;
}

interface UserType {
  _id: string;
  email: string;
  password: string; // Add other user properties as needed
}

export const authOptions: NextAuthOptions = {
  ...authConfig,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      // @ts-ignore
      async authorize(credentials: Credentials): Promise<UserType | null> {
        await dbConnect();
        try {
          const user = await User.findOne({
            email: credentials.email,
          });
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
            return user as UserType; // Cast to UserType
          }
        } catch (err) {
          throw new Error(
            err instanceof Error ? err.message : "An error occurred"
          );
        }
      },
    }),
  ],

  callbacks: {
    // @ts-ignore
    async jwt({ token, user }: { token: any; user?: UserType }) {
      // Specify token type
      if (user) {
        token._id = user._id.toString();
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      // Specify session and token types
      if (token) {
        session.user._id = token._id;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/signin",
  },
};
