
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CalendarCheck, Clock, MapPin, Helicopter, PenLine, Ban, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Sample booking data - in a real app, this would come from your backend
const SAMPLE_BOOKINGS = [
  {
    id: 1,
    helicopterName: "Bell 407GXi",
    date: "2025-05-10",
    time: "10:00 AM",
    duration: 2,
    location: "Grand Canyon Tour",
    price: 1200,
    status: "confirmed"
  },
  {
    id: 2,
    helicopterName: "Airbus H130",
    date: "2025-05-15",
    time: "2:30 PM",
    duration: 1.5,
    location: "City Skyline Tour",
    price: 850,
    status: "pending"
  },
  {
    id: 3,
    helicopterName: "Robinson R66",
    date: "2025-04-02",
    time: "11:00 AM",
    duration: 1,
    location: "Coastal Tour",
    price: 600,
    status: "completed"
  }
];

const UserDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const storedEmail = localStorage.getItem('userEmail');
    
    if (!isLoggedIn) {
      // Redirect to login if not logged in
      window.location.href = '/login';
      return;
    }
    
    setUserEmail(storedEmail || 'User');
    
    // Simulate fetching bookings from an API
    setTimeout(() => {
      setBookings(SAMPLE_BOOKINGS);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleCancelBooking = (id) => {
    // In a real app, you would make an API call to cancel the booking
    setBookings(bookings.map(booking => 
      booking.id === id ? {...booking, status: 'cancelled'} : booking
    ));
    
    toast({
      title: "Booking cancelled",
      description: "Your booking has been successfully cancelled.",
    });
  };

  const handleModifyBooking = (id) => {
    // In a real app, you would navigate to a booking modification page
    toast({
      title: "Modify booking",
      description: "This feature is coming soon!",
    });
  };

  const getStatusBadge = (status) => {
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome, {userEmail}</h1>
              <p className="text-gray-600">Manage your helicopter bookings and preferences</p>
            </div>
            <Link to="/helicopters">
              <Button className="bg-dejair-600 hover:bg-dejair-700">
                Book a Helicopter
              </Button>
            </Link>
          </div>
          
          <Tabs defaultValue="upcoming" className="space-y-6">
            <TabsList className="bg-white border">
              <TabsTrigger value="upcoming">Upcoming Bookings</TabsTrigger>
              <TabsTrigger value="past">Past Bookings</TabsTrigger>
              <TabsTrigger value="all">All Bookings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming" className="space-y-6">
              {isLoading ? (
                <div className="text-center py-10">
                  <p>Loading your bookings...</p>
                </div>
              ) : bookings.filter(b => ['confirmed', 'pending'].includes(b.status)).length === 0 ? (
                <div className="text-center py-10 bg-white rounded-lg shadow-sm">
                  <p className="text-gray-500 mb-4">You don't have any upcoming bookings</p>
                  <Link to="/helicopters">
                    <Button className="bg-dejair-600 hover:bg-dejair-700">
                      Book a Helicopter
                    </Button>
                  </Link>
                </div>
              ) : (
                bookings
                  .filter(booking => ['confirmed', 'pending'].includes(booking.status))
                  .map(booking => (
                    <BookingCard 
                      key={booking.id}
                      booking={booking}
                      onCancel={() => handleCancelBooking(booking.id)}
                      onModify={() => handleModifyBooking(booking.id)}
                      statusBadge={getStatusBadge(booking.status)}
                    />
                  ))
              )}
            </TabsContent>
            
            <TabsContent value="past" className="space-y-6">
              {isLoading ? (
                <div className="text-center py-10">
                  <p>Loading your bookings...</p>
                </div>
              ) : bookings.filter(b => ['completed', 'cancelled'].includes(b.status)).length === 0 ? (
                <div className="text-center py-10 bg-white rounded-lg shadow-sm">
                  <p className="text-gray-500">You don't have any past bookings</p>
                </div>
              ) : (
                bookings
                  .filter(booking => ['completed', 'cancelled'].includes(booking.status))
                  .map(booking => (
                    <BookingCard 
                      key={booking.id}
                      booking={booking}
                      isPast={true}
                      statusBadge={getStatusBadge(booking.status)}
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
                    onCancel={['confirmed', 'pending'].includes(booking.status) ? () => handleCancelBooking(booking.id) : null}
                    onModify={['confirmed', 'pending'].includes(booking.status) ? () => handleModifyBooking(booking.id) : null}
                    isPast={['completed', 'cancelled'].includes(booking.status)}
                    statusBadge={getStatusBadge(booking.status)}
                  />
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

const BookingCard = ({ booking, onCancel, onModify, isPast = false, statusBadge }) => {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div>
          <CardTitle className="text-xl font-bold">{booking.helicopterName}</CardTitle>
          <CardDescription>{booking.location}</CardDescription>
        </div>
        <div>{statusBadge}</div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <CalendarCheck className="h-4 w-4 text-dejair-600" />
            <span className="text-sm">{booking.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-dejair-600" />
            <span className="text-sm">{booking.time} ({booking.duration} {booking.duration > 1 ? 'hours' : 'hour'})</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-dejair-600" />
            <span className="text-sm">{booking.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Helicopter className="h-4 w-4 text-dejair-600" />
            <span className="text-sm">{booking.helicopterName}</span>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-right font-bold text-dejair-800">${booking.price.toLocaleString()}</p>
        </div>
      </CardContent>
      {!isPast && (onCancel || onModify) && (
        <CardFooter className="flex justify-end space-x-2 pt-2">
          {onModify && (
            <Button variant="outline" size="sm" onClick={onModify}>
              <PenLine className="mr-1 h-4 w-4" />
              Modify
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
