import { DecisionMode, Flagship, LogLevel } from "./lib/flagship.jamstack";
import { NextResponse } from "next/server";
import BucketingData from "./bucketing.json";
const envId = "blvo2kijq6pg023l8ee0";

// This function can be marked `async` if using `await` inside
export async function middleware(request) {
  const flagship = Flagship.start(envId, "api_key", {
    fetchNow: false,
    decisionMode: DecisionMode.BUCKETING,
    initialBucketing: BucketingData,
    logLevel: LogLevel.NONE,
  });

  // Create a new visitor
  const visitor = flagship?.newVisitor({
    visitorId: "my_visitor_id",
    context: {},
  });

  // Fetch flags
  await visitor?.fetchFlags();
  const showBanner = visitor.getFlag("showBanner", false).getValue(false);

  const url = new URL("/middleware-page", request.url);
  url.search = `?showBanner=${showBanner}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: "/middleware",
};
