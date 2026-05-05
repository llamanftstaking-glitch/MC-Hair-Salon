import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin");
  const isScanRoute  = pathname.startsWith("/scan");

  if (isAdminRoute || isScanRoute) {
    // TEMPORARY: open admin for testing. Set ADMIN_OPEN_ACCESS=false (or
    // delete the secret) to re-enable auth before public launch.
    if (process.env.ADMIN_OPEN_ACCESS === "true") {
      return NextResponse.next();
    }

    const token = req.cookies.get("mc-session")?.value;

    if (!token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const payload = await verifyToken(token);
    if (!payload) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (isAdminRoute && !payload.isAdmin) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/scan/:path*", "/scan"],
};
