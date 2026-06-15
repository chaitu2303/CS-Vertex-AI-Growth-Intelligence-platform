import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Resend } from "resend";

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY || "mock_key");

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { subject, message, type, recipientEmail } = body;

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    let resendId = null;
    let deliveryStatus = "SENT";

    if (process.env.RESEND_API_KEY && type === "EMAIL") {
      try {
        const { data, error } = await resend.emails.send({
          from: 'CS Vertex <onboarding@resend.dev>',
          to: recipientEmail || "delivered@resend.dev", // Default test email
          subject: subject || "Digital Acquisition Strategy",
          html: `<p>${message.replace(/\n/g, '<br/>')}</p>`
        });
        
        if (error) {
          console.error("Resend API error:", error);
          deliveryStatus = "FAILED";
        } else if (data) {
          resendId = data.id;
          deliveryStatus = "DELIVERED"; // Optimistic, usually webhooks handle this
          console.log(`[RESEND] Sent email to ${recipientEmail || "delivered@resend.dev"}, ID: ${resendId}`);
        }
      } catch (err) {
        console.error("Failed to send real email via Resend:", err);
      }
    } else {
      // Mock Resend / SMTP API call
      console.log(`[MOCK EMAIL SENDER] Sending ${type} to lead ${id}...`);
      console.log(`[Subject]: ${subject || "No Subject"}`);
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    // Calculate automated next follow-up (3 days from now)
    const nextFollowUp = new Date();
    nextFollowUp.setDate(nextFollowUp.getDate() + 3);

    // Log the outreach interaction
    const activity = await prisma.outreachActivity.create({
      data: {
        leadId: id,
        type: type || "EMAIL",
        status: deliveryStatus,
        subject: subject || `${type} Follow-up`,
        body: message,
        sentAt: new Date(),
        resendId: resendId,
        isDelivered: deliveryStatus === "DELIVERED",
      }
    });

    // Automatically advance the Lead status
    await prisma.lead.update({
      where: { id },
      data: { 
        status: "PROPOSAL_SENT",
        nextFollowUp: nextFollowUp,
      }
    });

    return NextResponse.json({ success: true, activity });
  } catch (error: any) {
    console.error("Error logging email:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
