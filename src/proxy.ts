import createMiddleware from 'next-intl/middleware';
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routing } from './i18n/routing';

// Create the next-intl middleware
const intlMiddleware = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Extract locale from pathname (e.g., /en/admin or /ru/admin)
  const localeMatch = pathname.match(/^\/(en|ru)(\/|$)/);
  const locale = localeMatch ? localeMatch[1] : '';
  const pathWithoutLocale = locale ? pathname.replace(`/${locale}`, '') : pathname;

  // Check if the request is for admin routes (with or without locale prefix)
  if (pathWithoutLocale.startsWith("/booking-portal")) {
    // Skip authentication for login page
    if (pathWithoutLocale === "/booking-portal/login") {
      return intlMiddleware(request);
    }

    // Check for admin session cookie
    const adminSession = request.cookies.get("admin_session");

    if (!adminSession) {
      // Redirect to login page with locale
      const loginUrl = new URL(`${locale ? `/${locale}` : ''}/booking-portal/login`, request.url);
      loginUrl.searchParams.set("from", pathWithoutLocale);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Run next-intl middleware for all other routes
  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for API routes and static files
  matcher: ['/', '/(ru|en)/:path*'],
};
