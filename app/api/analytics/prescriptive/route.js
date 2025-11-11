// app/api/analytics/prescriptive/route.js
import { NextResponse } from 'next/server';
const { getPrescriptiveRecommendations } = require('@/lib/bigquery');

export async function GET() {
  try {
    const data = await getPrescriptiveRecommendations();

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Prescriptive analytics error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 60;
