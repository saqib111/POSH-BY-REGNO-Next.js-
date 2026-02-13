/** @format */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(_req: NextRequest) {
    return NextResponse.next();
}

// Optional: only run middleware for these paths (keep simple for now)
export const config = {
    matcher: ["/admin/:path*"],
};
