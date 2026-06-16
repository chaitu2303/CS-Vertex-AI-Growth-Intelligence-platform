import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get("location");
  const category = searchParams.get("category");

  if (!location || !category) {
    return NextResponse.json({ error: "Location and category are required" }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Google Places API key is missing" }, { status: 500 });
  }

  const query = `${category} in ${location}`;

  try {
    const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.websiteUri",
      },
      body: JSON.stringify({
        textQuery: query,
        maxResultCount: 10,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Google Places API error:", err);
      return NextResponse.json({ error: "Failed to fetch from Google Places API" }, { status: response.status });
    }

    const data = await response.json();
    
    const results = (data.places || []).map((place: any) => ({
      id: place.id,
      name: place.displayName?.text || "Unknown",
      address: place.formattedAddress || "No address",
      rating: place.rating || 0,
      reviewCount: place.userRatingCount || 0,
      hasWebsite: !!place.websiteUri,
      websiteUri: place.websiteUri || null,
    }));

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Places API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
