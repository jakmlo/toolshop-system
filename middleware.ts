export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/rental/:path*",
    "/return/:path*",
    "/contractors/:path*",
    "/equipment/:path*",
    "/profile/:path*",
    "/workspaces/:path*",
  ],
};
