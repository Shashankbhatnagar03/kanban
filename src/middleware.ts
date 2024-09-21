// middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/api/auth/signin", // Redirect here if not authenticated
  },
});

export const config = {
  matcher: ["/dashboard", "/"], // Protect these routes
};
