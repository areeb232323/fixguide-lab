import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Reporting requires a database connection. Connect Supabase to enable this feature." },
    { status: 503 },
  );
}
