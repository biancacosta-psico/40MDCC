export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/home/:path*",
    "/movimentos/:path*",
    "/diario/:path*",
    "/dashboard/:path*",
    "/manutencao/:path*",
  ],
};
