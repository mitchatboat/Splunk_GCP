// app/api/analytics/diagnostic/route.js
import { NextResponse } from 'next/server';
const { getDiagnosticAnalysis } = require('@/lib/bigquery');

export async function GET() {
  try {
    const data = await getDiagnosticAnalysis();

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Diagnostic analytics error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 60;
