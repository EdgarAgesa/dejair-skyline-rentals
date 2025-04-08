import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CalendarRange, Clock, Users, MapPin, Compass, Info, ChevronDown, ChevronUp, Check, Plane } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import bookingService from '../services/bookingService';
import helicopterService from '../services/helicopterService';
import authService from '../services/authService';
import PaymentDialog from '../components/PaymentDialog';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const Helicopters = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [selectedPassengers, setSelectedPassengers] = useState(null);
  const [selectedHelicopter, setSelectedHelicopter] = useState(null);
  const [selectedTour, setSelectedTour] = useState(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);
  const [helicopters, setHelicopters] = useState([]);
  const [filteredHelicopters, setFilteredHelicopters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    capacity: [],
    maxPrice: 5000,
    availability: []
  });
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    date: '',
    time: '',
    purpose: '',
    num_passengers: 1,
    amount: 0
  });

  // Fetch helicopters from the backend
  useEffect(() => {
    const fetchHelicopters = async () => {
      try {
        setIsLoading(true);
        const data = await helicopterService.getAllHelicopters();
        setHelicopters(data);
        setFilteredHelicopters(data);
      } catch (error) {
        console.error('Error fetching helicopters:', error);
        toast({
          title: "Error",
          description: "Failed to load helicopters. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchHelicopters();
  }, [toast]);

  // Update filtered helicopters when filters change
  useEffect(() => {
    let filtered = [...helicopters];
    
    // Filter by capacity
    if (filters.capacity.length > 0) {
      filtered = filtered.filter(helicopter => {
        const capacityValue = helicopter.capacity;
        return filters.capacity.some(range => {
          if (range === "1-4") return capacityValue >= 1 && capacityValue <= 4;
          if (range === "5-8") return capacityValue >= 5 && capacityValue <= 8;
          if (range === "9+") return capacityValue >= 9;
          return false;
        });
      });
    }
    
    // Filter by hourly rate
    filtered = filtered.filter(helicopter => helicopter.hourlyRate <= filters.maxPrice);
    
    // Filter by availability
    if (filters.availability.length > 0) {
      filtered = filtered.filter(helicopter => 
        filters.availability.includes(helicopter.availability.toLowerCase())
      );
    }
    
    setFilteredHelicopters(filtered);
  }, [filters, helicopters]);

  const toggleCapacityFilter = (value) => {
    setFilters(prev => {
      const newCapacity = prev.capacity.includes(value)
        ? prev.capacity.filter(item => item !== value)
        : [...prev.capacity, value];
      
      return { ...prev, capacity: newCapacity };
    });
  };

  const toggleAvailabilityFilter = (value) => {
    setFilters(prev => {
      const newAvailability = prev.availability.includes(value)
        ? prev.availability.filter(item => item !== value)
        : [...prev.availability, value];
      
      return { ...prev, availability: newAvailability };
    });
  };

  const handleBooking = (helicopter) => {
    // Check if user is logged in
    if (!authService.isLoggedIn()) {
      toast({
        title: "Login required",
        description: "Please log in to book a helicopter.",
      });
      navigate('/login');
      return;
    }
    
    setSelectedHelicopter(helicopter);
    setBookingDetails({
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '12:00:00',
      purpose: '',
      num_passengers: 1,
      amount: helicopter.hourlyRate || 1000
    });
    setShowBookingForm(true);
  };

  const handleBookingSubmit = async () => {
    try {
      // Validate booking details
      if (!bookingDetails.purpose) {
        toast({
          title: "Purpose required",
          description: "Please enter the purpose of your booking.",
          variant: "destructive",
        });
        return;
      }

      // Prepare booking data with required fields
      const bookingData = {
        helicopter_id: selectedHelicopter.id,
        date: bookingDetails.date,
        time: bookingDetails.time,
        purpose: bookingDetails.purpose,
        num_passengers: bookingDetails.num_passengers,
        amount: bookingDetails.amount
      };
      
      // Create booking using the booking service
      const response = await bookingService.createBooking(bookingData);
      
      // Show success message with booking details
      toast({
        title: "Booking created successfully",
        description: "Please proceed to payment to confirm your booking.",
      });
      
      // Store the booking for payment
      setCurrentBooking(response.booking);
      
      // Close booking form and show payment dialog
      setShowBookingForm(false);
      setShowPaymentDialog(true);
      
    } catch (error) {
      toast({
        title: "Booking failed",
        description: error.message || "Failed to create booking. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBookingCancel = () => {
    setShowBookingForm(false);
    setSelectedHelicopter(null);
    setBookingDetails({
      date: '',
      time: '',
      purpose: '',
      num_passengers: 1,
      amount: 0
    });
  };

  const handlePaymentSuccess = (data) => {
    setShowPaymentDialog(false);
    setCurrentBooking(null);
    
    toast({
      title: "Payment successful",
      description: "Your booking has been confirmed. You can view your booking details in your dashboard.",
    });
    
    // Navigate to user dashboard to view booking
    navigate('/user-dashboard');
  };

  const handlePaymentCancel = () => {
    setShowPaymentDialog(false);
    setCurrentBooking(null);
    
    toast({
      title: "Payment cancelled",
      description: "Your booking is pending payment. You can complete the payment later from your dashboard.",
    });
  };

  const resetFilters = () => {
    setFilters({
      capacity: [],
      maxPrice: 5000,
      availability: []
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="bg-dejair-600 text-white py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Our Helicopter Fleet</h1>
          <p className="text-dejair-100">Browse our premium helicopters and book your next aerial adventure</p>
        </div>
      </div>
      
      <div className="flex-grow bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="md:w-1/4">
              <Collapsible
                open={isFiltersOpen}
                onOpenChange={setIsFiltersOpen}
                className="bg-white p-4 rounded-lg shadow-sm mb-4 md:sticky md:top-24"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium">Filters</h2>
                  <CollapsibleTrigger className="md:hidden">
                    {isFiltersOpen ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </CollapsibleTrigger>
                </div>
                
                <CollapsibleContent className="space-y-6 mt-4">
                  {/* Passenger Capacity */}
                  <div>
                    <h3 className="font-medium mb-2">Passenger Capacity</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="capacity-1-4" 
                          checked={filters.capacity.includes("1-4")}
                          onCheckedChange={() => toggleCapacityFilter("1-4")}
                        />
                        <label htmlFor="capacity-1-4" className="text-sm">1-4 passengers</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="capacity-5-8" 
                          checked={filters.capacity.includes("5-8")}
                          onCheckedChange={() => toggleCapacityFilter("5-8")}
                        />
                        <label htmlFor="capacity-5-8" className="text-sm">5-8 passengers</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="capacity-9+" 
                          checked={filters.capacity.includes("9+")}
                          onCheckedChange={() => toggleCapacityFilter("9+")}
                        />
                        <label htmlFor="capacity-9+" className="text-sm">9+ passengers</label>
                      </div>
                    </div>
                  </div>
                  
                  {/* Hourly Rate */}
                  <div>
                    <h3 className="font-medium mb-2">Maximum Hourly Rate</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="price-1000" 
                          checked={filters.maxPrice === 1000}
                          onCheckedChange={() => setFilters(prev => ({ ...prev, maxPrice: 1000 }))}
                        />
                        <label htmlFor="price-1000" className="text-sm">$1,000 or less</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="price-2000" 
                          checked={filters.maxPrice === 2000}
                          onCheckedChange={() => setFilters(prev => ({ ...prev, maxPrice: 2000 }))}
                        />
                        <label htmlFor="price-2000" className="text-sm">$2,000 or less</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="price-5000" 
                          checked={filters.maxPrice === 5000}
                          onCheckedChange={() => setFilters(prev => ({ ...prev, maxPrice: 5000 }))}
                        />
                        <label htmlFor="price-5000" className="text-sm">$5,000 or less</label>
                      </div>
                    </div>
                  </div>
                  
                  {/* Availability */}
                  <div>
                    <h3 className="font-medium mb-2">Availability</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="avail-high" 
                          checked={filters.availability.includes("high")}
                          onCheckedChange={() => toggleAvailabilityFilter("high")}
                        />
                        <label htmlFor="avail-high" className="text-sm">High Availability</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="avail-medium" 
                          checked={filters.availability.includes("medium")}
                          onCheckedChange={() => toggleAvailabilityFilter("medium")}
                        />
                        <label htmlFor="avail-medium" className="text-sm">Medium Availability</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="avail-low" 
                          checked={filters.availability.includes("low")}
                          onCheckedChange={() => toggleAvailabilityFilter("low")}
                        />
                        <label htmlFor="avail-low" className="text-sm">Low Availability</label>
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="outline" onClick={resetFilters} className="w-full">
                    Reset Filters
                  </Button>
                </CollapsibleContent>
              </Collapsible>
            </div>
            
            {/* Main Content */}
            <div className="md:w-3/4">
              <Tabs defaultValue="helicopters">
                <TabsList className="mb-6">
                  <TabsTrigger value="helicopters">All Helicopters</TabsTrigger>
                  <TabsTrigger value="tours">Available Tours</TabsTrigger>
                </TabsList>
                
                {/* Helicopters Tab */}
                <TabsContent value="helicopters">
                  {isLoading ? (
                    <div className="text-center py-10 bg-white rounded-lg shadow-sm">
                      <p className="text-gray-500 mb-4">Loading helicopters...</p>
                    </div>
                  ) : filteredHelicopters.length === 0 ? (
                    <div className="text-center py-10 bg-white rounded-lg shadow-sm">
                      <p className="text-gray-500 mb-4">No helicopters match your current filters</p>
                      <Button variant="outline" onClick={resetFilters}>
                        Reset Filters
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {filteredHelicopters.map((helicopter) => (
                        <HelicopterCard 
                          key={helicopter.id} 
                          helicopter={helicopter} 
                          onBook={handleBooking}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                {/* Tours Tab */}
                <TabsContent value="tours">
                  {isLoading ? (
                    <div className="text-center py-10 bg-white rounded-lg shadow-sm">
                      <p className="text-gray-500 mb-4">Loading tours...</p>
                    </div>
                  ) : (
                  <div className="space-y-6">
                    {filteredHelicopters.flatMap(helicopter => 
                      helicopter.tours.map(tour => (
                        <TourCard 
                          key={`${helicopter.id}-${tour.id}`}
                          helicopter={helicopter}
                          tour={tour}
                          onBook={handleBooking}
                        />
                      ))
                    )}
                  </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
      
      {/* Booking Form Dialog */}
      {showBookingForm && selectedHelicopter && (
        <Dialog open={showBookingForm} onOpenChange={handleBookingCancel}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Book {selectedHelicopter.name}</DialogTitle>
              <DialogDescription>
                Please enter your booking details below.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={bookingDetails.date}
                  onChange={(e) => setBookingDetails(prev => ({ ...prev, date: e.target.value }))}
                  min={format(new Date(), 'yyyy-MM-dd')}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={bookingDetails.time.split(':').slice(0, 2).join(':')}
                  onChange={(e) => setBookingDetails(prev => ({ ...prev, time: `${e.target.value}:00` }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose</Label>
                <Input
                  id="purpose"
                  placeholder="Enter the purpose of your booking"
                  value={bookingDetails.purpose}
                  onChange={(e) => setBookingDetails(prev => ({ ...prev, purpose: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="passengers">Number of Passengers</Label>
                <Input
                  id="passengers"
                  type="number"
                  min="1"
                  max={selectedHelicopter.capacity}
                  value={bookingDetails.num_passengers}
                  onChange={(e) => setBookingDetails(prev => ({ ...prev, num_passengers: parseInt(e.target.value) }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  min="1"
                  value={bookingDetails.amount}
                  onChange={(e) => setBookingDetails(prev => ({ ...prev, amount: parseInt(e.target.value) }))}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleBookingCancel}>
                Cancel
              </Button>
              <Button onClick={handleBookingSubmit}>
                Create Booking
              </Button>
          </div>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Payment Dialog */}
      {currentBooking && (
        <PaymentDialog
          isOpen={showPaymentDialog}
          onClose={handlePaymentCancel}
          bookingId={currentBooking.id}
          amount={currentBooking.amount}
          onSuccess={handlePaymentSuccess}
        />
      )}
      
      <Footer />
    </div>
  );
};

const HelicopterCard = ({ helicopter, onBook }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <div className="md:flex">
        <div className="md:w-1/3 h-48 md:h-auto relative">
          <img 
            src={helicopter.image_url} 
            alt={helicopter.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2">
            <AvailabilityBadge availability={helicopter.availability} />
          </div>
        </div>
        <div className="md:w-2/3">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl font-bold">{helicopter.name}</CardTitle>
                <CardDescription>{helicopter.shortDescription}</CardDescription>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-dejair-700">${helicopter.hourlyRate}</div>
                <div className="text-sm text-gray-500">per hour</div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              <div className="flex items-center">
                <Users className="h-4 w-4 text-dejair-600 mr-2" />
                <span className="text-sm">{helicopter.capacity} passengers</span>
              </div>
              <div className="flex items-center">
                <Compass className="h-4 w-4 text-dejair-600 mr-2" />
                <span className="text-sm">{helicopter.speed}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-dejair-600 mr-2" />
                <span className="text-sm">{helicopter.range}</span>
              </div>
            </div>
            
            <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
              <CollapsibleTrigger className="flex items-center text-dejair-600 text-sm font-medium hover:text-dejair-800">
                {isExpanded ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-1" />
                    Show less
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-1" />
                    Show more details
                  </>
                )}
              </CollapsibleTrigger>
              
              <CollapsibleContent className="mt-4 space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm text-gray-600">{helicopter.description}</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Features</h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {helicopter.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <Check className="h-4 w-4 text-dejair-600 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Available Tours</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {helicopter.tours.map((tour) => (
                      <div key={tour.id} className="bg-gray-50 p-3 rounded-md">
                        <div className="font-medium">{tour.name}</div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">{tour.duration} hours</span>
                          <span className="font-medium">${tour.price}</span>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-2 w-full text-dejair-600 border-dejair-300 hover:bg-dejair-50"
                          onClick={() => onBook(helicopter, tour)}
                        >
                          Book This Tour
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
          
          <CardFooter>
            <Button 
              className="w-full bg-dejair-600 hover:bg-dejair-700"
              onClick={() => onBook(helicopter)}
            >
              Book This Helicopter
            </Button>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
};

const TourCard = ({ helicopter, tour, onBook }) => {
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <div className="md:flex">
        <div className="md:w-1/3 h-48 md:h-auto relative">
          <img 
            src={helicopter.image} 
            alt={helicopter.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2">
            <AvailabilityBadge availability={helicopter.availability} />
          </div>
        </div>
        <div className="md:w-2/3">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl font-bold">{tour.name}</CardTitle>
                <CardDescription>on {helicopter.name}</CardDescription>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-dejair-700">${tour.price}</div>
                <div className="text-sm text-gray-500">per booking</div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-dejair-600 mr-2" />
                <span className="text-sm">{tour.duration} hours</span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 text-dejair-600 mr-2" />
                <span className="text-sm">Up to {helicopter.capacity} passengers</span>
              </div>
              <div className="flex items-center">
                <Plane className="h-4 w-4 text-dejair-600 mr-2" />
                <span className="text-sm">{helicopter.name}</span>
              </div>
            </div>
          </CardContent>
          
          <CardFooter>
            <Button 
              className="w-full bg-dejair-600 hover:bg-dejair-700"
              onClick={() => onBook(helicopter, tour)}
            >
              Book This Tour
            </Button>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
};

const AvailabilityBadge = ({ availability }) => {
  let bgColor;
  
  switch(availability.toLowerCase()) {
    case 'high':
      bgColor = 'bg-green-500';
      break;
    case 'medium':
      bgColor = 'bg-yellow-500';
      break;
    case 'low':
      bgColor = 'bg-red-500';
      break;
    default:
      bgColor = 'bg-gray-500';
  }
  
  return (
    <Badge className={`${bgColor}`}>
      {availability} Availability
    </Badge>
  );
};

export default Helicopters;
