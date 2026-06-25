import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Settings from "@/models/Settings";
import { auth } from "@/lib/auth";

/** GET /api/settings — public, returns storefront settings */
export async function GET() {
  try {
    await connectDB();
    let settings = await Settings.findOne().lean();
    if (!settings) {
      settings = await Settings.create({});
      settings = JSON.parse(JSON.stringify(settings));
    }
    return NextResponse.json({ success: true, data: settings });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Failed to fetch settings" }, { status: 500 });
  }
}

/** PUT /api/settings — admin only, update storefront settings */
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();

    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create(body);
    } else {
      Object.assign(settings, body);
      await settings.save();
    }

    return NextResponse.json({ success: true, data: settings });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
