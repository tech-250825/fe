import { NextRequest, NextResponse } from "next/server";

const CONFIG = {
  merchantApiKey: process.env.OXAPAY_MERCHANT_API_KEY || 'sandbox',
  apiBaseUrl: 'https://api.oxapay.com',
  domain: process.env.NODE_ENV === 'production' 
    ? 'https://api.hoit.ai.kr' 
    : 'http://localhost:3000'
};

interface CreateInvoiceRequest {
  amount: number;
  currency?: string;
  description?: string;
}

interface OxaPayResponse {
  result: number;
  message: string;
  payLink?: string;
  trackId?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = 'USDT', description = '' }: CreateInvoiceRequest = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid amount' },
        { status: 400 }
      );
    }

    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    const requestData = {
      merchant: CONFIG.merchantApiKey,
      amount: amount,
      currency: currency,
      orderId: orderId,
      description: description || `Credit purchase #${orderId}`,
      callbackUrl: `${CONFIG.domain}/api/payment/callback`,
      returnUrl: `${CONFIG.domain}/payment-success`,
      lifeTime: 30, // 30 minutes validity
      feePaidByPayer: 0, // Merchant pays fees
      underPaidCover: 1.0 // 1% underpayment tolerance
    };

    const response = await fetch(`${CONFIG.apiBaseUrl}/merchants/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      throw new Error(`OxaPay API error: ${response.status}`);
    }

    const data: OxaPayResponse = await response.json();

    if (data.result === 100) {
      return NextResponse.json({
        success: true,
        paymentData: {
          payLink: data.payLink,
          trackId: data.trackId,
          orderId: orderId,
          amount: amount,
          currency: currency
        }
      });
    } else {
      return NextResponse.json(
        { success: false, error: data.message || 'Payment creation failed' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Payment processing failed' },
      { status: 500 }
    );
  }
}