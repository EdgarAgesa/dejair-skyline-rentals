
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import bookingService from '../services/bookingService';
import authService from '../services/authService';

const BookingForm = ({ helicopter, onSuccess }) => {
  const [date, setDate] = useState(null);
  const [time, setTime] = useState("09:00");
  const [purpose, setPurpose] = useState("Sightseeing");
  const [numPassengers, setNumPassengers] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const timeOptions = [
    "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"
  ];

  const purposeOptions = [
    "Sightseeing", "Corporate Travel", "Adventure", "Special Events", "Photography", "Other"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!authService.isLoggedIn()) {
      toast({
        title: "Authentication required",
        description: "Please log in to book a helicopter",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
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
      
      // Basic price calculation (in a real app this would be more complex)
      const timeComponents = time.split(':');
      const formattedTime = `${timeComponents[0]}:${timeComponents[1]}:00`;
      const formattedDate = format(date, 'yyyy-MM-dd');
      
      const amount = helicopter.base_price || 1000; // Fallback if no price is set
      
      const bookingData = {
        helicopter_id: helicopter.id,
        date: formattedDate,
        time: formattedTime,
        purpose: purpose,
        num_passengers: parseInt(numPassengers),
        amount: amount
      };
      
      const response = await bookingService.createBooking(bookingData);
      
      toast({
        title: "Booking successful",
        description: "Your helicopter has been booked successfully.",
      });
      
      if (onSuccess) {
        onSuccess(response.booking);
      } else {
        navigate('/user-dashboard');
      }
      
    } catch (error) {
      toast({
        title: "Booking failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Select date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              disabled={(date) => date < new Date()}
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="time">Time</Label>
        <Select value={time} onValueChange={setTime}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select time" />
          </SelectTrigger>
          <SelectContent>
            {timeOptions.map((timeOption) => (
              <SelectItem key={timeOption} value={timeOption}>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  {timeOption}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="purpose">Purpose</Label>
        <Select value={purpose} onValueChange={setPurpose}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select purpose" />
          </SelectTrigger>
          <SelectContent>
            {purposeOptions.map((purposeOption) => (
              <SelectItem key={purposeOption} value={purposeOption}>
                {purposeOption}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="passengers">Number of Passengers</Label>
        <Input
          id="passengers"
          type="number"
          min={1}
          max={helicopter.capacity || 6}
          value={numPassengers}
          onChange={(e) => setNumPassengers(e.target.value)}
        />
        <p className="text-xs text-gray-500">
          Max capacity: {helicopter.capacity || 6} passengers
        </p>
      </div>
      
      <div className="pt-4">
        <Button 
          type="submit" 
          className="w-full bg-dejair-600 hover:bg-dejair-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processing..." : "Book Now"}
        </Button>
      </div>
    </form>
  );
};

export default BookingForm;
