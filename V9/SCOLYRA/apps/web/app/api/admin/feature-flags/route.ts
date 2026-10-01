import { NextResponse } from "next/server";
import { getCurrentUser } from "../../../../lib/session";
import { getFeatureFlags } from "../../../../lib/feature-flags";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }
  const flags = await getFeatureFlags();
  return NextResponse.json({ flags });
}
