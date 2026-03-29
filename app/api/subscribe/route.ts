import { NextRequest, NextResponse } from "next/server";
import { addSubscriber } from "@/lib/subscribers";

export async function POST(req: NextRequest) {
  try {
    const { email, phone, name } = await req.json();

    if (!email && !phone) {
      return NextResponse.json(
        { error: "Provide at least an email or phone number." },
        { status: 400 }
      );
    }

    // Basic email format check
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 }
      );
    }

    const subscriber = addSubscriber({ email, phone, name });
    return NextResponse.json({ success: true, id: subscriber.id });
  } catch (err) {
    console.error("Subscribe error:", err);
    return NextResponse.json({ error: "Failed to subscribe." }, { status: 500 });
  }
}
