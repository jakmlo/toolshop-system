export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    // "/((?!api|_next/static|/|_next/image|favicon.ico|/api/auth/.*|/auth/.*|/password/reset).*)/",
    "/dashboard/:path*",
    "/rental/:path*",
    "/return/:path*",
    "/contractors/:path*",
    "/equipment/:path*",
    "/profile/:path*",
    "/workspaces/:path*",
  ],
};
