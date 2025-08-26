import { CheckCircle, Home, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>
          
          <p className="text-gray-600 mb-8 leading-relaxed">
            Your payment has been processed successfully. Your credits will be added to your account shortly.
          </p>
          
          <div className="space-y-3">
            <Link href="/" className="block">
              <Button className="w-full">
                <Home className="w-4 h-4 mr-2" />
                Return to Dashboard
              </Button>
            </Link>
            
            <Link href="/profile" className="block">
              <Button variant="outline" className="w-full">
                <Coins className="w-4 h-4 mr-2" />
                View My Credits
              </Button>
            </Link>
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> It may take a few minutes for your credits to appear in your account. 
              If you don't see them after 10 minutes, please contact support.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}