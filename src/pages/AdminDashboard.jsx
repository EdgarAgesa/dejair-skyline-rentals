import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Users, ChevronDown, Bell, Search, Plane, 
  Calendar, DollarSign, UserPlus, Edit, Trash2,
  Check, X, MessageSquare, Handshake, Plus
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import authService from '../services/authService';
import bookingService from '../services/bookingService';
import chatService from '../services/chatService';
import helicopterService from '../services/helicopterService';
import firebaseService from '../services/firebaseService';
import { ToastAction } from "@/components/ui/toast";
import { FileUploaderRegular } from '@uploadcare/react-uploader';
import '@uploadcare/react-uploader/core.css';

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [admins, setAdmins] = useState([]);
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', role: 'Admin' });
  const [isEditingPrice, setIsEditingPrice] = useState(null);
  const [newPrice, setNewPrice] = useState('');
  const [unreadMessages, setUnreadMessages] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Track today's stats
  const [todayStats, setTodayStats] = useState({
    bookings: 0,
    revenue: 0,
    pendingBookings: 0
  });

  const [negotiationDialogOpen, setNegotiationDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [negotiationAmount, setNegotiationAmount] = useState('');
  const [negotiationNotes, setNegotiationNotes] = useState('');
  const [negotiationHistory, setNegotiationHistory] = useState([]);
  const [negotiationAction, setNegotiationAction] = useState('accept'); // 'accept' or 'reject'
  const [finalAmount, setFinalAmount] = useState('');

  const [helicopters, setHelicopters] = useState([]);
  const [isLoadingHelicopters, setIsLoadingHelicopters] = useState(false);
  const [newHelicopter, setNewHelicopter] = useState({
    model: '',
    capacity: '',
    image_url: ''
  });
  const [isAddHelicopterDialogOpen, setIsAddHelicopterDialogOpen] = useState(false);

  const [pendingNegotiations, setPendingNegotiations] = useState([]);

  // Fetch all bookings data
  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      
      // Fetch all bookings
      const allBookings = await bookingService.getClientBookings();
      
      setBookings(allBookings);
      setFilteredBookings(allBookings);
      
      // Calculate today's stats
      const today = new Date().toISOString().split('T')[0];
      const todayBookings = allBookings.filter(booking => booking.date === today);
      
      setTodayStats({
        bookings: todayBookings.length,
        revenue: allBookings
          .filter(booking => booking.status === 'completed' || booking.status === 'paid')
          .reduce((sum, booking) => sum + booking.final_amount, 0),
        pendingBookings: allBookings
          .filter(booking => booking.status === 'pending' || booking.status === 'negotiation_requested')
          .length
      });
      
    } catch (error) {
      toast({
        title: "Error fetching bookings",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch unread message count
  const fetchUnreadMessages = async () => {
    try {
      // Check if user is logged in first
      if (!authService.isLoggedIn()) {
        console.warn("User not logged in, skipping unread message fetch");
        return;
      }
      
      const count = await chatService.getUnreadMessageCount();
      setUnreadMessages(count);
    } catch (error) {
      console.error("Error fetching unread messages:", error);
      // Don't show toast for every error to avoid spamming the user
      // Only show toast for the first error
      if (unreadMessages === 0) {
        toast({
          title: "Connection Error",
          description: "Could not connect to the chat server. Please check your connection.",
          variant: "destructive",
        });
      }
    }
  };

  useEffect(() => {
    // Check if admin is logged in
    if (!authService.isAdmin()) {
      // Redirect to login if not logged in as admin
      toast({
        title: "Authentication required",
        description: "Please log in as an admin to access this page",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
    // Fetch data
    fetchBookings();
    fetchUnreadMessages();
    
    // Set up polling for unread messages
    const messageInterval = setInterval(fetchUnreadMessages, 30000); // Check every 30 seconds
    
    return () => {
      clearInterval(messageInterval);
    };
  }, [navigate, toast]);

  useEffect(() => {
    // Filter bookings based on search query and status filter
    const filtered = bookings.filter(booking => {
      const matchesSearch = 
        (booking.client?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (booking.client?.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (booking.helicopter?.model || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (booking.location || '').toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
    
    setFilteredBookings(filtered);
  }, [searchQuery, statusFilter, bookings]);

  const handleAddAdmin = () => {
    // Validate inputs
    if (!newAdmin.name || !newAdmin.email) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    
    // Here we would add API call to create admin
    toast({
      title: "Feature coming soon",
      description: "Admin management will be implemented in the next update",
    });
    
    setNewAdmin({ name: '', email: '', role: 'Admin' });
  };

  const handleRemoveAdmin = (id) => {
    // Here we would add API call to remove admin
    toast({
      title: "Feature coming soon",
      description: "Admin management will be implemented in the next update",
    });
  };

  const handleToggleAdminStatus = (id) => {
    // Here we would add API call to toggle admin status
    toast({
      title: "Feature coming soon",
      description: "Admin management will be implemented in the next update",
    });
  };

  const handleUpdateBookingStatus = async (id, newStatus) => {
    try {
      // Call API to update booking status
      await bookingService.updateBooking(id, { status: newStatus });
      
      // Update local state
      setBookings(bookings.map(booking => 
        booking.id === id ? {...booking, status: newStatus} : booking
      ));
      
      toast({
        title: "Booking updated",
        description: `Booking status changed to ${newStatus}`
      });
      
    } catch (error) {
      toast({
        title: "Error updating booking",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleNegotiationRequest = async (booking) => {
    setSelectedBooking(booking);
    setNegotiationDialogOpen(true);
    setFinalAmount(booking.negotiated_amount || booking.original_amount);
    try {
      const history = await bookingService.getNegotiationHistory(booking.id);
      setNegotiationHistory(history);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch negotiation history",
        variant: "destructive"
      });
    }
  };

  const handleNegotiationSubmit = async () => {
    try {
      if (!finalAmount && negotiationAction === 'accept') {
        toast({
          title: "Error",
          description: "Please enter a final amount",
          variant: "destructive"
        });
        return;
      }

      await bookingService.handleNegotiation(selectedBooking.id, {
        action: negotiationAction,
        finalAmount: parseFloat(finalAmount),
        notes: negotiationNotes
      });

      toast({
        title: "Success",
        description: `Negotiation ${negotiationAction}ed successfully`
      });

      setNegotiationDialogOpen(false);
      fetchBookings(); // Refresh bookings list
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to process negotiation",
        variant: "destructive"
      });
    }
  };

  const handleStartPriceEdit = (id, currentPrice) => {
    setIsEditingPrice(id);
    setNewPrice(currentPrice.toString());
  };

  const handleSavePrice = async (id) => {
    if (!newPrice || isNaN(Number(newPrice)) || Number(newPrice) <= 0) {
      toast({
        title: "Invalid price",
        description: "Please enter a valid price",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Call API to update booking price
      const response = await bookingService.handleNegotiation(id, {
        action: 'accept',
        finalAmount: Number(newPrice),
        notes: 'Price updated by admin'
      });
      
      // Update local state
      setBookings(bookings.map(booking => 
        booking.id === id ? {...booking, final_amount: Number(newPrice)} : booking
      ));
      
      setIsEditingPrice(null);
      setNewPrice('');
      
      // Send notification to user
      await firebaseService.sendNotification({
        booking_id: id,
        title: "Price Updated",
        body: `Your booking price has been updated to $${newPrice}`,
        data: {
          type: "price_update",
          booking_id: id,
          new_price: newPrice
        }
      });
      
      toast({
        title: "Price updated",
        description: "Booking price has been updated and user has been notified"
      });
      
    } catch (error) {
      toast({
        title: "Error updating price",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  useEffect(() => {
    fetchHelicopters();
  }, []);

  const fetchHelicopters = async () => {
    try {
      setIsLoadingHelicopters(true);
      const data = await helicopterService.getAllHelicopters();
      setHelicopters(data);
    } catch (error) {
      toast({
        title: "Error fetching helicopters",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoadingHelicopters(false);
    }
  };

  const handleAddHelicopter = async () => {
    try {
      if (!newHelicopter.model || !newHelicopter.capacity) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        return;
      }

      await helicopterService.addHelicopter(newHelicopter);
      toast({
        title: "Success",
        description: "Helicopter added successfully"
      });
      setIsAddHelicopterDialogOpen(false);
      setNewHelicopter({ model: '', capacity: '', image_url: '' });
      fetchHelicopters();
    } catch (error) {
      toast({
        title: "Error adding helicopter",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDeleteHelicopter = async (id) => {
    try {
      await helicopterService.deleteHelicopter(id);
      toast({
        title: "Success",
        description: "Helicopter deleted successfully"
      });
      fetchHelicopters();
    } catch (error) {
      toast({
        title: "Error deleting helicopter",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    // Set up Firebase notification handler
    const handleNegotiationNotification = (payload) => {
      if (payload.data?.type === 'negotiation_request') {
        // Add to pending negotiations
        setPendingNegotiations(prev => [...prev, {
          booking_id: payload.data.booking_id,
          amount: payload.data.amount,
          notes: payload.data.notes,
          timestamp: new Date().toISOString()
        }]);
        
        // Show toast notification
        toast({
          title: "New Negotiation Request",
          description: `Booking #${payload.data.booking_id} has a new negotiation request.`,
          action: (
            <ToastAction altText="View" onClick={() => handleViewNegotiation(payload.data.booking_id)}>
              View
            </ToastAction>
          ),
        });
      }
    };
    
    // Subscribe to Firebase messages
    firebaseService.setupMessageHandler(handleNegotiationNotification);
    
    return () => {
      // No need to unsubscribe as the setupMessageHandler doesn't return a cleanup function
    };
  }, []);
  
  const handleViewNegotiation = (bookingId) => {
    // Find the booking in the list
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      // Open negotiation dialog or navigate to booking details
      setSelectedBooking(booking);
      setNegotiationDialogOpen(true);
    }
  };

  const handleUpload = (file) => {
    if (file) {
      setNewHelicopter({ ...newHelicopter, image_url: file.cdnUrl });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header/Navigation */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-dejair-700">Dejair</span>
                <span className="text-2xl font-light text-dejair-500">Skyline</span>
                <span className="ml-2 text-sm bg-dejair-100 text-dejair-800 px-2 py-0.5 rounded-md">Admin</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Bell className="h-5 w-5 text-gray-500 cursor-pointer hover:text-dejair-600" />
                {unreadMessages > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                    {unreadMessages > 9 ? '9+' : unreadMessages}
                  </span>
                )}
              </div>
              
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-dejair-600 text-white flex items-center justify-center">
                  A
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700">
                  {authService.getCurrentUser()?.name || 'Admin'}
                </span>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Today's Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-dejair-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayStats.bookings}</div>
              <p className="text-xs text-gray-500">New bookings today</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-dejair-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${todayStats.revenue.toLocaleString()}</div>
              <p className="text-xs text-gray-500">From completed bookings</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Pending Bookings</CardTitle>
              <Plane className="h-4 w-4 text-dejair-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayStats.pendingBookings}</div>
              <p className="text-xs text-gray-500">Requires attention</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Tabs */}
        <Tabs defaultValue="bookings">
          <TabsList className="mb-4">
            <TabsTrigger value="bookings">Bookings Management</TabsTrigger>
            <TabsTrigger value="admins">Admin Users</TabsTrigger>
            <TabsTrigger value="helicopters">Helicopter Fleet</TabsTrigger>
          </TabsList>
          
          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex-grow">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Search bookings..." 
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="negotiation_requested">Negotiation</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {isLoading ? (
                <div className="text-center py-8">
                  <p>Loading bookings data...</p>
                </div>
              ) : filteredBookings.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No bookings found matching your criteria</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Helicopter</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredBookings.map((booking) => (
                        <tr key={booking.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{booking.client?.name || 'Unknown'}</div>
                            <div className="text-sm text-gray-500">{booking.client?.email || 'No email'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {booking.helicopter?.model || 'Unknown helicopter'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div>{booking.date || 'No date'}</div>
                            <div>{booking.time || 'No time'} ({booking.duration || 1}h)</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {booking.location || 'Location not specified'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {isEditingPrice === booking.id ? (
                              <div className="flex items-center space-x-1">
                                <span className="text-gray-500">$</span>
                                <input 
                                  type="number" 
                                  className="w-20 p-1 border rounded"
                                  value={newPrice}
                                  onChange={(e) => setNewPrice(e.target.value)}
                                />
                                <button onClick={() => handleSavePrice(booking.id)} className="p-1 text-green-600 hover:text-green-800">
                                  <Check className="h-4 w-4" />
                                </button>
                                <button onClick={() => setIsEditingPrice(null)} className="p-1 text-red-600 hover:text-red-800">
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center">
                                <span>${booking.final_amount?.toLocaleString() || 0}</span>
                                <button onClick={() => handleStartPriceEdit(booking.id, booking.final_amount)} className="ml-2 text-dejair-600 hover:text-dejair-800">
                                  <Edit className="h-4 w-4" />
                                </button>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusBadge status={booking.status} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              {booking.status === 'negotiation_requested' && (
                                <>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="text-green-500 border-green-200 hover:bg-green-50"
                                    onClick={() => handleNegotiationRequest(booking)}
                                  >
                                    <Handshake className="h-4 w-4" />
                                    Negotiate
                                  </Button>
                                </>
                              )}
                              
                              <Link to={`/booking/${booking.id}/chat`}>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="text-blue-500 border-blue-200 hover:bg-blue-50"
                                >
                                  <MessageSquare className="h-4 w-4" />
                                </Button>
                              </Link>
                              
                              {booking.status !== 'completed' && booking.status !== 'cancelled' && (
                                <Select 
                                  defaultValue={booking.status}
                                  onValueChange={(value) => handleUpdateBookingStatus(booking.id, value)}
                                >
                                  <SelectTrigger className="w-32">
                                    <SelectValue placeholder="Change status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="confirmed">Confirm</SelectItem>
                                    <SelectItem value="completed">Complete</SelectItem>
                                    <SelectItem value="cancelled">Cancel</SelectItem>
                                  </SelectContent>
                                </Select>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Admins Tab */}
          <TabsContent value="admins">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-medium">Admin Users</h3>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Add Admin
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Admin</DialogTitle>
                      <DialogDescription>
                        Add a new administrator to manage the Dejair Skyline system.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                          id="name" 
                          value={newAdmin.name} 
                          onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})} 
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={newAdmin.email} 
                          onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})} 
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="role">Role</Label>
                        <Select 
                          value={newAdmin.role} 
                          onValueChange={(value) => setNewAdmin({...newAdmin, role: value})}
                        >
                          <SelectTrigger id="role">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Admin">Admin</SelectItem>
                            <SelectItem value="Super Admin">Super Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button onClick={handleAddAdmin}>Add Admin</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="p-8 text-center">
                <p className="text-gray-500 mb-4">Admin management API coming soon</p>
                <p className="text-gray-400 text-sm">This feature is currently in development.</p>
              </div>
            </div>
          </TabsContent>
          
          {/* Helicopters Tab */}
          <TabsContent value="helicopters">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-lg font-semibold">Helicopter Fleet Management</h2>
                <Button onClick={() => setIsAddHelicopterDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Helicopter
                </Button>
              </div>

              {isLoadingHelicopters ? (
                <div className="text-center py-8">
                  <p>Loading helicopter data...</p>
                </div>
              ) : helicopters.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No helicopters in the fleet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {helicopters.map((helicopter) => (
                        <tr key={helicopter.id}>
                          <td className="px-6 py-4 whitespace-nowrap">{helicopter.model}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{helicopter.capacity} passengers</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {helicopter.image_url && (
                              <img src={helicopter.image_url} alt={helicopter.model} className="h-10 w-10 object-cover rounded" />
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteHelicopter(helicopter.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Add Negotiation Dialog */}
        <Dialog open={negotiationDialogOpen} onOpenChange={setNegotiationDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Manage Negotiation</DialogTitle>
              <DialogDescription>
                Review and respond to the negotiation request.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <h4 className="font-medium">Booking Details:</h4>
                <div className="text-sm text-gray-500">
                  <p>ID: {selectedBooking?.id}</p>
                  <p>Customer: {selectedBooking?.customer_name}</p>
                  <p>Original Amount: ${selectedBooking?.original_amount}</p>
                  <p>Requested Amount: ${selectedBooking?.negotiated_amount}</p>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label>Action</Label>
                <div className="flex gap-2">
                  <Button
                    variant={negotiationAction === 'accept' ? 'default' : 'outline'}
                    onClick={() => setNegotiationAction('accept')}
                    className="flex-1"
                  >
                    Accept
                  </Button>
                  <Button
                    variant={negotiationAction === 'reject' ? 'default' : 'outline'}
                    onClick={() => setNegotiationAction('reject')}
                    className="flex-1"
                  >
                    Reject
                  </Button>
                </div>
              </div>
              
              {negotiationAction === 'accept' && (
                <div className="grid gap-2">
                  <Label htmlFor="final-amount">Final Amount</Label>
                  <Input
                    id="final-amount"
                    type="number"
                    value={finalAmount}
                    onChange={(e) => setFinalAmount(e.target.value)}
                    placeholder="Enter final amount"
                  />
                </div>
              )}
              
              <div className="grid gap-2">
                <Label htmlFor="negotiation-notes">Notes</Label>
                <Input
                  id="negotiation-notes"
                  value={negotiationNotes}
                  onChange={(e) => setNegotiationNotes(e.target.value)}
                  placeholder="Enter negotiation notes"
                />
              </div>
              
              {negotiationHistory.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Negotiation History:</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {negotiationHistory.map((negotiation, index) => (
                      <div key={index} className="p-2 bg-gray-50 rounded-md text-sm">
                        <p className="font-medium">Amount: ${negotiation.new_amount || negotiation.old_amount}</p>
                        <p className="text-gray-600">Notes: {negotiation.notes}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(negotiation.created_at).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setNegotiationDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleNegotiationSubmit}
                disabled={negotiationAction === 'accept' && (!finalAmount || isNaN(finalAmount))}
              >
                {negotiationAction === 'accept' ? 'Accept & Set Price' : 'Reject Negotiation'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Helicopter Dialog */}
        <Dialog open={isAddHelicopterDialogOpen} onOpenChange={setIsAddHelicopterDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Helicopter</DialogTitle>
              <DialogDescription>
                Add a new helicopter to the fleet
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  value={newHelicopter.model}
                  onChange={(e) => setNewHelicopter({ ...newHelicopter, model: e.target.value })}
                  placeholder="Enter helicopter model"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={newHelicopter.capacity}
                  onChange={(e) => setNewHelicopter({ ...newHelicopter, capacity: e.target.value })}
                  placeholder="Enter passenger capacity"
                />
              </div>
              <div className="grid gap-2">
                <Label>Upload Image</Label>
                <div className="border rounded-md p-4">
                  <FileUploaderRegular
                    pubkey="2a4bb720cf8bcd6b97e7"
                    onFileUploadSuccess={handleUpload}
                    sourceList="local, camera, facebook, gdrive"
                    cameraModes="photo, video"
                    classNameUploader="uc-dark"
                  />
                </div>
                {newHelicopter.image_url && (
                  <div className="mt-4">
                    <Label>Preview</Label>
                    <div className="mt-2 border rounded-md overflow-hidden max-w-xs">
                      <img
                        src={newHelicopter.image_url}
                        alt="Helicopter preview"
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddHelicopterDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddHelicopter}>
                Add Helicopter
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add pending negotiations section */}
        {pendingNegotiations.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Pending Negotiations</h2>
            <div className="grid gap-4">
              {pendingNegotiations.map((negotiation, index) => (
                <div key={index} className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">Booking #{negotiation.booking_id}</h3>
                      <p className="text-sm text-gray-600">Amount: ${negotiation.amount}</p>
                      <p className="text-sm text-gray-600">Notes: {negotiation.notes}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewNegotiation(negotiation.booking_id)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  switch(status) {
    case 'confirmed':
      return <Badge className="bg-green-500">Confirmed</Badge>;
    case 'pending':
      return <Badge className="bg-yellow-500">Pending</Badge>;
    case 'negotiation_requested':
      return <Badge className="bg-blue-500">Negotiation</Badge>;
    case 'pending_payment':
      return <Badge className="bg-purple-500">Payment Pending</Badge>;
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

export default AdminDashboard;
