import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const CANONICAL_HOST = "wasimandrayan.eu";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";

  // Redirect any .vercel.app traffic to the custom domain
  if (host.includes(".vercel.app")) {
    const url = new URL(request.url);
    url.host = CANONICAL_HOST;
    url.protocol = "https";
    url.port = "";
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  // Run on all routes except static files and api routes
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
