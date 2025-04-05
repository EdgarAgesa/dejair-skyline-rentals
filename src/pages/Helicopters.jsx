
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CalendarRange, Clock, Users, MapPin, Compass, Info, ChevronDown, ChevronUp, Check } from 'lucide-react';
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

// Sample helicopter data
const helicopters = [
  {
    id: 1,
    name: "Bell 407GXi",
    image: "https://images.unsplash.com/photo-1608236467814-a74be259b612?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2671&q=80",
    shortDescription: "Luxury executive helicopter with premium comfort",
    description: "The Bell 407GXi is the latest upgrade to the best-selling Bell 407 series, featuring the Garmin G1000H NXi Flight Deck and new Rolls-Royce M250-C47E/4 engine with dual channel FADEC.",
    capacity: 6,
    speed: "140 knots",
    range: "330 nautical miles",
    hourlyRate: 1500,
    features: ["Leather interior", "Air conditioning", "Noise cancellation", "Panoramic windows", "Entertainment system"],
    tours: [
      { id: 101, name: "Grand Canyon Explorer", duration: 3, price: 3500 },
      { id: 102, name: "City Skyline Tour", duration: 1, price: 1800 },
      { id: 103, name: "Mountain Adventure", duration: 2, price: 2600 }
    ],
    availability: "High"
  },
  {
    id: 2,
    name: "Airbus H130",
    image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2674&q=80",
    shortDescription: "Spacious and quiet helicopter for sightseeing",
    description: "The Airbus H130 (formerly EC130) is a light single-engine helicopter including all the latest technology and a roomy, modular cabin that can accommodate up to 7 passengers.",
    capacity: 7,
    speed: "150 knots",
    range: "350 nautical miles",
    hourlyRate: 1800,
    features: ["Spacious cabin", "Low noise levels", "Excellent visibility", "Advanced avionics", "Energy-absorbing seats"],
    tours: [
      { id: 201, name: "Coastal Paradise Tour", duration: 2, price: 2800 },
      { id: 202, name: "Sunset Experience", duration: 1.5, price: 2200 },
      { id: 203, name: "Island Hopping Adventure", duration: 4, price: 4500 }
    ],
    availability: "Medium"
  },
  {
    id: 3,
    name: "Robinson R66",
    image: "https://images.unsplash.com/photo-1588331346622-b88447fbf2b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2671&q=80",
    shortDescription: "Reliable and efficient turbine helicopter",
    description: "The Robinson R66 Turbine helicopter is a 5-seat turbine helicopter powered by the Rolls Royce RR300 turboshaft engine. It offers improved altitude performance and increased capacity.",
    capacity: 5,
    speed: "120 knots",
    range: "300 nautical miles",
    hourlyRate: 1200,
    features: ["Turbine reliability", "Large baggage compartment", "Cruise control", "Hydraulic controls", "Low operating costs"],
    tours: [
      { id: 301, name: "City Landmarks Tour", duration: 1, price: 1400 },
      { id: 302, name: "Countryside Experience", duration: 2, price: 2200 },
      { id: 303, name: "Photography Special", duration: 1.5, price: 1800 }
    ],
    availability: "High"
  },
  {
    id: 4,
    name: "Sikorsky S-76D",
    image: "https://images.unsplash.com/photo-1555658056-84031809d7bb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80",
    shortDescription: "VIP executive transport with superior comfort",
    description: "The Sikorsky S-76D helicopter delivers the safety, reliability and efficiency that operators have come to expect from the S-76 family of aircraft, while providing enhanced capabilities.",
    capacity: 12,
    speed: "155 knots",
    range: "400 nautical miles",
    hourlyRate: 2500,
    features: ["VIP configuration", "Quiet cabin technology", "Enhanced avionics", "Powerful engines", "Long range capabilities"],
    tours: [
      { id: 401, name: "Executive City Tour", duration: 1, price: 2800 },
      { id: 402, name: "Luxury Wine Country Experience", duration: 4, price: 6500 },
      { id: 403, name: "VIP Airport Transfer", duration: 0.5, price: 1500 }
    ],
    availability: "Low"
  }
];

const Helicopters = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [selectedPassengers, setSelectedPassengers] = useState(null);
  const [selectedHelicopter, setSelectedHelicopter] = useState(null);
  const [selectedTour, setSelectedTour] = useState(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);
  const [filteredHelicopters, setFilteredHelicopters] = useState(helicopters);
  const [filters, setFilters] = useState({
    capacity: [],
    maxPrice: 5000,
    availability: []
  });
  const { toast } = useToast();

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
  }, [filters]);

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

  const handleBooking = (helicopter, tour = null) => {
    // In a real app, this would navigate to a booking confirmation page
    // or open a booking dialog
    
    if (!localStorage.getItem('isLoggedIn')) {
      toast({
        title: "Login required",
        description: "Please log in to book a helicopter.",
      });
      return;
    }
    
    setSelectedHelicopter(helicopter);
    setSelectedTour(tour);
    
    toast({
      title: "Booking initiated",
      description: `You've selected the ${helicopter.name}${tour ? ` for the ${tour.name}` : ''}. Please complete your booking.`,
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
                  
                  {/* Price Range */}
                  <div>
                    <h3 className="font-medium mb-2">Max Hourly Rate</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">$0</span>
                      <span className="text-sm">${filters.maxPrice}</span>
                    </div>
                    <input
                      type="range"
                      min="500"
                      max="5000"
                      step="100"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({...filters, maxPrice: parseInt(e.target.value)})}
                      className="w-full"
                    />
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
                  {filteredHelicopters.length === 0 ? (
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
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
      
      {/* Booking Section */}
      {selectedHelicopter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Complete Your Booking</h2>
                <button 
                  onClick={() => {
                    setSelectedHelicopter(null);
                    setSelectedTour(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium mb-2">Selected Helicopter</h3>
                <div className="flex items-center space-x-3">
                  <img 
                    src={selectedHelicopter.image} 
                    alt={selectedHelicopter.name} 
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div>
                    <p className="font-medium">{selectedHelicopter.name}</p>
                    <p className="text-sm text-gray-500">
                      {selectedTour ? selectedTour.name : 'Custom Booking'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Select Date</label>
                  <Select onValueChange={setSelectedDate}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2025-05-10">May 10, 2025</SelectItem>
                      <SelectItem value="2025-05-11">May 11, 2025</SelectItem>
                      <SelectItem value="2025-05-12">May 12, 2025</SelectItem>
                      <SelectItem value="2025-05-13">May 13, 2025</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Select Time</label>
                  <Select onValueChange={setSelectedTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="9:00 AM">9:00 AM</SelectItem>
                      <SelectItem value="11:00 AM">11:00 AM</SelectItem>
                      <SelectItem value="1:00 PM">1:00 PM</SelectItem>
                      <SelectItem value="3:00 PM">3:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {!selectedTour && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Duration (hours)</label>
                    <Select onValueChange={setSelectedDuration}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 hour</SelectItem>
                        <SelectItem value="2">2 hours</SelectItem>
                        <SelectItem value="3">3 hours</SelectItem>
                        <SelectItem value="4">4 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium mb-1">Number of Passengers</label>
                  <Select onValueChange={setSelectedPassengers}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select passengers" />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(selectedHelicopter.capacity)].map((_, i) => (
                        <SelectItem key={i} value={String(i+1)}>{i+1} {i === 0 ? 'passenger' : 'passengers'}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between mb-2">
                  <span>Base Price</span>
                  <span>${selectedTour ? selectedTour.price : selectedHelicopter.hourlyRate}/flight</span>
                </div>
                {!selectedTour && selectedDuration && (
                  <div className="flex justify-between mb-2">
                    <span>Duration Adjustment</span>
                    <span>x{selectedDuration} hours</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t">
                  <span>Total</span>
                  <span>${selectedTour 
                    ? selectedTour.price 
                    : selectedDuration 
                      ? selectedHelicopter.hourlyRate * parseInt(selectedDuration)
                      : selectedHelicopter.hourlyRate
                  }</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <Link to="/contact-admin" className="text-dejair-600 text-sm hover:underline">
                  Request custom pricing
                </Link>
                <Button 
                  className="bg-dejair-600 hover:bg-dejair-700"
                  onClick={() => {
                    if (!selectedDate || !selectedTime || (!selectedTour && !selectedDuration) || !selectedPassengers) {
                      toast({
                        title: "Missing information",
                        description: "Please fill in all required fields",
                        variant: "destructive"
                      });
                      return;
                    }
                    
                    toast({
                      title: "Booking Confirmed!",
                      description: "Your helicopter has been booked successfully."
                    });
                    
                    setSelectedHelicopter(null);
                    setSelectedTour(null);
                  }}
                >
                  Confirm Booking
                </Button>
              </div>
            </div>
          </div>
        </div>
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
                <Helicopter className="h-4 w-4 text-dejair-600 mr-2" />
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
