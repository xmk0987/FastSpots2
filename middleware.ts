import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("spotify_access_token");
  const refreshToken = req.cookies.get("spotify_refresh_token");

  if (!accessToken && refreshToken) {
    const refreshUrl = new URL("/api/refreshToken", req.url);
    refreshUrl.searchParams.set("redirectTo", req.nextUrl.href);

    return NextResponse.redirect(refreshUrl);
  }

  if (!accessToken && !refreshToken) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/toplists", "/playlists"],
};
