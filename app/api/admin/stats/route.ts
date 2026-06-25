import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getOrderStats } from "@/lib/services/orderService";

/**
 * GET /api/admin/stats  (admin only)
 * Order counts by status + paid revenue, for the dashboard.
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const stats = await getOrderStats();
    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
