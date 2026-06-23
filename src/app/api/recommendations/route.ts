import { NextResponse } from "next/server";
import { getRecommendedProducts } from "@/lib/recommendations";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const exclude = searchParams.get("exclude")?.split(",").filter(Boolean) ?? [];
  const products = await getRecommendedProducts(exclude, 4);
  return NextResponse.json({ products });
}
