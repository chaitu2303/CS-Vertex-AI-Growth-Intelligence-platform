import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import * as cheerio from "cheerio";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { website, name, rating, reviewCount } = body;

    if (!website || website === "false") {
      let conversionProbability = 50; // High base for no website
      let growthSignal = 70; // Base growth signal for missing website

      if (rating && rating >= 4.0) {
        conversionProbability += 20;
        growthSignal += 10;
      }
      if (reviewCount && reviewCount > 50) {
        conversionProbability += 15;
        growthSignal += 15;
      }
      
      const competitors = [
        { name: `Top Local ${body.category || 'Competitor'} A`, rating: 4.8, reviewCount: (reviewCount || 50) + 85, hasWebsite: true },
        { name: `Established ${body.category || 'Competitor'} B`, rating: 4.6, reviewCount: (reviewCount || 50) + 32, hasWebsite: true },
        { name: `Nearby ${body.category || 'Competitor'} C`, rating: 4.3, reviewCount: (reviewCount || 50) - 15, hasWebsite: false },
      ];
      
      return NextResponse.json({
        score: 95,
        priority: "HIGH",
        issues: ["No website found", "Missing digital presence"],
        recommendations: ["Build a modern, mobile-responsive website", "Claim Google Business Profile", "Set up social media profiles"],
        categories: ["Website Opportunity", "Marketing Opportunity"],
        conversionProbability: Math.min(95, conversionProbability),
        growthSignal: Math.min(95, growthSignal),
        competitors,
      });
    }

    let isSslValid = website.startsWith("https://");
    let urlToFetch = website;
    if (!urlToFetch.startsWith("http")) {
      urlToFetch = "https://" + urlToFetch;
      isSslValid = true;
    }

    try {
      const start = Date.now();
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      const res = await fetch(urlToFetch, { signal: controller.signal, headers: { 'User-Agent': 'Mozilla/5.0' } });
      clearTimeout(timeoutId);
      
      const loadTime = Date.now() - start;
      const html = await res.text();
      
      const $ = cheerio.load(html);
      
      const issues = [];
      const recommendations = [];
      const categories = [];
      let score = 100;

      if (!res.url.startsWith("https")) {
        isSslValid = false;
        issues.push("No SSL (Not secure)");
        recommendations.push("Install SSL certificate");
        categories.push("Website Opportunity");
        score -= 20;
      }

      const viewport = $('meta[name="viewport"]').attr("content");
      if (!viewport) {
        issues.push("Poor mobile experience (Missing viewport tag)");
        recommendations.push("Implement mobile-responsive design");
        if (!categories.includes("Website Opportunity")) categories.push("Website Opportunity");
        score -= 20;
      }

      const title = $("title").text();
      const metaDesc = $('meta[name="description"]').attr("content");
      if (!title || title.length < 5) {
        issues.push("Missing or short Title tag");
        score -= 10;
        if (!categories.includes("SEO Opportunity")) categories.push("SEO Opportunity");
      }
      if (!metaDesc || metaDesc.length < 10) {
        issues.push("Missing Meta Description");
        score -= 10;
        if (!categories.includes("SEO Opportunity")) categories.push("SEO Opportunity");
      }
      if (issues.includes("Missing or short Title tag") || issues.includes("Missing Meta Description")) {
        recommendations.push("Optimize On-Page SEO (Title, Meta Description)");
      }

      const hasMailto = html.includes("mailto:");
      const hasForm = $("form").length > 0;
      const hasContactLink = $("a").filter((i, el) => $(el).text().toLowerCase().includes("contact")).length > 0;
      if (!hasMailto && !hasForm && !hasContactLink) {
        issues.push("No obvious contact method or form");
        recommendations.push("Add lead capture forms and clear contact info");
        categories.push("CRM Opportunity");
        score -= 15;
      }

      if (loadTime > 3000) {
        issues.push(`Slow loading time (${(loadTime/1000).toFixed(1)}s)`);
        recommendations.push("Optimize website performance and hosting");
        score -= 15;
      }

      let priority = "LOW";
      if (score < 50) priority = "HIGH";
      else if (score < 80) priority = "MEDIUM";

      let conversionProbability = 30; // base probability
      let growthSignal = 40; // base growth signal

      if (rating && rating >= 4.0) {
        conversionProbability += 15;
        growthSignal += 15;
      }
      if (reviewCount && reviewCount > 20) {
        conversionProbability += 10;
        growthSignal += 10;
      }
      if (reviewCount && reviewCount > 100) {
        conversionProbability += 10;
        growthSignal += 15;
      }
      if (issues.length > 2) {
        conversionProbability += 20;
        growthSignal += 15;
      }

      const competitors = [
        { name: `Top Local ${body.category || 'Competitor'} A`, rating: 4.8, reviewCount: (reviewCount || 50) + 85, hasWebsite: true },
        { name: `Established ${body.category || 'Competitor'} B`, rating: 4.6, reviewCount: (reviewCount || 50) + 32, hasWebsite: true },
        { name: `Nearby ${body.category || 'Competitor'} C`, rating: 4.3, reviewCount: (reviewCount || 50) - 15, hasWebsite: false },
      ];

      return NextResponse.json({
        score: Math.max(0, score),
        priority,
        issues: issues.length > 0 ? issues : ["Website is well optimized"],
        recommendations: recommendations.length > 0 ? recommendations : ["Maintain current standards"],
        categories: categories.length > 0 ? categories : ["Monitoring"],
        conversionProbability: Math.min(95, conversionProbability),
        growthSignal: Math.min(95, growthSignal),
        competitors,
      });

    } catch (err: any) {
      let conversionProbability = 40;
      let growthSignal = 50;

      if (rating && rating >= 4.0) {
        conversionProbability += 20;
        growthSignal += 15;
      }
      if (reviewCount && reviewCount > 50) {
        conversionProbability += 15;
        growthSignal += 15;
      }

      const competitors = [
        { name: `Top Local ${body.category || 'Competitor'} A`, rating: 4.8, reviewCount: (reviewCount || 50) + 85, hasWebsite: true },
        { name: `Established ${body.category || 'Competitor'} B`, rating: 4.6, reviewCount: (reviewCount || 50) + 32, hasWebsite: true },
        { name: `Nearby ${body.category || 'Competitor'} C`, rating: 4.3, reviewCount: (reviewCount || 50) - 15, hasWebsite: false },
      ];

      return NextResponse.json({
        score: 80,
        priority: "HIGH",
        issues: ["Website is unreachable or down", err.message],
        recommendations: ["Investigate hosting issues", "Provide reliable web hosting"],
        categories: ["Website Opportunity"],
        conversionProbability: Math.min(95, conversionProbability),
        growthSignal: Math.min(95, growthSignal),
        competitors,
      });
    }
  } catch (error) {
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
