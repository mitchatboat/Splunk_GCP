// app/api/analytics/predictive/route.js
import { NextResponse } from 'next/server';
const { getPredictiveAnalytics, getRiskPredictions } = require('@/lib/bigquery');

export async function GET() {
  try {
    const [anomalies, risks] = await Promise.all([
      getPredictiveAnalytics(),
      getRiskPredictions(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        anomalies,
        risks,
      },
    });
  } catch (error) {
    console.error('Predictive analytics error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 60;
