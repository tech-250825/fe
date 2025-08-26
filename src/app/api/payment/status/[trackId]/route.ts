import { NextRequest, NextResponse } from "next/server";

const CONFIG = {
  merchantApiKey: process.env.OXAPAY_MERCHANT_API_KEY || 'sandbox',
  apiBaseUrl: 'https://api.oxapay.com'
};

interface OxaPayStatusResponse {
  result: number;
  message: string;
  status?: string;
  amount?: number;
  currency?: string;
  orderId?: string;
  date?: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { trackId: string } }
) {
  try {
    const { trackId } = params;

    if (!trackId) {
      return NextResponse.json(
        { success: false, error: 'Track ID is required' },
        { status: 400 }
      );
    }

    const requestData = {
      merchant: CONFIG.merchantApiKey,
      trackId: trackId
    };

    const response = await fetch(`${CONFIG.apiBaseUrl}/merchants/inquiry`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      throw new Error(`OxaPay API error: ${response.status}`);
    }

    const data: OxaPayStatusResponse = await response.json();

    if (data.result === 100) {
      return NextResponse.json({
        success: true,
        paymentInfo: {
          status: data.status,
          amount: data.amount,
          currency: data.currency,
          orderId: data.orderId,
          date: data.date,
          trackId: trackId
        }
      });
    } else {
      return NextResponse.json(
        { success: false, error: data.message || 'Failed to retrieve payment status' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Payment status error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check payment status' },
      { status: 500 }
    );
  }
}