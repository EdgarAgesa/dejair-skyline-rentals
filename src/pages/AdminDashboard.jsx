
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Users, ChevronDown, Bell, Search, Plane, 
  Calendar, DollarSign, UserPlus, Edit, Trash2,
  Check, X, MessageSquare
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

  // Fetch all bookings data
  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      
      // Fetch different types of bookings
      const negotiatedBookings = await bookingService.getAdminNegotiatedBookings();
      const incompleteBookings = await bookingService.getAdminIncompleteBookings();
      const completedBookings = await bookingService.getAdminCompletedBookings();
      
      // Combine all bookings
      const allBookings = [
        ...negotiatedBookings.map(booking => ({ ...booking, status: 'negotiation_requested' })),
        ...incompleteBookings.map(booking => ({ ...booking, status: 'pending' })),
        ...completedBookings.map(booking => ({ ...booking, status: 'completed' }))
      ];
      
      setBookings(allBookings);
      setFilteredBookings(allBookings);
      
      // Calculate today's stats
      const today = new Date().toISOString().split('T')[0];
      const todayBookings = allBookings.filter(booking => booking.date === today);
      
      setTodayStats({
        bookings: todayBookings.length,
        revenue: completedBookings.reduce((sum, booking) => sum + booking.final_amount, 0),
        pendingBookings: incompleteBookings.length + negotiatedBookings.length
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
      const count = await chatService.getUnreadMessageCount();
      setUnreadMessages(count);
    } catch (error) {
      console.error("Error fetching unread messages:", error);
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

  const handleNegotiationAction = async (id, action, amount) => {
    try {
      const negotiationData = {
        action: action,
        finalAmount: amount,
        notes: `Admin ${action}ed the negotiation request`
      };
      
      await bookingService.handleNegotiation(id, negotiationData);
      
      toast({
        title: "Negotiation handled",
        description: `Negotiation ${action}ed successfully`
      });
      
      // Refresh bookings
      fetchBookings();
      
    } catch (error) {
      toast({
        title: "Error handling negotiation",
        description: error.message,
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
      await bookingService.updateBooking(id, { 
        final_amount: Number(newPrice) 
      });
      
      // Update local state
      setBookings(bookings.map(booking => 
        booking.id === id ? {...booking, final_amount: Number(newPrice)} : booking
      ));
      
      setIsEditingPrice(null);
      setNewPrice('');
      
      toast({
        title: "Price updated",
        description: "Booking price has been updated"
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
                                    onClick={() => handleNegotiationAction(booking.id, 'accept', booking.final_amount)}
                                  >
                                    Accept
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="text-red-500 border-red-200 hover:bg-red-50"
                                    onClick={() => handleNegotiationAction(booking.id, 'reject', booking.original_amount)}
                                  >
                                    Reject
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
        </Tabs>
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
