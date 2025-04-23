import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PaymentConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  // Check for ?success=1 in the URL
  const isSuccess = new URLSearchParams(location.search).get('success') === '1';

  useEffect(() => {
    // Simulate loading for a short time for UX
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleBackToDashboard = () => {
    navigate('/user-dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            {isSuccess ? (
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
            ) : (
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            )}
            <CardTitle>
              {isSuccess ? 'Payment Successful!' : 'Payment Not Confirmed'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center text-gray-600 mb-6">Processing your payment...</p>
            ) : isSuccess ? (
              <div className="space-y-4">
                <p className="text-center text-gray-600 mb-6">
                  Your booking has been confirmed. A confirmation email has been sent to your registered email address.
                </p>
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-center text-sm text-gray-500">
                    If you have any questions, please contact support.
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-600 mb-6">
                Payment was not confirmed. Please check your dashboard or contact support.
              </p>
            )}
            <div className="mt-6 text-center">
              <Button onClick={handleBackToDashboard} className="w-full">
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentConfirmation;