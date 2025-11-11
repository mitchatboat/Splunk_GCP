// app/api/analytics/descriptive/route.js
import { NextResponse } from 'next/server';
const { getDescriptiveAnalytics, getTopFailedLogins, getTimelineData } = require('@/lib/bigquery');

export async function GET() {
  try {
    const [summary, topFailed, timeline] = await Promise.all([
      getDescriptiveAnalytics(),
      getTopFailedLogins(),
      getTimelineData(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        summary,
        topFailed,
        timeline,
      },
    });
  } catch (error) {
    console.error('Descriptive analytics error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 60; // Cache for 60 seconds
