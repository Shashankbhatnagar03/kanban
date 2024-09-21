import { SessionStrategy } from "next-auth";

export const authConfig = {
  session: {
    strategy: "jwt" as SessionStrategy,
  },
  providers: [],
};
