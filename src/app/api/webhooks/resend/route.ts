import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const prisma = getPrisma();
    const body = await request.json();
    
    // Resend webhook format usually includes type and data
    const { type, data } = body;
    
    if (!data || !data.email_id) {
      return NextResponse.json({ error: "Invalid webhook payload" }, { status: 400 });
    }

    const emailId = data.email_id;
    
    let updateData: any = {};
    
    if (type === "email.delivered") {
      updateData = { status: "DELIVERED", isDelivered: true };
    } else if (type === "email.opened") {
      updateData = { status: "OPENED", isOpened: true };
    } else if (type === "email.clicked") {
      updateData = { status: "CLICKED", isClicked: true };
    } else {
      return NextResponse.json({ success: true, message: "Unhandled event type" });
    }

    await prisma.outreachActivity.updateMany({
      where: { resendId: emailId },
      data: updateData,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
