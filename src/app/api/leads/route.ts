import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const prisma = getPrisma();
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    
    if (!body.placeId) {
      return NextResponse.json({ error: "placeId is required" }, { status: 400 });
    }

    // Save or update lead
    const lead = await prisma.lead.upsert({
      where: {
        placeId: body.placeId,
      },
      update: {
        opportunityCategories: body.opportunityCategories || [],
        leadScore: body.leadScore,
        priority: body.priority,
        conversionProbability: body.conversionProbability,
        growthSignal: body.growthSignal,
        hasWebsite: body.hasWebsite,
        website: body.website,
        rating: body.rating,
        reviewCount: body.reviewCount,
        phone: body.phone,
      },
      create: {
        placeId: body.placeId,
        name: body.name,
        address: body.address,
        phone: body.phone,
        website: body.website,
        category: body.category,
        rating: body.rating,
        reviewCount: body.reviewCount,
        hasWebsite: body.hasWebsite,
        opportunityCategories: body.opportunityCategories || [],
        leadScore: body.leadScore,
        priority: body.priority,
        conversionProbability: body.conversionProbability,
        growthSignal: body.growthSignal,
        status: "NEW",
        competitors: {
          create: (body.competitors || []).map((c: any) => ({
            name: c.name,
            rating: c.rating,
            reviewCount: c.reviewCount,
            website: c.hasWebsite ? "Exists" : "None"
          }))
        }
      }
    });

    return NextResponse.json({ lead });
  } catch (error: any) {
    console.error("Lead save error:", error);
    return NextResponse.json({ error: "Failed to save lead", details: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const prisma = getPrisma();
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      include: { competitors: true }
    });

    return NextResponse.json({ leads });
  } catch (error: any) {
    console.error("Fetch leads error:", error);
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
  }
}
