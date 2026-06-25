import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { registerSchema } from "@/lib/validations";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = registerSchema.parse(body);

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email: validatedData.email });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Create new user
    const user = await User.create({
      name: validatedData.name,
      email: validatedData.email,
      password: validatedData.password,
      role: "user",
    });

    // Send welcome email (don't await to avoid blocking)
    sendWelcomeEmail(user.email, user.name).catch((error) => {
      console.error("Failed to send welcome email:", error);
    });

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully",
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}
