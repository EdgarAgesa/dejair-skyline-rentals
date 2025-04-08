import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, Clock, Users, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import PaymentDialog from './PaymentDialog';

const BookingDialog = ({ 
  isOpen, 
  onClose, 
  helicopter, 
  tour = null, 
  onBookingComplete 
}) => {
  const [date, setDate] = useState(null);
  const [time, setTime] = useState("12:00");
  const [numPassengers, setNumPassengers] = useState(1);
  const [purpose, setPurpose] = useState(tour ? tour.name : "Custom booking");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [isNegotiating, setIsNegotiating] = useState(false);
  const [negotiatedAmount, setNegotiatedAmount] = useState(1);
  const [negotiationNotes, setNegotiationNotes] = useState("");
  const { toast } = useToast();

  const timeOptions = [
    "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!date) {
      toast({
        title: "Date required",
        description: "Please select a booking date",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Format date and time
      const formattedDate = format(date, 'yyyy-MM-dd');
      const timeComponents = time.split(':');
      const formattedTime = `${timeComponents[0]}:${timeComponents[1]}:00`;
      
      // Set initial amount to 1 as requested
      const amount = 1;
      
      const bookingData = {
        helicopter_id: helicopter.id,
        date: formattedDate,
        time: formattedTime,
        purpose: purpose,
        num_passengers: parseInt(numPassengers),
        amount: amount,
        notes: notes
      };
      
      // Create booking
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create booking');
      }
      
      const data = await response.json();
      setBookingId(data.id);
      
      // Don't close the dialog yet, wait for payment or negotiation
      return data;
      
    } catch (error) {
      toast({
        title: "Booking failed",
        description: error.message || "Failed to create booking. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayNow = async () => {
    const booking = await handleSubmit(new Event('submit'));
    if (booking) {
      setShowPaymentDialog(true);
    }
  };

  const handleNegotiate = async () => {
    try {
      setIsNegotiating(true);
      
      const booking = await handleSubmit(new Event('submit'));
      if (!booking) return;
      
      // Send negotiation request
      const response = await fetch(`/api/bookings/${booking.id}/negotiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          negotiated_amount: negotiatedAmount,
          notes: negotiationNotes
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit negotiation request');
      }
      
      toast({
        title: "Negotiation request submitted",
        description: "An admin will contact you shortly to discuss your booking.",
      });
      
      onClose();
      if (onBookingComplete) {
        onBookingComplete(booking);
      }
    } catch (error) {
      toast({
        title: "Negotiation failed",
        description: error.message || "Failed to submit negotiation request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsNegotiating(false);
    }
  };

  const handlePaymentComplete = () => {
    setShowPaymentDialog(false);
    onClose();
    if (onBookingComplete) {
      onBookingComplete({ id: bookingId });
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Book {helicopter.name}{tour ? ` - ${tour.name}` : ''}</DialogTitle>
            <DialogDescription>
              Enter your booking details below
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  Date
                </Label>
                <div className="col-span-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left font-normal ${!date && "text-muted-foreground"}`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="time" className="text-right">
                  Time
                </Label>
                <div className="col-span-3">
                  <Select value={time} onValueChange={setTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="passengers" className="text-right">
                  Passengers
                </Label>
                <div className="col-span-3">
                  <Select 
                    value={numPassengers.toString()} 
                    onValueChange={(value) => setNumPassengers(parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select number of passengers" />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(helicopter.capacity)].map((_, i) => (
                        <SelectItem key={i} value={(i+1).toString()}>
                          {i+1} {i === 0 ? 'passenger' : 'passengers'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="purpose" className="text-right">
                  Purpose
                </Label>
                <div className="col-span-3">
                  <Input
                    id="purpose"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    placeholder="Purpose of booking"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">
                  Notes
                </Label>
                <div className="col-span-3">
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any additional notes or requirements"
                  />
                </div>
              </div>
            </div>
            
            <Tabs defaultValue="pay-now" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="pay-now">Pay Now</TabsTrigger>
                <TabsTrigger value="negotiate">Negotiate</TabsTrigger>
              </TabsList>
              
              <TabsContent value="pay-now">
                <div className="flex items-center justify-between py-4">
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 text-dejair-600 mr-2" />
                    <span className="font-medium">Initial Price:</span>
                  </div>
                  <span className="text-xl font-bold">$1</span>
                </div>
                
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="button" 
                    onClick={handlePayNow}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Processing..." : "Pay Now"}
                  </Button>
                </DialogFooter>
              </TabsContent>
              
              <TabsContent value="negotiate">
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="negotiated-amount" className="text-right">
                      Your Offer
                    </Label>
                    <div className="col-span-3">
                      <div className="flex items-center">
                        <DollarSign className="h-5 w-5 text-dejair-600 mr-2" />
                        <Input
                          id="negotiated-amount"
                          type="number"
                          min="1"
                          value={negotiatedAmount}
                          onChange={(e) => setNegotiatedAmount(parseFloat(e.target.value))}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="negotiation-notes" className="text-right">
                      Notes
                    </Label>
                    <div className="col-span-3">
                      <Textarea
                        id="negotiation-notes"
                        value={negotiationNotes}
                        onChange={(e) => setNegotiationNotes(e.target.value)}
                        placeholder="Explain why you're requesting this price"
                      />
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="button" 
                    onClick={handleNegotiate}
                    disabled={isNegotiating}
                  >
                    {isNegotiating ? "Submitting..." : "Submit Negotiation"}
                  </Button>
                </DialogFooter>
              </TabsContent>
            </Tabs>
          </form>
        </DialogContent>
      </Dialog>
      
      {showPaymentDialog && bookingId && (
        <PaymentDialog
          isOpen={showPaymentDialog}
          onClose={() => setShowPaymentDialog(false)}
          bookingId={bookingId}
          amount={1}
          onSuccess={handlePaymentComplete}
        />
      )}
    </>
  );
};

export default BookingDialog; 