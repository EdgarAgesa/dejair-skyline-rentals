import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import bookingService from '../services/bookingService';

const PaymentDialog = ({ 
  isOpen, 
  onClose, 
  booking, 
  onProcessPayment,
  isLoading,
  error,
  isSuccess,
  successMessage,
  isPending,
  pendingMessage
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const { toast } = useToast();

  const handlePayment = async () => {
    if (!phoneNumber) {
      toast({
        title: "Phone number required",
        description: "Please enter your phone number to proceed with payment.",
        variant: "destructive",
      });
      return;
    }

    if (!booking || !booking.id) {
      toast({
        title: "Invalid booking",
        description: "No booking selected for payment.",
        variant: "destructive",
      });
      return;
    }

    try {
      await onProcessPayment(booking.id, phoneNumber);
    } catch (error) {
      toast({
        title: "Payment failed",
        description: error.message || "Failed to process payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Your Booking</DialogTitle>
          <DialogDescription>
            Please enter your phone number to process the payment of ${booking?.final_amount || booking?.amount}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          <div className="text-sm text-gray-500">
            <p>Booking ID: {booking?.id}</p>
            <p>Amount: ${booking?.final_amount || booking?.amount}</p>
          </div>

          {error && (
            <div className="text-sm text-red-500">
              {error}
            </div>
          )}

          {isSuccess && (
            <div className="text-sm text-green-500">
              {successMessage}
            </div>
          )}

          {isPending && (
            <div className="text-sm text-yellow-500">
              {pendingMessage}
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handlePayment} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Pay Now'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog; 