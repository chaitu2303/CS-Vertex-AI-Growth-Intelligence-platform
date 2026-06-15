import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get("location");
  const category = searchParams.get("category");

  if (!location || !category) {
    return NextResponse.json({ error: "Location and category are required" }, { status: 400 });
  }

  // TODO: Implement actual Google Places API integration here
  // For now, return mock data
  const mockResults = [
    {
      id: "mock-1",
      name: "Mock Business 1",
      address: `123 ${location} St`,
      rating: 4.5,
      reviewCount: 120,
      hasWebsite: false,
    },
    {
      id: "mock-2",
      name: "Mock Business 2",
      address: `456 ${location} Ave`,
      rating: 4.8,
      reviewCount: 85,
      hasWebsite: true,
      websiteQuality: "POOR", // placeholder
    }
  ];

  return NextResponse.json({ results: mockResults });
}
