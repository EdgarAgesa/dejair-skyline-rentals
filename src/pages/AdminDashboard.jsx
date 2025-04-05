import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, ChevronDown, Bell, Search, Plane, 
  Calendar, DollarSign, UserPlus, Edit, Trash2,
  Check, X
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

// Sample data
const SAMPLE_BOOKINGS = [
  { id: 1, customer: "John Smith", email: "john@example.com", helicopter: "Bell 407GXi", date: "2025-05-10", time: "10:00 AM", duration: 2, location: "Grand Canyon Tour", price: 1200, status: "confirmed" },
  { id: 2, customer: "Sarah Johnson", email: "sarah@example.com", helicopter: "Airbus H130", date: "2025-05-15", time: "2:30 PM", duration: 1.5, location: "City Skyline Tour", price: 850, status: "pending" },
  { id: 3, customer: "Michael Brown", email: "michael@example.com", helicopter: "Robinson R66", date: "2025-04-02", time: "11:00 AM", duration: 1, location: "Coastal Tour", price: 600, status: "completed" },
  { id: 4, customer: "Emma Wilson", email: "emma@example.com", helicopter: "Bell 407GXi", date: "2025-05-20", time: "9:00 AM", duration: 3, location: "Mountain Explorer", price: 1600, status: "pending" },
  { id: 5, customer: "David Lee", email: "david@example.com", helicopter: "Airbus H130", date: "2025-05-01", time: "4:00 PM", duration: 2, location: "Sunset City Tour", price: 1100, status: "confirmed" },
];

const SAMPLE_ADMINS = [
  { id: 1, name: "Admin User", email: "admin@dejair.com", role: "Super Admin", status: "active" },
  { id: 2, name: "Jane Smith", email: "jane@dejair.com", role: "Admin", status: "active" },
  { id: 3, name: "Mark Johnson", email: "mark@dejair.com", role: "Admin", status: "inactive" },
];

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
  const { toast } = useToast();

  // Track today's stats
  const [todayStats, setTodayStats] = useState({
    bookings: 0,
    revenue: 0,
    pendingBookings: 0
  });

  useEffect(() => {
    // Check if admin is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userRole = localStorage.getItem('userRole');
    
    if (!isLoggedIn || userRole !== 'admin') {
      // Redirect to login if not logged in as admin
      window.location.href = '/login';
      return;
    }
    
    // Simulate fetching data from an API
    setTimeout(() => {
      setBookings(SAMPLE_BOOKINGS);
      setFilteredBookings(SAMPLE_BOOKINGS);
      setAdmins(SAMPLE_ADMINS);
      
      // Calculate today's stats (for demo purposes)
      setTodayStats({
        bookings: 3,
        revenue: 2650,
        pendingBookings: 2
      });
      
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    // Filter bookings based on search query and status filter
    const filtered = bookings.filter(booking => {
      const matchesSearch = 
        booking.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.helicopter.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.location.toLowerCase().includes(searchQuery.toLowerCase());
      
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
    
    // Check if email already exists
    if (admins.some(admin => admin.email === newAdmin.email)) {
      toast({
        title: "Error",
        description: "Admin with this email already exists",
        variant: "destructive"
      });
      return;
    }
    
    // Add new admin
    const newAdminWithId = {
      id: admins.length + 1,
      ...newAdmin,
      status: 'active'
    };
    
    setAdmins([...admins, newAdminWithId]);
    setNewAdmin({ name: '', email: '', role: 'Admin' });
    
    toast({
      title: "Admin added",
      description: "New admin has been successfully added"
    });
  };

  const handleRemoveAdmin = (id) => {
    // Don't allow removing the super admin
    if (id === 1) {
      toast({
        title: "Cannot remove Super Admin",
        description: "The Super Admin account cannot be removed",
        variant: "destructive"
      });
      return;
    }
    
    setAdmins(admins.filter(admin => admin.id !== id));
    
    toast({
      title: "Admin removed",
      description: "Admin has been successfully removed"
    });
  };

  const handleToggleAdminStatus = (id) => {
    // Don't allow deactivating the super admin
    if (id === 1) {
      toast({
        title: "Cannot deactivate Super Admin",
        description: "The Super Admin account cannot be deactivated",
        variant: "destructive"
      });
      return;
    }
    
    setAdmins(admins.map(admin => 
      admin.id === id 
        ? {...admin, status: admin.status === 'active' ? 'inactive' : 'active'} 
        : admin
    ));
    
    toast({
      title: "Status changed",
      description: "Admin status has been updated"
    });
  };

  const handleUpdateBookingStatus = (id, newStatus) => {
    setBookings(bookings.map(booking => 
      booking.id === id ? {...booking, status: newStatus} : booking
    ));
    
    toast({
      title: "Booking updated",
      description: `Booking status changed to ${newStatus}`
    });
  };

  const handleStartPriceEdit = (id, currentPrice) => {
    setIsEditingPrice(id);
    setNewPrice(currentPrice.toString());
  };

  const handleSavePrice = (id) => {
    if (!newPrice || isNaN(Number(newPrice)) || Number(newPrice) <= 0) {
      toast({
        title: "Invalid price",
        description: "Please enter a valid price",
        variant: "destructive"
      });
      return;
    }
    
    setBookings(bookings.map(booking => 
      booking.id === id ? {...booking, price: Number(newPrice)} : booking
    ));
    
    setIsEditingPrice(null);
    setNewPrice('');
    
    toast({
      title: "Price updated",
      description: "Booking price has been updated"
    });
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
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">3</span>
              </div>
              
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-dejair-600 text-white flex items-center justify-center">
                  A
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700">Admin</span>
                <ChevronDown className="ml-1 h-4 w-4 text-gray-500" />
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
              <p className="text-xs text-gray-500">+5% from yesterday</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Today's Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-dejair-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${todayStats.revenue.toLocaleString()}</div>
              <p className="text-xs text-gray-500">+12% from yesterday</p>
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
                      <SelectItem value="confirmed">Confirmed</SelectItem>
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
                            <div className="font-medium text-gray-900">{booking.customer}</div>
                            <div className="text-sm text-gray-500">{booking.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {booking.helicopter}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div>{booking.date}</div>
                            <div>{booking.time} ({booking.duration}h)</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {booking.location}
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
                                <span>${booking.price.toLocaleString()}</span>
                                <button onClick={() => handleStartPriceEdit(booking.id, booking.price)} className="ml-2 text-dejair-600 hover:text-dejair-800">
                                  <Edit className="h-4 w-4" />
                                </button>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusBadge status={booking.status} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Select 
                              value={booking.status} 
                              onValueChange={(value) => handleUpdateBookingStatus(booking.id, value)}
                              disabled={booking.status === 'completed' || booking.status === 'cancelled'}
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
              
              {isLoading ? (
                <div className="text-center py-8">
                  <p>Loading admin data...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {admins.map((admin) => (
                        <tr key={admin.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{admin.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {admin.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {admin.role}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className={admin.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}>
                              {admin.status === 'active' ? 'Active' : 'Inactive'}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleToggleAdminStatus(admin.id)}
                                disabled={admin.id === 1}
                              >
                                {admin.status === 'active' ? 'Deactivate' : 'Activate'}
                              </Button>
                              
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-red-500 border-red-200 hover:bg-red-50"
                                onClick={() => handleRemoveAdmin(admin.id)}
                                disabled={admin.id === 1}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
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
    case 'completed':
      return <Badge className="bg-blue-500">Completed</Badge>;
    case 'cancelled':
      return <Badge className="bg-red-500">Cancelled</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

export default AdminDashboard;
