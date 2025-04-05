
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, CheckCircle, AlertCircle, Clock4, LogOut, User, CreditCard, Settings, MessageSquare } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

// Sample booking data
const bookingsData = [
  {
    id: "B001",
    helicopter: "Robinson R44",
    date: "2023-06-15",
    time: "10:00 AM - 12:00 PM",
    location: "Grand Canyon Tour",
    status: "completed",
    totalAmount: 1590,
    passengers: 3
  },
  {
    id: "B002",
    helicopter: "Bell 407",
    date: "2023-08-21",
    time: "2:00 PM - 5:00 PM",
    location: "Manhattan Skyline Tour",
    status: "upcoming",
    totalAmount: 4485,
    passengers: 4
  },
  {
    id: "B003",
    helicopter: "Sikorsky S-76",
    date: "2023-09-10",
    time: "9:00 AM - 12:00 PM",
    location: "Niagara Falls Experience",
    status: "pending",
    totalAmount: 9885,
    passengers: 6
  }
];

// Sample payment data
const paymentsData = [
  {
    id: "P001",
    bookingId: "B001",
    date: "2023-06-14",
    amount: 1590,
    method: "Credit Card (**** 4582)",
    status: "completed"
  },
  {
    id: "P002",
    bookingId: "B002",
    date: "2023-08-18",
    amount: 4485,
    method: "PayPal",
    status: "completed"
  },
  {
    id: "P003",
    bookingId: "B003",
    date: "2023-09-05",
    amount: 4942.50, // 50% deposit
    method: "Credit Card (**** 7891)",
    status: "completed"
  }
];

// Sample message data
const messagesData = [
  {
    id: "M001",
    date: "2023-08-30",
    title: "Custom Pricing Approved",
    content: "Your request for custom pricing on the Sikorsky S-76 booking has been approved. The new price is $9,885 for the 3-hour tour. Please confirm this booking within 48 hours.",
    read: true
  },
  {
    id: "M002",
    date: "2023-09-02",
    title: "Booking Confirmation",
    content: "Your booking (B003) for the Niagara Falls Experience has been confirmed. Please remember to arrive 30 minutes before your scheduled departure time for safety briefing.",
    read: false
  }
];

const UserDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentTab, setCurrentTab] = useState("bookings");
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userRole = localStorage.getItem('userRole');
    const userEmail = localStorage.getItem('userEmail');
    
    if (!isLoggedIn || userRole !== 'user') {
      toast({
        title: "Access denied",
        description: "Please log in to access your dashboard.",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }
    
    // Set user data
    setUser({
      email: userEmail,
      name: "John Doe", // This would normally come from your backend
      joinDate: "January 2023"
    });
    
    // Simulate loading data from backend
    setTimeout(() => {
      setBookings(bookingsData);
      setPayments(paymentsData);
      setMessages(messagesData);
      setIsLoading(false);
    }, 1000);
  }, [navigate, toast]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    
    navigate('/login');
  };

  const markMessageAsRead = (messageId) => {
    setMessages(messages.map(msg => 
      msg.id === messageId ? { ...msg, read: true } : msg
    ));
    
    toast({
      title: "Message marked as read",
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "upcoming":
        return <Badge className="bg-blue-500">Upcoming</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-dejair-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-dejair-800">Loading your dashboard...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow py-12 container-padding bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-1/4">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="bg-dejair-100 text-dejair-800 p-3 rounded-full">
                      <User className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle>{user?.name}</CardTitle>
                      <CardDescription>{user?.email}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 cursor-pointer"
                       onClick={() => setCurrentTab("bookings")}>
                    <Calendar className="h-5 w-5 text-dejair-600" />
                    <span className={currentTab === "bookings" ? "font-semibold text-dejair-800" : ""}>My Bookings</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 cursor-pointer"
                       onClick={() => setCurrentTab("payments")}>
                    <CreditCard className="h-5 w-5 text-dejair-600" />
                    <span className={currentTab === "payments" ? "font-semibold text-dejair-800" : ""}>Payment History</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 cursor-pointer"
                       onClick={() => setCurrentTab("messages")}>
                    <MessageSquare className="h-5 w-5 text-dejair-600" />
                    <span className={currentTab === "messages" ? "font-semibold text-dejair-800" : ""}>
                      Messages
                      {messages.some(msg => !msg.read) && (
                        <Badge className="ml-2 bg-red-500">
                          {messages.filter(msg => !msg.read).length}
                        </Badge>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 cursor-pointer"
                       onClick={() => setCurrentTab("settings")}>
                    <Settings className="h-5 w-5 text-dejair-600" />
                    <span className={currentTab === "settings" ? "font-semibold text-dejair-800" : ""}>Account Settings</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center gap-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Log Out</span>
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            {/* Main Content */}
            <div className="lg:w-3/4">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {currentTab === "bookings" && "My Bookings"}
                    {currentTab === "payments" && "Payment History"}
                    {currentTab === "messages" && "Messages"}
                    {currentTab === "settings" && "Account Settings"}
                  </CardTitle>
                  <CardDescription>
                    {currentTab === "bookings" && "View and manage your helicopter bookings"}
                    {currentTab === "payments" && "Review your payment history"}
                    {currentTab === "messages" && "Communication with Dejair Skyline"}
                    {currentTab === "settings" && "Manage your account preferences"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Bookings Tab */}
                  {currentTab === "bookings" && (
                    <div className="space-y-6">
                      {bookings.length === 0 ? (
                        <div className="text-center py-12">
                          <p className="text-gray-500 mb-4">You don't have any bookings yet.</p>
                          <Button 
                            className="bg-dejair-600 hover:bg-dejair-700"
                            onClick={() => navigate('/helicopters')}
                          >
                            Book a Helicopter
                          </Button>
                        </div>
                      ) : (
                        bookings.map((booking) => (
                          <Card key={booking.id} className="shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="pb-2">
                              <div className="flex justify-between items-start">
                                <div>
                                  <CardTitle className="text-lg">{booking.helicopter}</CardTitle>
                                  <CardDescription>{booking.location}</CardDescription>
                                </div>
                                {getStatusBadge(booking.status)}
                              </div>
                            </CardHeader>
                            <CardContent className="pb-4">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-dejair-600" />
                                  <span>{booking.date}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-dejair-600" />
                                  <span>{booking.time}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4 text-dejair-600" />
                                  <span>{booking.location}</span>
                                </div>
                              </div>
                              <div className="mt-4">
                                <div className="text-sm text-gray-500">Booking ID: {booking.id}</div>
                                <div className="text-sm">Passengers: {booking.passengers}</div>
                                <div className="font-semibold mt-2">Total Amount: ${booking.totalAmount}</div>
                              </div>
                            </CardContent>
                            <CardFooter className="pt-0">
                              {booking.status === "upcoming" && (
                                <Button variant="outline" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                  Cancel Booking
                                </Button>
                              )}
                              {booking.status === "completed" && (
                                <Button variant="outline">
                                  Book Again
                                </Button>
                              )}
                            </CardFooter>
                          </Card>
                        ))
                      )}
                    </div>
                  )}
                  
                  {/* Payments Tab */}
                  {currentTab === "payments" && (
                    <div className="space-y-6">
                      {payments.length === 0 ? (
                        <div className="text-center py-12">
                          <p className="text-gray-500">No payment history available.</p>
                        </div>
                      ) : (
                        payments.map((payment) => (
                          <Card key={payment.id} className="shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="pb-2">
                              <div className="flex justify-between items-start">
                                <div>
                                  <CardTitle className="text-lg">Payment #{payment.id}</CardTitle>
                                  <CardDescription>For Booking #{payment.bookingId}</CardDescription>
                                </div>
                                {payment.status === "completed" ? (
                                  <Badge className="bg-green-500">Completed</Badge>
                                ) : (
                                  <Badge variant="outline" className="text-yellow-500 border-yellow-500">Pending</Badge>
                                )}
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <div className="text-sm text-gray-500">Date</div>
                                  <div>{payment.date}</div>
                                </div>
                                <div>
                                  <div className="text-sm text-gray-500">Amount</div>
                                  <div className="font-semibold">${payment.amount}</div>
                                </div>
                                <div>
                                  <div className="text-sm text-gray-500">Payment Method</div>
                                  <div>{payment.method}</div>
                                </div>
                              </div>
                            </CardContent>
                            <CardFooter className="pt-0">
                              <Button variant="outline">Download Receipt</Button>
                            </CardFooter>
                          </Card>
                        ))
                      )}
                    </div>
                  )}
                  
                  {/* Messages Tab */}
                  {currentTab === "messages" && (
                    <div className="space-y-6">
                      {messages.length === 0 ? (
                        <div className="text-center py-12">
                          <p className="text-gray-500">You have no messages.</p>
                        </div>
                      ) : (
                        messages.map((message) => (
                          <Card key={message.id} className={`shadow-sm hover:shadow-md transition-shadow ${!message.read ? 'border-l-4 border-dejair-600' : ''}`}>
                            <CardHeader className="pb-2">
                              <div className="flex justify-between items-start">
                                <div>
                                  <CardTitle className="text-lg flex items-center">
                                    {message.title}
                                    {!message.read && (
                                      <Badge className="ml-2 bg-dejair-600">New</Badge>
                                    )}
                                  </CardTitle>
                                  <CardDescription>{message.date}</CardDescription>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <p>{message.content}</p>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                              <Button variant="outline">Reply</Button>
                              {!message.read && (
                                <Button 
                                  variant="ghost" 
                                  onClick={() => markMessageAsRead(message.id)}
                                >
                                  Mark as Read
                                </Button>
                              )}
                            </CardFooter>
                          </Card>
                        ))
                      )}
                    </div>
                  )}
                  
                  {/* Settings Tab */}
                  {currentTab === "settings" && (
                    <div className="space-y-6">
                      <div className="text-center py-12">
                        <p className="text-gray-500 mb-4">Account settings are currently unavailable.</p>
                        <p className="text-sm text-gray-400">This feature will be available in the next update.</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default UserDashboard;
