import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, MessageSquare, CheckCircle } from "lucide-react";

const NegotiationDialog = ({ 
  isOpen, 
  onClose, 
  bookingId, 
  amount,
  onSuccess 
}) => {
  const [negotiatedAmount, setNegotiatedAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleNegotiation = async () => {
    if (!negotiatedAmount) {
      toast({
        title: "Amount required",
        description: "Please enter your proposed amount",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);
      
      // Submit negotiation request
      const response = await fetch(`/api/bookings/${bookingId}/negotiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          negotiated_amount: parseFloat(negotiatedAmount),
          notes: notes
        }),
      });
      
      if (!response.ok) {
        throw new Error('Negotiation request failed');
      }
      
      const data = await response.json();
      
      // Show success state
      setIsSuccess(true);
      
      // Wait a moment before closing
      setTimeout(() => {
        if (onSuccess) {
          onSuccess(data);
        }
      }, 2000);
      
    } catch (error) {
      toast({
        title: "Negotiation failed",
        description: error.message || "Failed to submit negotiation request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Request Negotiation</DialogTitle>
          <DialogDescription>
            Submit your proposed amount and any additional notes for negotiation
          </DialogDescription>
        </DialogHeader>
        
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Request Submitted!</h3>
            <p className="text-center text-gray-500">
              An admin will review your request and contact you shortly.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 py-4">
              <div className="flex items-center justify-between py-2 border-b">
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-dejair-600 mr-2" />
                  <span className="font-medium">Original Amount:</span>
                </div>
                <span className="text-2xl font-bold">${amount}</span>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">
                  Your Offer
                </Label>
                <div className="col-span-3">
                  <Input
                    id="amount"
                    type="number"
                    value={negotiatedAmount}
                    onChange={(e) => setNegotiatedAmount(e.target.value)}
                    placeholder="Enter your proposed amount"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="notes" className="text-right pt-2">
                  Notes
                </Label>
                <div className="col-span-3">
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any additional information or reason for negotiation"
                    className="min-h-[100px]"
                  />
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md mt-2">
                <div className="flex items-start">
                  <MessageSquare className="h-5 w-5 text-dejair-600 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Negotiation Process</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Your request will be reviewed by our team. We will contact you shortly to discuss the details.
                      Please provide any relevant information that might help us consider your request.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button 
                type="button" 
                onClick={handleNegotiation}
                disabled={isProcessing}
              >
                {isProcessing ? "Submitting..." : "Submit Request"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default NegotiationDialog; 