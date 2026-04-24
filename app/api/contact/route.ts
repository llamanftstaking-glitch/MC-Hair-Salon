import { NextRequest, NextResponse } from "next/server";
import { getMessages, addMessage, markRead, deleteMessage } from "@/lib/messages";

export async function GET() {
  try {
    return NextResponse.json(getMessages());
  } catch {
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const msg = addMessage({ name, email, message });
    return NextResponse.json(msg, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to save message" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id } = await req.json();
    const ok = markRead(id);
    if (!ok) return NextResponse.json({ error: "Message not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to update message" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    const ok = deleteMessage(id);
    if (!ok) return NextResponse.json({ error: "Message not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete message" }, { status: 500 });
  }
}
