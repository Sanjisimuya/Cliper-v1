import { NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const allJobs = await db.select().from(schema.jobs).orderBy(desc(schema.jobs.createdAt)).limit(30);
    return NextResponse.json(allJobs);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to list jobs" }, { status: 500 });
  }
}
