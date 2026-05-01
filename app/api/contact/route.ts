import { NextRequest, NextResponse } from "next/server";
import { getMessages, addMessage, markRead, deleteMessage } from "@/lib/messages";
import { requireAdmin } from "@/lib/auth";
import { sendContactReply, sendNewContactNotification } from "@/lib/email";

// GET — admin only
export async function GET() {
  const err = await requireAdmin();
  if (err) return err;
  try {
    return NextResponse.json(await getMessages());
  } catch {
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

// POST — public (contact form submission)
export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (name.length > 120 || email.length > 254 || message.length > 5000) {
      return NextResponse.json({ error: "Input too long" }, { status: 400 });
    }
    const trimmedName    = name.trim();
    const trimmedEmail   = email.trim().toLowerCase();
    const trimmedMessage = message.trim();

    const msg = await addMessage({ name: trimmedName, email: trimmedEmail, message: trimmedMessage });

    // Auto-reply to client — non-fatal if Resend key isn't configured yet
    sendContactReply(trimmedEmail, trimmedName, trimmedMessage).catch(err =>
      console.error("[contact] Auto-reply failed:", err)
    );
    // Notify the salon inbox so the owner sees the message in their email
    sendNewContactNotification(msg).catch(err =>
      console.error("[contact] Salon notification failed:", err)
    );

    return NextResponse.json(msg, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to save message" }, { status: 500 });
  }
}

// PATCH — admin only
export async function PATCH(req: NextRequest) {
  const err = await requireAdmin();
  if (err) return err;
  try {
    const { id } = await req.json();
    const ok = await markRead(id);
    if (!ok) return NextResponse.json({ error: "Message not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to update message" }, { status: 500 });
  }
}

// DELETE — admin only
export async function DELETE(req: NextRequest) {
  const err = await requireAdmin();
  if (err) return err;
  try {
    const { id } = await req.json();
    const ok = await deleteMessage(id);
    if (!ok) return NextResponse.json({ error: "Message not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete message" }, { status: 500 });
  }
}
