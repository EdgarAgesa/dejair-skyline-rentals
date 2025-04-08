import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CalendarCheck, Clock, MapPin, Plane, PenLine, Ban, DollarSign, MessageSquare } from 'lucide-react';
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
import PaymentDialog from '@/components/PaymentDialog';
import firebaseService from '../services/firebaseService';

const UserDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState('User');
  const [activeBookingId, setActiveBookingId] = useState(null);
  const [negotiationAmount, setNegotiationAmount] = useState('');
  const [negotiationNotes, setNegotiationNotes] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showNegotiationDialog, setShowNegotiationDialog] = useState(false);
  const [isNegotiatedPayment, setIsNegotiatedPayment] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentSuccessMessage, setPaymentSuccessMessage] = useState('');
  const [paymentPending, setPaymentPending] = useState(false);
  const [paymentPendingMessage, setPaymentPendingMessage] = useState('');
  const [paymentPollingInterval, setPaymentPollingInterval] = useState(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isNegotiating, setIsNegotiating] = useState(false);

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
    setSelectedBooking(booking);
    setIsPaymentDialogOpen(true);
  };

  const closePaymentDialog = () => {
    setIsPaymentDialogOpen(false);
    setActiveBookingId(null);
    setPhoneNumber('');
    setIsNegotiatedPayment(false);
    setSelectedBooking(null);
  };

  const handleNegotiationRequest = async (bookingId) => {
    try {
      setIsNegotiating(true);
      
      // Send the negotiation request
      const response = await bookingService.requestNegotiation(bookingId, {
        negotiated_amount: parseFloat(negotiationAmount),
        notes: negotiationNotes
      });
      
      // Send Firebase notification
      await firebaseService.sendNotification({
        booking_id: bookingId,
        title: "New Negotiation Request",
        body: `Booking #${bookingId} has a new negotiation request`,
        data: {
          type: "negotiation_request",
          booking_id: bookingId,
          negotiated_amount: negotiationAmount,
          notes: negotiationNotes
        }
      });
      
      toast({
        title: "Negotiation request submitted",
        description: "An admin will review your request and contact you shortly.",
      });
      
      setShowNegotiationDialog(false);
      setNegotiationAmount('');
      setNegotiationNotes('');
      fetchBookings(); // Refresh bookings list
    } catch (error) {
      console.error('Negotiation error:', error);
      toast({
        title: "Negotiation failed",
        description: error.message || "Failed to submit negotiation request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsNegotiating(false);
    }
  };

  const handleProcessPayment = async (bookingId, phoneNumber) => {
    setPaymentLoading(true);
    setPaymentError(null);
    setPaymentSuccess(false);
    setPaymentPending(false);

    try {
      console.log(`Processing payment for booking ${bookingId} with phone number ${phoneNumber}`);
      
      let result;
      
      if (isNegotiatedPayment) {
        console.log('Processing negotiated payment');
        result = await bookingService.processNegotiatedPayment(bookingId, { phoneNumber });
      } else {
        console.log('Processing direct payment');
        result = await bookingService.processDirectPayment(bookingId, { phoneNumber });
      }
      
      console.log('Payment processing result:', result);
      
      if (result.message && result.message.includes('successful')) {
        console.log('Payment initiated successfully');
        setPaymentSuccess(true);
        setPaymentSuccessMessage('Payment initiated successfully! Please check your phone for the M-Pesa prompt.');
        startPaymentStatusPolling(bookingId);
      } else if (result.status === 'pending') {
        console.log('Payment is pending');
        setPaymentPending(true);
        setPaymentPendingMessage('Payment is pending. Please check your phone for the M-Pesa prompt.');
        startPaymentStatusPolling(bookingId);
      } else {
        console.log('Payment failed:', result.message);
        setPaymentError(result.message || 'Failed to process payment. Please try again.');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      setPaymentError(error.message || 'An error occurred while processing the payment.');
    } finally {
      setPaymentLoading(false);
    }
  };

  const startPaymentStatusPolling = (bookingId) => {
    // Clear any existing polling interval
    if (paymentPollingInterval) {
      clearInterval(paymentPollingInterval);
    }

    let attempts = 0;
    const maxAttempts = 24; // 2 minutes (5 seconds * 24)

    console.log(`Starting payment status polling for booking ${bookingId}`);

    const interval = setInterval(async () => {
      attempts++;
      console.log(`Payment status polling attempt ${attempts}/${maxAttempts}`);
      
      try {
        // First try to get the booking directly to check its status
        const booking = await bookingService.getBooking(bookingId);
        console.log(`Booking status: ${booking.status}, Payment status: ${booking.payment_status}`);
        
        if (booking.status === 'paid' || booking.payment_status === 'paid') {
          console.log('Payment confirmed successfully!');
          clearInterval(interval);
          setPaymentSuccess(true);
          setPaymentSuccessMessage('Payment completed successfully!');
          setPaymentPending(false);
          fetchBookings(); // Refresh the bookings list
          setTimeout(() => {
            setIsPaymentDialogOpen(false);
            // Redirect to payment confirmation page
            navigate(`/payment-confirmation/${bookingId}`);
          }, 2000);
        } else if (booking.status === 'cancelled' || booking.payment_status === 'failed') {
          console.log('Payment failed or was cancelled');
          clearInterval(interval);
          setPaymentError('Payment was not completed. Please try again.');
          setPaymentPending(false);
        } else if (attempts >= maxAttempts) {
          console.log('Payment status polling timed out');
          clearInterval(interval);
          setPaymentError('Payment status check timed out. Please check your booking status.');
          setPaymentPending(false);
        } else {
          // If we can't determine the status from the booking, try the dedicated status endpoint
          try {
            const result = await bookingService.getBookingStatus(bookingId);
            console.log(`Booking status from dedicated endpoint: ${result.status}`);
            
            if (result.status === 'paid' || (result.message && result.message.includes('paid'))) {
              console.log('Payment confirmed successfully from dedicated endpoint!');
              clearInterval(interval);
              setPaymentSuccess(true);
              setPaymentSuccessMessage('Payment completed successfully!');
              setPaymentPending(false);
              fetchBookings(); // Refresh the bookings list
              setTimeout(() => {
                setIsPaymentDialogOpen(false);
                // Redirect to payment confirmation page
                navigate(`/payment-confirmation/${bookingId}`);
              }, 2000);
            }
          } catch (statusError) {
            console.error('Error checking booking status from dedicated endpoint:', statusError);
            // Continue polling even if this fails
          }
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
        // Don't stop polling on error, just log it
      }
    }, 5000);

    setPaymentPollingInterval(interval);
  };

  // Cleanup polling interval on component unmount
  useEffect(() => {
    return () => {
      if (paymentPollingInterval) {
        clearInterval(paymentPollingInterval);
      }
    };
  }, [paymentPollingInterval]);

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

  const handlePaymentSuccess = (bookingId) => {
    // Close the payment dialog
    setIsPaymentDialogOpen(false);
    
    // Redirect to payment confirmation page
    navigate(`/payment-confirmation/${bookingId}`);
    
    // Refresh the bookings list
    fetchBookings();
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
            <Button type="submit" onClick={() => handleNegotiationRequest(activeBookingId)} disabled={isNegotiating || !negotiationAmount}>
              {isNegotiating ? 'Submitting...' : 'Submit Request'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Payment Dialog */}
      <PaymentDialog
        isOpen={isPaymentDialogOpen}
        onClose={() => {
          setIsPaymentDialogOpen(false);
          setSelectedBooking(null);
          setPaymentError(null);
          setPaymentSuccess(false);
          setPaymentPending(false);
          if (paymentPollingInterval) {
            clearInterval(paymentPollingInterval);
            setPaymentPollingInterval(null);
          }
        }}
        onProcessPayment={handleProcessPayment}
        booking={selectedBooking}
        isLoading={paymentLoading}
        error={paymentError}
        isSuccess={paymentSuccess}
        successMessage={paymentSuccessMessage}
        isPending={paymentPending}
        pendingMessage={paymentPendingMessage}
      />
      
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
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">Booking #{booking.id}</CardTitle>
            <p className="text-sm text-gray-500">
              {new Date(booking.date).toLocaleDateString()} at {booking.time}
            </p>
          </div>
          <div className="flex gap-2">
            {statusBadge}
            {negotiationStatusBadge}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-500">Amount:</span>
            <span className="font-medium">${booking.final_amount || booking.original_amount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Passengers:</span>
            <span>{booking.num_passengers}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Purpose:</span>
            <span>{booking.purpose}</span>
          </div>
          {booking.notes && (
            <div className="flex justify-between">
              <span className="text-gray-500">Notes:</span>
              <span>{booking.notes}</span>
            </div>
          )}
        </div>
      </CardContent>
      {!isPaid && (
        <CardFooter className="flex justify-end space-x-2 pt-2">
          {onNegotiate && booking.negotiation_status === 'none' && (
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
          {(booking.negotiation_status === 'requested' || booking.negotiation_status === 'accepted') && (
            <Link to={`/booking/${booking.id}/chat`}>
              <Button 
                variant="outline" 
                size="sm"
                className="text-blue-500 border-blue-200 hover:bg-blue-50"
              >
                <MessageSquare className="mr-1 h-4 w-4" />
                Chat with Admin
              </Button>
            </Link>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default UserDashboard;
