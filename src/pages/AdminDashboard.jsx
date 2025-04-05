
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, MapPin, User, CheckCircle, AlertCircle, ChevronDown, LogOut, Settings, Users, CreditCard, Helicopter, MessageSquare, Plus, X } from 'lucide-react';

// Sample booking data
const bookingsData = [
  {
    id: "B001",
    customer: {
      name: "John Doe",
      email: "john@example.com",
      phone: "+1 555-123-4567"
    },
    helicopter: "Robinson R44",
    date: "2023-06-15",
    time: "10:00 AM - 12:00 PM",
    location: "Grand Canyon Tour",
    status: "completed",
    totalAmount: 1590,
    passengers: 3,
    notes: "Customer requested window seats for all passengers."
  },
  {
    id: "B002",
    customer: {
      name: "Sarah Williams",
      email: "sarah@example.com",
      phone: "+1 555-987-6543"
    },
    helicopter: "Bell 407",
    date: "2023-08-21",
    time: "2:00 PM - 5:00 PM",
    location: "Manhattan Skyline Tour",
    status: "upcoming",
    totalAmount: 4485,
    passengers: 4,
    notes: "Corporate booking, invoice to be sent to accounting@techgrowth.com"
  },
  {
    id: "B003",
    customer: {
      name: "James Rodriguez",
      email: "james@example.com",
      phone: "+1 555-456-7890"
    },
    helicopter: "Sikorsky S-76",
    date: "2023-09-10",
    time: "9:00 AM - 12:00 PM",
    location: "Niagara Falls Experience",
    status: "pending",
    totalAmount: 9885,
    passengers: 6,
    notes: "Special occasion: Engagement proposal. Champagne service requested."
  },
  {
    id: "B004",
    customer: {
      name: "Michael Johnson",
      email: "michael@example.com",
      phone: "+1 555-222-3333"
    },
    helicopter: "Airbus H125",
    date: "2023-09-15",
    time: "1:00 PM - 3:00 PM",
    location: "Hawaiian Islands Tour",
    status: "cancelled",
    totalAmount: 3390,
    passengers: 5,
    notes: "Cancelled due to weather conditions. Full refund processed."
  }
];

// Sample admin data
const adminsData = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@dejair.com",
    role: "Super Admin",
    lastLogin: "2023-09-04 08:15 AM"
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@dejair.com",
    role: "Booking Manager",
    lastLogin: "2023-09-03 10:30 AM"
  }
];

// Sample messages data (custom pricing requests)
const messagesData = [
  {
    id: "M001",
    customer: {
      name: "Alice Thompson",
      email: "alice@example.com",
      phone: "+1 555-777-8888"
    },
    helicopter: "Sikorsky S-76",
    date: "2023-10-05",
    time: "9:00 AM - 1:00 PM",
    location: "Custom Route: NYC to Hamptons",
    requestedPrice: 7500,
    standardPrice: 13180,
    status: "pending",
    message: "We're planning a corporate retreat and would like to negotiate a package deal for 8 executives. We're flexible on the departure time."
  },
  {
    id: "M002",
    customer: {
      name: "Robert Chen",
      email: "robert@example.com",
      phone: "+1 555-444-3333"
    },
    helicopter: "Bell 407",
    date: "2023-11-12",
    time: "10:00 AM - 2:00 PM",
    location: "Grand Canyon Special Tour",
    requestedPrice: 3000,
    standardPrice: 4485,
    status: "approved",
    message: "Anniversary gift for my parents. Looking for a special rate for seniors. They're very excited about this trip!"
  }
];

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentTab, setCurrentTab] = useState("bookings");
  const [isLoading, setIsLoading] = useState(true);
  const [expandedBooking, setExpandedBooking] = useState(null);
  const [expandedMessage, setExpandedMessage] = useState(null);
  const [newAdminData, setNewAdminData] = useState({
    name: "",
    email: "",
    role: "Booking Manager", // Default role
    password: ""
  });
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in and is an admin
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userRole = localStorage.getItem('userRole');
    
    if (!isLoggedIn || userRole !== 'admin') {
      toast({
        title: "Access denied",
        description: "You need admin privileges to access this dashboard.",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }
    
    // Simulate loading data from backend
    setTimeout(() => {
      setBookings(bookingsData);
      setAdmins(adminsData);
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

  const toggleBookingDetails = (bookingId) => {
    if (expandedBooking === bookingId) {
      setExpandedBooking(null);
    } else {
      setExpandedBooking(bookingId);
    }
  };

  const toggleMessageDetails = (messageId) => {
    if (expandedMessage === messageId) {
      setExpandedMessage(null);
    } else {
      setExpandedMessage(messageId);
    }
  };

  const handleAddAdmin = () => {
    // Validate inputs
    if (!newAdminData.name || !newAdminData.email || !newAdminData.password) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    // Add new admin (in a real app, this would connect to your backend)
    const newAdmin = {
      id: admins.length + 1,
      name: newAdminData.name,
      email: newAdminData.email,
      role: newAdminData.role,
      lastLogin: "Never"
    };
    
    setAdmins([...admins, newAdmin]);
    
    toast({
      title: "Admin added",
      description: `${newAdminData.name} has been added as an admin.`,
    });
    
    // Reset form
    setNewAdminData({
      name: "",
      email: "",
      role: "Booking Manager",
      password: ""
    });
    
    setIsAddingAdmin(false);
  };

  const handleRemoveAdmin = (adminId) => {
    // Don't allow removing the last admin
    if (admins.length <= 1) {
      toast({
        title: "Cannot remove admin",
        description: "You need to have at least one admin account.",
        variant: "destructive"
      });
      return;
    }
    
    // Remove admin
    setAdmins(admins.filter(admin => admin.id !== adminId));
    
    toast({
      title: "Admin removed",
      description: "The admin has been removed successfully.",
    });
  };

  const handleApproveCustomPrice = (messageId) => {
    // In a real app, this would process the custom price approval
    setMessages(messages.map(msg => 
      msg.id === messageId ? { ...msg, status: "approved" } : msg
    ));
    
    toast({
      title: "Custom price approved",
      description: "The customer will be notified of your approval.",
    });
  };

  const handleRejectCustomPrice = (messageId) => {
    // In a real app, this would process the custom price rejection
    setMessages(messages.map(msg => 
      msg.id === messageId ? { ...msg, status: "rejected" } : msg
    ));
    
    toast({
      title: "Custom price rejected",
      description: "The customer will be notified of your decision.",
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
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-500">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-dejair-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-dejair-800">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-dejair-900 text-white min-h-screen hidden md:block">
        <div className="p-4">
          <div className="text-2xl font-bold mb-8 mt-4">Dejair Admin</div>
          
          <nav className="space-y-2">
            <div 
              className={`flex items-center space-x-3 p-3 rounded-md cursor-pointer ${currentTab === "bookings" ? "bg-dejair-800" : "hover:bg-dejair-800"}`}
              onClick={() => setCurrentTab("bookings")}
            >
              <Calendar className="h-5 w-5" />
              <span>Bookings</span>
            </div>
            
            <div 
              className={`flex items-center space-x-3 p-3 rounded-md cursor-pointer ${currentTab === "pricing" ? "bg-dejair-800" : "hover:bg-dejair-800"}`}
              onClick={() => setCurrentTab("pricing")}
            >
              <MessageSquare className="h-5 w-5" />
              <span>Custom Pricing</span>
              {messages.filter(m => m.status === "pending").length > 0 && (
                <Badge className="bg-red-500 ml-auto">
                  {messages.filter(m => m.status === "pending").length}
                </Badge>
              )}
            </div>
            
            <div 
              className={`flex items-center space-x-3 p-3 rounded-md cursor-pointer ${currentTab === "fleet" ? "bg-dejair-800" : "hover:bg-dejair-800"}`}
              onClick={() => setCurrentTab("fleet")}
            >
              <Helicopter className="h-5 w-5" />
              <span>Fleet Management</span>
            </div>
            
            <div 
              className={`flex items-center space-x-3 p-3 rounded-md cursor-pointer ${currentTab === "admins" ? "bg-dejair-800" : "hover:bg-dejair-800"}`}
              onClick={() => setCurrentTab("admins")}
            >
              <Users className="h-5 w-5" />
              <span>Admin Users</span>
            </div>
            
            <div 
              className={`flex items-center space-x-3 p-3 rounded-md cursor-pointer ${currentTab === "settings" ? "bg-dejair-800" : "hover:bg-dejair-800"}`}
              onClick={() => setCurrentTab("settings")}
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </div>
          </nav>
        </div>
        
        <div className="mt-auto p-4">
          <Button 
            variant="ghost" 
            className="w-full flex items-center justify-center text-white hover:bg-dejair-800"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            <span>Log Out</span>
          </Button>
        </div>
      </div>
      
      {/* Mobile navbar */}
      <div className="fixed top-0 left-0 right-0 bg-dejair-900 text-white p-4 md:hidden z-10">
        <div className="flex justify-between items-center">
          <div className="text-xl font-bold">Dejair Admin</div>
          <Button variant="ghost" className="text-white" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex overflow-x-auto space-x-2 mt-4 pb-2">
          <Button 
            variant={currentTab === "bookings" ? "default" : "ghost"}
            className={currentTab === "bookings" ? "bg-dejair-700" : "text-white"}
            onClick={() => setCurrentTab("bookings")}
          >
            Bookings
          </Button>
          <Button 
            variant={currentTab === "pricing" ? "default" : "ghost"}
            className={currentTab === "pricing" ? "bg-dejair-700" : "text-white"}
            onClick={() => setCurrentTab("pricing")}
          >
            Custom Pricing
          </Button>
          <Button 
            variant={currentTab === "fleet" ? "default" : "ghost"}
            className={currentTab === "fleet" ? "bg-dejair-700" : "text-white"}
            onClick={() => setCurrentTab("fleet")}
          >
            Fleet
          </Button>
          <Button 
            variant={currentTab === "admins" ? "default" : "ghost"}
            className={currentTab === "admins" ? "bg-dejair-700" : "text-white"}
            onClick={() => setCurrentTab("admins")}
          >
            Admins
          </Button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 md:p-8 p-4 mt-24 md:mt-0">
        {/* Bookings Tab */}
        {currentTab === "bookings" && (
          <div>
            <h1 className="text-2xl font-bold mb-6">Booking Management</h1>
            
            <div className="mb-6 flex justify-between items-center">
              <div>
                <span className="text-gray-500">Total bookings: {bookings.length}</span>
              </div>
              <div className="flex gap-2">
                <Button className="bg-dejair-600 hover:bg-dejair-700">
                  Add New Booking
                </Button>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="grid grid-cols-6 p-4 font-semibold border-b">
                <div className="col-span-2">Customer & Booking</div>
                <div className="hidden md:block">Date & Time</div>
                <div className="hidden md:block">Location</div>
                <div>Status</div>
                <div>Actions</div>
              </div>
              
              {bookings.map((booking) => (
                <div key={booking.id} className="border-b last:border-b-0">
                  <div className="grid grid-cols-6 p-4 items-center">
                    <div className="col-span-2">
                      <div className="font-medium">{booking.customer.name}</div>
                      <div className="text-sm text-gray-500">ID: {booking.id} | {booking.helicopter}</div>
                    </div>
                    <div className="hidden md:block">
                      <div>{booking.date}</div>
                      <div className="text-sm text-gray-500">{booking.time}</div>
                    </div>
                    <div className="hidden md:block">
                      {booking.location}
                    </div>
                    <div>
                      {getStatusBadge(booking.status)}
                    </div>
                    <div className="flex gap-2 items-center">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => toggleBookingDetails(booking.id)}
                      >
                        {expandedBooking === booking.id ? (
                          <X className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {/* Expanded booking details */}
                  {expandedBooking === booking.id && (
                    <div className="bg-gray-50 p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-semibold mb-2">Customer Details</h3>
                        <div className="space-y-1">
                          <div><span className="text-gray-500">Name:</span> {booking.customer.name}</div>
                          <div><span className="text-gray-500">Email:</span> {booking.customer.email}</div>
                          <div><span className="text-gray-500">Phone:</span> {booking.customer.phone}</div>
                        </div>
                        
                        <h3 className="font-semibold mt-4 mb-2">Booking Notes</h3>
                        <div className="text-sm">{booking.notes}</div>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold mb-2">Booking Details</h3>
                        <div className="space-y-1">
                          <div><span className="text-gray-500">Helicopter:</span> {booking.helicopter}</div>
                          <div><span className="text-gray-500">Passengers:</span> {booking.passengers}</div>
                          <div><span className="text-gray-500">Total Amount:</span> ${booking.totalAmount}</div>
                        </div>
                        
                        <div className="mt-4 space-x-2">
                          <Button size="sm" className="bg-dejair-600 hover:bg-dejair-700">
                            Edit Booking
                          </Button>
                          {booking.status !== "cancelled" && booking.status !== "completed" && (
                            <Button size="sm" variant="outline" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                              Cancel Booking
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Custom Pricing Tab */}
        {currentTab === "pricing" && (
          <div>
            <h1 className="text-2xl font-bold mb-6">Custom Pricing Requests</h1>
            
            <div className="mb-6">
              <span className="text-gray-500">
                Pending requests: {messages.filter(m => m.status === "pending").length}
              </span>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {messages.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No custom pricing requests at this time.
                </div>
              ) : (
                messages.map((message) => (
                  <div key={message.id} className="border-b last:border-b-0">
                    <div className="grid grid-cols-6 p-4 items-center">
                      <div className="col-span-2">
                        <div className="font-medium">{message.customer.name}</div>
                        <div className="text-sm text-gray-500">{message.helicopter}</div>
                      </div>
                      <div className="hidden md:block">
                        <div>${message.requestedPrice}</div>
                        <div className="text-sm text-gray-500">Std: ${message.standardPrice}</div>
                      </div>
                      <div className="hidden md:block">
                        {message.date}
                      </div>
                      <div>
                        {getStatusBadge(message.status)}
                      </div>
                      <div className="flex gap-2 items-center">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => toggleMessageDetails(message.id)}
                        >
                          {expandedMessage === message.id ? (
                            <X className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    {/* Expanded message details */}
                    {expandedMessage === message.id && (
                      <div className="bg-gray-50 p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h3 className="font-semibold mb-2">Customer Details</h3>
                            <div className="space-y-1">
                              <div><span className="text-gray-500">Name:</span> {message.customer.name}</div>
                              <div><span className="text-gray-500">Email:</span> {message.customer.email}</div>
                              <div><span className="text-gray-500">Phone:</span> {message.customer.phone}</div>
                            </div>
                            
                            <h3 className="font-semibold mt-4 mb-2">Requested Information</h3>
                            <div className="space-y-1">
                              <div><span className="text-gray-500">Helicopter:</span> {message.helicopter}</div>
                              <div><span className="text-gray-500">Date:</span> {message.date}</div>
                              <div><span className="text-gray-500">Time:</span> {message.time}</div>
                              <div><span className="text-gray-500">Location:</span> {message.location}</div>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="font-semibold mb-2">Pricing Information</h3>
                            <div className="space-y-1">
                              <div><span className="text-gray-500">Standard Price:</span> ${message.standardPrice}</div>
                              <div><span className="text-gray-500">Requested Price:</span> ${message.requestedPrice}</div>
                              <div><span className="text-gray-500">Discount:</span> {((1 - message.requestedPrice / message.standardPrice) * 100).toFixed(1)}%</div>
                            </div>
                            
                            <h3 className="font-semibold mt-4 mb-2">Customer Message</h3>
                            <div className="text-sm italic">"{message.message}"</div>
                            
                            {message.status === "pending" && (
                              <div className="mt-4 space-x-2">
                                <Button 
                                  size="sm" 
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() => handleApproveCustomPrice(message.id)}
                                >
                                  Approve Price
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => handleRejectCustomPrice(message.id)}
                                >
                                  Reject
                                </Button>
                                <Button size="sm" variant="outline">
                                  Counter Offer
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
        
        {/* Fleet Management Tab */}
        {currentTab === "fleet" && (
          <div>
            <h1 className="text-2xl font-bold mb-6">Fleet Management</h1>
            
            <div className="text-center p-12 bg-white rounded-lg">
              <p className="text-gray-500 mb-4">Fleet management features will be available in the next update.</p>
              <p className="text-sm text-gray-400">Here you'll be able to add, remove, and update helicopter information.</p>
            </div>
          </div>
        )}
        
        {/* Admin Users Tab */}
        {currentTab === "admins" && (
          <div>
            <h1 className="text-2xl font-bold mb-6">Admin Users</h1>
            
            <div className="mb-6 flex justify-between items-center">
              <div>
                <span className="text-gray-500">Total admins: {admins.length}</span>
              </div>
              <div>
                <Dialog open={isAddingAdmin} onOpenChange={setIsAddingAdmin}>
                  <DialogTrigger asChild>
                    <Button className="bg-dejair-600 hover:bg-dejair-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Admin
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Admin</DialogTitle>
                      <DialogDescription>
                        Create a new administrator account. They will receive an email with login instructions.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                          id="name" 
                          value={newAdminData.name}
                          onChange={(e) => setNewAdminData({...newAdminData, name: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email"
                          value={newAdminData.email}
                          onChange={(e) => setNewAdminData({...newAdminData, email: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <select 
                          id="role"
                          className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={newAdminData.role}
                          onChange={(e) => setNewAdminData({...newAdminData, role: e.target.value})}
                        >
                          <option value="Super Admin">Super Admin</option>
                          <option value="Booking Manager">Booking Manager</option>
                          <option value="Fleet Manager">Fleet Manager</option>
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="password">Temporary Password</Label>
                        <Input 
                          id="password" 
                          type="password"
                          value={newAdminData.password}
                          onChange={(e) => setNewAdminData({...newAdminData, password: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddingAdmin(false)}>
                        Cancel
                      </Button>
                      <Button className="bg-dejair-600 hover:bg-dejair-700" onClick={handleAddAdmin}>
                        Add Admin
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="grid grid-cols-5 p-4 font-semibold border-b">
                <div className="col-span-2">Name & Email</div>
                <div>Role</div>
                <div>Last Login</div>
                <div>Actions</div>
              </div>
              
              {admins.map((admin) => (
                <div key={admin.id} className="grid grid-cols-5 p-4 items-center border-b last:border-b-0">
                  <div className="col-span-2">
                    <div className="font-medium">{admin.name}</div>
                    <div className="text-sm text-gray-500">{admin.email}</div>
                  </div>
                  <div>
                    <Badge variant="outline" className="bg-dejair-50 text-dejair-800">
                      {admin.role}
                    </Badge>
                  </div>
                  <div>
                    {admin.lastLogin}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleRemoveAdmin(admin.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Settings Tab */}
        {currentTab === "settings" && (
          <div>
            <h1 className="text-2xl font-bold mb-6">Settings</h1>
            
            <div className="text-center p-12 bg-white rounded-lg">
              <p className="text-gray-500 mb-4">Settings will be available in the next update.</p>
              <p className="text-sm text-gray-400">Here you'll be able to configure system preferences, notifications, and more.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
