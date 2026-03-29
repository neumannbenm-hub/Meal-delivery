import { NextRequest, NextResponse } from "next/server";
import { unsubscribeByToken } from "@/lib/subscribers";

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    if (!token) {
      return NextResponse.json({ error: "Token required." }, { status: 400 });
    }
    const removed = unsubscribeByToken(token);
    if (!removed) {
      return NextResponse.json(
        { error: "Token not found or already unsubscribed." },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Unsubscribe error:", err);
    return NextResponse.json(
      { error: "Failed to unsubscribe." },
      { status: 500 }
    );
  }
}
