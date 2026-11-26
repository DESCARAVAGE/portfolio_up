import { NextResponse, type NextRequest } from "next/server";

/**
 * Adresse de la chronologie tapée avec des majuscules (/Gantt, /en/GANTT…) : redirigée
 * vers /gantt. Les adresses de Next sont sensibles à la casse, et une redirection de
 * next.config ne le serait pas (elle s'appliquerait aussi à /gantt : boucle).
 * Ne tourne que sur ces adresses (matcher) ; les pages restent statiques.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const lower = pathname.toLowerCase();
  if (lower === pathname) return NextResponse.next();
  const url = request.nextUrl.clone();
  url.pathname = lower;
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: ["/((?:[eE][nN]/)?[gG][aA][nN][tT][tT])"],
};
