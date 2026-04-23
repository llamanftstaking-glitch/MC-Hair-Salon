import { NextRequest, NextResponse } from "next/server";
import { getSubscribers, getAllSubscribers, addSubscriber, removeSubscriber } from "@/lib/newsletter";
import { sendNewsletterEmail } from "@/lib/email";

export async function GET() {
  try {
    const subscribers = getAllSubscribers();
    return NextResponse.json(subscribers);
  } catch {
    return NextResponse.json({ error: "Failed to fetch subscribers" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Subscribe
    if (body.action === "subscribe") {
      const { email, name } = body;
      if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });
      const result = addSubscriber(email, name);
      return NextResponse.json(result, { status: result.ok ? 201 : 409 });
    }

    // Send newsletter
    if (body.action === "send") {
      const { subject, message } = body;
      if (!subject || !message) return NextResponse.json({ error: "Subject and message required" }, { status: 400 });
      const subscribers = getSubscribers();
      if (subscribers.length === 0) return NextResponse.json({ error: "No active subscribers" }, { status: 400 });
      const emails = subscribers.map(s => s.email);
      const result = await sendNewsletterEmail(emails, subject, message);
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    const ok = removeSubscriber(id);
    if (!ok) return NextResponse.json({ error: "Subscriber not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to remove subscriber" }, { status: 500 });
  }
}
