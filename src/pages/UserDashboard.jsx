
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CalendarCheck, Clock, MapPin, Plane, PenLine, Ban, DollarSign } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import authService from '../services/authService';
import bookingService from '../services/bookingService';

const UserDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState('User');
  const [activeBookingId, setActiveBookingId] = useState(null);
  const [negotiationAmount, setNegotiationAmount] = useState('');
  const [negotiationNotes, setNegotiationNotes] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showNegotiationDialog, setShowNegotiationDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [isNegotiatedPayment, setIsNegotiatedPayment] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const data = await bookingService.getClientBookings();
      setBookings(data);
    } catch (error) {
      toast({
        title: "Error fetching bookings",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = authService.isLoggedIn();
    const isAdmin = authService.isAdmin();
    
    if (!isLoggedIn) {
      // Redirect to login if not logged in
      toast({
        title: "Authentication required",
        description: "Please log in to access your dashboard",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
    if (isAdmin) {
      // Redirect admins to admin dashboard
      navigate('/admin-dashboard');
      return;
    }
    
    // Get user data
    const user = authService.getCurrentUser();
    if (user && user.name) {
      setUserName(user.name);
    }
    
    // Fetch user bookings
    fetchBookings();
  }, [navigate, toast]);

  const handleCancelBooking = (id) => {
    // In a real app, you would make an API call to cancel the booking
    toast({
      title: "Cancel booking",
      description: "This feature is coming soon!",
    });
  };

  const openNegotiationDialog = (booking) => {
    setActiveBookingId(booking.id);
    setNegotiationAmount(booking.original_amount * 0.9); // Suggest 10% discount
    setShowNegotiationDialog(true);
  };

  const closeNegotiationDialog = () => {
    setShowNegotiationDialog(false);
    setActiveBookingId(null);
    setNegotiationAmount('');
    setNegotiationNotes('');
  };

  const openPaymentDialog = (booking, isNegotiated = false) => {
    setActiveBookingId(booking.id);
    setIsNegotiatedPayment(isNegotiated);
    setShowPaymentDialog(true);
  };

  const closePaymentDialog = () => {
    setShowPaymentDialog(false);
    setActiveBookingId(null);
    setPhoneNumber('');
    setIsNegotiatedPayment(false);
  };

  const handleRequestNegotiation = async () => {
    try {
      const response = await bookingService.requestNegotiation(activeBookingId, {
        negotiatedAmount: parseFloat(negotiationAmount),
        notes: negotiationNotes
      });
      
      toast({
        title: "Negotiation requested",
        description: "Your price negotiation request has been submitted successfully.",
      });
      
      // Update the booking in the UI
      setBookings(bookings.map(booking => 
        booking.id === activeBookingId 
          ? { 
              ...booking, 
              status: "negotiation_requested",
              negotiation_status: "requested",
              final_amount: parseFloat(negotiationAmount)
            } 
          : booking
      ));
      
      closeNegotiationDialog();
      fetchBookings(); // Refresh bookings
    } catch (error) {
      toast({
        title: "Error requesting negotiation",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleProcessPayment = async () => {
    try {
      let response;
      
      if (isNegotiatedPayment) {
        response = await bookingService.processNegotiatedPayment(activeBookingId, {
          phoneNumber: phoneNumber
        });
      } else {
        response = await bookingService.processDirectPayment(activeBookingId, {
          phoneNumber: phoneNumber
        });
      }
      
      toast({
        title: "Payment initiated",
        description: "Please check your phone for the M-Pesa payment request.",
      });
      
      closePaymentDialog();
      
      // Set a timeout to refresh bookings after a few seconds
      setTimeout(() => {
        fetchBookings();
      }, 5000);
      
    } catch (error) {
      toast({
        title: "Error processing payment",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'confirmed':
        return <Badge className="bg-green-500">Confirmed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'negotiation_requested':
        return <Badge className="bg-blue-500">Negotiation Requested</Badge>;
      case 'pending_payment':
        return <Badge className="bg-purple-500">Pending Payment</Badge>;
      case 'paid':
        return <Badge className="bg-green-500">Paid</Badge>;
      case 'completed':
        return <Badge className="bg-blue-500">Completed</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getNegotiationStatusBadge = (status) => {
    switch(status) {
      case 'none':
        return null;
      case 'requested':
        return <Badge className="bg-blue-500">Requested</Badge>;
      case 'counter_offer':
        return <Badge className="bg-purple-500">Counter Offer</Badge>;
      case 'accepted':
        return <Badge className="bg-green-500">Accepted</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome, {userName}</h1>
              <p className="text-gray-600">Manage your helicopter bookings and preferences</p>
            </div>
            <Link to="/helicopters">
              <Button className="bg-dejair-600 hover:bg-dejair-700">
                Book a Helicopter
              </Button>
            </Link>
          </div>
          
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="bg-white border">
              <TabsTrigger value="pending">Pending Bookings</TabsTrigger>
              <TabsTrigger value="paid">Paid Bookings</TabsTrigger>
              <TabsTrigger value="all">All Bookings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="pending" className="space-y-6">
              {isLoading ? (
                <div className="text-center py-10">
                  <p>Loading your bookings...</p>
                </div>
              ) : bookings.filter(b => ['pending', 'negotiation_requested', 'pending_payment'].includes(b.status)).length === 0 ? (
                <div className="text-center py-10 bg-white rounded-lg shadow-sm">
                  <p className="text-gray-500 mb-4">You don't have any pending bookings</p>
                  <Link to="/helicopters">
                    <Button className="bg-dejair-600 hover:bg-dejair-700">
                      Book a Helicopter
                    </Button>
                  </Link>
                </div>
              ) : (
                bookings
                  .filter(booking => ['pending', 'negotiation_requested', 'pending_payment'].includes(booking.status))
                  .map(booking => (
                    <BookingCard 
                      key={booking.id}
                      booking={booking}
                      onCancel={() => handleCancelBooking(booking.id)}
                      onNegotiate={() => openNegotiationDialog(booking)}
                      onPayNow={() => openPaymentDialog(booking, false)}
                      onPayNegotiated={() => openPaymentDialog(booking, true)}
                      statusBadge={getStatusBadge(booking.status)}
                      negotiationStatusBadge={getNegotiationStatusBadge(booking.negotiation_status)}
                    />
                  ))
              )}
            </TabsContent>
            
            <TabsContent value="paid" className="space-y-6">
              {isLoading ? (
                <div className="text-center py-10">
                  <p>Loading your bookings...</p>
                </div>
              ) : bookings.filter(b => ['paid', 'confirmed', 'completed'].includes(b.status)).length === 0 ? (
                <div className="text-center py-10 bg-white rounded-lg shadow-sm">
                  <p className="text-gray-500">You don't have any paid bookings</p>
                </div>
              ) : (
                bookings
                  .filter(booking => ['paid', 'confirmed', 'completed'].includes(booking.status))
                  .map(booking => (
                    <BookingCard 
                      key={booking.id}
                      booking={booking}
                      isPaid={true}
                      statusBadge={getStatusBadge(booking.status)}
                      negotiationStatusBadge={getNegotiationStatusBadge(booking.negotiation_status)}
                    />
                  ))
              )}
            </TabsContent>
            
            <TabsContent value="all" className="space-y-6">
              {isLoading ? (
                <div className="text-center py-10">
                  <p>Loading your bookings...</p>
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-lg shadow-sm">
                  <p className="text-gray-500 mb-4">You don't have any bookings</p>
                  <Link to="/helicopters">
                    <Button className="bg-dejair-600 hover:bg-dejair-700">
                      Book a Helicopter
                    </Button>
                  </Link>
                </div>
              ) : (
                bookings.map(booking => (
                  <BookingCard 
                    key={booking.id}
                    booking={booking}
                    onCancel={['pending', 'negotiation_requested'].includes(booking.status) ? () => handleCancelBooking(booking.id) : null}
                    onNegotiate={booking.status === 'pending' ? () => openNegotiationDialog(booking) : null}
                    onPayNow={booking.status === 'pending' ? () => openPaymentDialog(booking, false) : null}
                    onPayNegotiated={
                      booking.status === 'negotiation_requested' && 
                      booking.negotiation_status === 'accepted' ? 
                      () => openPaymentDialog(booking, true) : null
                    }
                    isPaid={['paid', 'confirmed', 'completed'].includes(booking.status)}
                    statusBadge={getStatusBadge(booking.status)}
                    negotiationStatusBadge={getNegotiationStatusBadge(booking.negotiation_status)}
                  />
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Negotiation Dialog */}
      <Dialog open={showNegotiationDialog} onOpenChange={setShowNegotiationDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Request Price Negotiation</DialogTitle>
            <DialogDescription>
              Enter your proposed price and reason for negotiation.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="amount" className="text-right">
                Amount
              </label>
              <Input
                id="amount"
                type="number"
                value={negotiationAmount}
                onChange={(e) => setNegotiationAmount(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="notes" className="text-right">
                Notes
              </label>
              <Input
                id="notes"
                value={negotiationNotes}
                onChange={(e) => setNegotiationNotes(e.target.value)}
                placeholder="Reason for requesting discount"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeNegotiationDialog}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleRequestNegotiation}>
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Process Payment</DialogTitle>
            <DialogDescription>
              Enter your M-Pesa phone number to receive payment prompt.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="phone" className="text-right">
                Phone
              </label>
              <Input
                id="phone"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="254712345678"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closePaymentDialog}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleProcessPayment}>
              Pay Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

const BookingCard = ({ 
  booking, 
  onCancel, 
  onNegotiate,
  onPayNow,
  onPayNegotiated,
  isPaid = false, 
  statusBadge,
  negotiationStatusBadge
}) => {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div>
          <CardTitle className="text-xl font-bold">{booking.helicopter?.model || "Helicopter"}</CardTitle>
          <CardDescription>{booking.purpose || "Helicopter booking"}</CardDescription>
        </div>
        <div className="flex space-x-2">
          {statusBadge}
          {negotiationStatusBadge}
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <CalendarCheck className="h-4 w-4 text-dejair-600" />
            <span className="text-sm">{booking.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-dejair-600" />
            <span className="text-sm">{booking.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-dejair-600" />
            <span className="text-sm">{booking.location || "Location not specified"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Plane className="h-4 w-4 text-dejair-600" />
            <span className="text-sm">Passengers: {booking.num_passengers || 1}</span>
          </div>
        </div>
        <div className="mt-4 flex justify-between items-center">
          {booking.negotiation_status !== 'none' && (
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Original Price:</span>
              <span className="line-through text-gray-500">${booking.original_amount?.toLocaleString() || 0}</span>
            </div>
          )}
          <div className="flex flex-col ml-auto text-right">
            <span className="text-sm text-gray-500">Final Price:</span>
            <span className="font-bold text-dejair-800">${booking.final_amount?.toLocaleString() || booking.original_amount?.toLocaleString() || 0}</span>
          </div>
        </div>
      </CardContent>
      {!isPaid && (
        <CardFooter className="flex justify-end space-x-2 pt-2">
          {onNegotiate && (
            <Button variant="outline" size="sm" onClick={onNegotiate}>
              <PenLine className="mr-1 h-4 w-4" />
              Negotiate
            </Button>
          )}
          {onPayNow && (
            <Button size="sm" className="bg-green-500 hover:bg-green-600" onClick={onPayNow}>
              <DollarSign className="mr-1 h-4 w-4" />
              Pay Now
            </Button>
          )}
          {onPayNegotiated && (
            <Button size="sm" className="bg-green-500 hover:bg-green-600" onClick={onPayNegotiated}>
              <DollarSign className="mr-1 h-4 w-4" />
              Pay Negotiated
            </Button>
          )}
          {onCancel && (
            <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50" onClick={onCancel}>
              <Ban className="mr-1 h-4 w-4" />
              Cancel
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default UserDashboard;
