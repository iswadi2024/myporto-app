import { NextRequest, NextResponse } from 'next/server';

const APP_DOMAIN = process.env.NEXT_PUBLIC_APP_DOMAIN || 'myporto.id';

export function middleware(req: NextRequest) {
  const host = req.headers.get('host') || '';
  const url = req.nextUrl.clone();

  // Strip port for local dev
  const hostname = host.split(':')[0];

  // Check if it's a subdomain request (e.g., iswadi.myporto.id)
  const isSubdomain =
    hostname.endsWith(`.${APP_DOMAIN}`) &&
    hostname !== `www.${APP_DOMAIN}` &&
    hostname !== APP_DOMAIN;

  if (isSubdomain) {
    const username = hostname.replace(`.${APP_DOMAIN}`, '');

    // Rewrite to the portfolio page with username
    url.pathname = `/p/${username}${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
