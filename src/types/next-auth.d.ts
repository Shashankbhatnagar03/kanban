import { DefaultSession } from "next-auth";
import "nextAuth";

declare module "next-auth" {
  interface User {
    _id?: string;
    name: string;
    email: string;
  }
  interface Session {
    user: {
      _id?: string;
      email: string;
      name: string;
    } & DefaultSession["user"];
  }
}
