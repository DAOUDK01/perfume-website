import { NextResponse } from "next/server";

export async function GET() {
  // If this endpoint is reached, it means middleware allowed the request
  return NextResponse.json({ 
    message: "Admin access successful",
    authenticated: true,
    timestamp: new Date().toISOString()
  });
}