import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PaymentDialog = ({
  isOpen,
  onClose,
  onProcessPayment,
  booking,
  isLoading,
  error,
  isSuccess,
  successMessage,
  isPending,
  pendingMessage,
}) => {
  const [phoneNumber, setPhoneNumber] = useState("");

  if (!booking) {
    return null;
  }

  const handlePayment = () => {
    if (!booking) {
      return;
    }

    // Use final_amount if available, otherwise use original_amount
    const paymentAmount = booking.final_amount === null ? booking.original_amount : booking.final_amount;

    if (!paymentAmount) {
      return;
    }

    // Format phone number to remove any spaces or special characters
    const formattedPhone = phoneNumber.replace(/\D/g, '');
    if (!formattedPhone || formattedPhone.length < 9) {
      return;
    }

    // Convert amount to string and ensure it's a valid number
    onProcessPayment(booking.id, formattedPhone, String(Number(paymentAmount)));
  };

  // Get the display amount - use final_amount if available, otherwise use original_amount
  const displayAmount = booking.final_amount === null ? booking.original_amount : booking.final_amount;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pay for Booking #{booking.id}</DialogTitle>
          <DialogDescription>
            Enter your phone number to initiate the payment. Amount: ${displayAmount}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            id="phone-number"
            type="tel"
            placeholder="Enter phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handlePayment} disabled={isLoading}>
            {isLoading ? "Processing..." : "Pay Now"}
          </Button>
        </DialogFooter>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {isSuccess && <p className="text-green-500 mt-2">{successMessage}</p>}
        {isPending && <p className="text-yellow-500 mt-2">{pendingMessage}</p>}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;