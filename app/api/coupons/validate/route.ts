import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Coupon from "@/models/Coupon";
import { applyCouponDiscount } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const { code, subtotal } = await request.json();

    if (!code || !subtotal) {
      return NextResponse.json(
        { error: "Code and subtotal required" },
        { status: 400 }
      );
    }

    await connectDB();

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      isActive: true,
      expiresAt: { $gt: new Date() },
    });

    if (!coupon) {
      return NextResponse.json(
        { error: "Invalid or expired coupon code" },
        { status: 404 }
      );
    }

    if (coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json(
        { error: "Coupon usage limit reached" },
        { status: 400 }
      );
    }

    if (subtotal < coupon.minOrderValue) {
      return NextResponse.json(
        {
          error: `Minimum order value of ₹${coupon.minOrderValue} required`,
        },
        { status: 400 }
      );
    }

    const discount = applyCouponDiscount(subtotal, coupon.type, coupon.value);

    return NextResponse.json({
      success: true,
      data: {
        code: coupon.code,
        discount,
        type: coupon.type,
        value: coupon.value,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to validate coupon" },
      { status: 500 }
    );
  }
}
