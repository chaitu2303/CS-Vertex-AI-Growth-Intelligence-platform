import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        activities: {
          orderBy: { createdAt: 'desc' }
        },
        competitors: true
      }
    });

    if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

    return NextResponse.json({ lead });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch lead" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    
    const lead = await prisma.lead.update({
      where: { id },
      data: {
        status: body.status,
        notes: body.notes,
      },
    });

    return NextResponse.json({ lead });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update lead" }, { status: 500 });
  }
}
