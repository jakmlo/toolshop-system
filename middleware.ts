export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/",
    "/rental",
    "/return",
    "/contractors",
    "/equipment",
    "/profile",
  ],
};
