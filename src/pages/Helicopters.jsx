
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, Maximize2, Shield, Star } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

// Sample helicopter data
const helicoptersData = [
  {
    id: 1,
    name: "Robinson R44",
    image: "https://images.unsplash.com/photo-1608736517487-ab31a1b4d399?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    description: "Perfect for city tours and short distance flights. The R44 offers excellent visibility for sightseeing.",
    capacity: 3,
    range: "300 miles",
    speed: "130 mph",
    pricePerHour: 795,
    features: ["Air Conditioning", "Leather Seats", "Noise-Canceling Headsets"],
    rating: 4.7,
    reviews: 56,
    available: true
  },
  {
    id: 2,
    name: "Bell 407",
    image: "https://images.unsplash.com/photo-1450121376544-1a32310d2c9e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    description: "A versatile aircraft ideal for corporate travel, tourism, and VIP transport with spacious cabin.",
    capacity: 6,
    range: "430 miles",
    speed: "160 mph",
    pricePerHour: 1495,
    features: ["VIP Interior", "Enhanced Sound System", "Extended Luggage Space", "Refreshment Center"],
    rating: 4.9,
    reviews: 78,
    available: true
  },
  {
    id: 3,
    name: "Airbus H125",
    image: "https://images.unsplash.com/photo-1468941945141-027a5d6b444a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    description: "High-performance helicopter with exceptional maneuverability, perfect for aerial photography and tours.",
    capacity: 5,
    range: "370 miles",
    speed: "155 mph",
    pricePerHour: 1695,
    features: ["Panoramic Windows", "Premium Audio", "Camera Mounts", "Enhanced Air Conditioning"],
    rating: 4.8,
    reviews: 42,
    available: false
  },
  {
    id: 4,
    name: "Sikorsky S-76",
    image: "https://images.unsplash.com/photo-1565708097881-9ded21dfa1e6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    description: "Luxury executive helicopter with a spacious cabin, ideal for corporate and VIP transport.",
    capacity: 8,
    range: "500 miles",
    speed: "178 mph",
    pricePerHour: 3295,
    features: ["Executive Seating", "Conference Configuration", "Full Entertainment System", "Gourmet Refreshment Center", "Private Lavatory"],
    rating: 5.0,
    reviews: 34,
    available: true
  }
];

const Helicopters = () => {
  const [helicopters, setHelicopters] = useState(helicoptersData);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleBook = (helicopter) => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
      toast({
        title: "Login required",
        description: "Please sign in to book a helicopter.",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }
    
    // In a real app, this would navigate to a booking page
    // or open a booking modal with the selected helicopter
    toast({
      title: "Booking initiated",
      description: `You've selected the ${helicopter.name}. Redirecting to booking page.`,
    });
    
    // For this demo, we'll just navigate to the user dashboard
    navigate('/user-dashboard');
  };

  const handleContactAdmin = (helicopter) => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
      toast({
        title: "Login required",
        description: "Please sign in to contact admin for custom pricing.",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }
    
    // For this demo, we'll navigate to the contact admin page
    navigate('/contact-admin', { state: { helicopter } });
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    
    if (newFilter === 'all') {
      setHelicopters(helicoptersData);
    } else if (newFilter === 'available') {
      setHelicopters(helicoptersData.filter(h => h.available));
    } else if (newFilter === 'luxury') {
      setHelicopters(helicoptersData.filter(h => h.pricePerHour > 1500));
    } else if (newFilter === 'economy') {
      setHelicopters(helicoptersData.filter(h => h.pricePerHour <= 1500));
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="bg-dejair-800 text-white py-20">
        <div className="container-padding max-w-7xl mx-auto text-center">
          <h1 className="heading-lg mb-6">Our Helicopter Fleet</h1>
          <p className="text-lg text-white/80 max-w-3xl mx-auto">
            Explore our premium selection of helicopters available for rent. 
            From intimate tours to executive transport, we have the perfect aircraft for your needs.
          </p>
        </div>
      </div>
      
      <div className="py-12 container-padding max-w-7xl mx-auto">
        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-3">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => handleFilterChange('all')}
            className={filter === 'all' ? 'bg-dejair-600 hover:bg-dejair-700' : ''}
          >
            All Helicopters
          </Button>
          <Button
            variant={filter === 'available' ? 'default' : 'outline'}
            onClick={() => handleFilterChange('available')}
            className={filter === 'available' ? 'bg-dejair-600 hover:bg-dejair-700' : ''}
          >
            Available Now
          </Button>
          <Button
            variant={filter === 'luxury' ? 'default' : 'outline'}
            onClick={() => handleFilterChange('luxury')}
            className={filter === 'luxury' ? 'bg-dejair-600 hover:bg-dejair-700' : ''}
          >
            Luxury
          </Button>
          <Button
            variant={filter === 'economy' ? 'default' : 'outline'}
            onClick={() => handleFilterChange('economy')}
            className={filter === 'economy' ? 'bg-dejair-600 hover:bg-dejair-700' : ''}
          >
            Economy
          </Button>
        </div>
        
        {/* Helicopter listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {helicopters.map((helicopter) => (
            <Card key={helicopter.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="h-64 overflow-hidden">
                <img 
                  src={helicopter.image} 
                  alt={helicopter.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl text-dejair-900">{helicopter.name}</CardTitle>
                    <CardDescription className="text-gray-600 mt-2">{helicopter.description}</CardDescription>
                  </div>
                  {helicopter.available ? (
                    <Badge className="bg-green-500">Available</Badge>
                  ) : (
                    <Badge variant="outline" className="text-red-500 border-red-500">Booked</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex flex-col items-center">
                    <Users className="h-5 w-5 text-dejair-600 mb-1" />
                    <div className="text-sm text-gray-500">Capacity</div>
                    <div className="font-semibold">{helicopter.capacity} passengers</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <Maximize2 className="h-5 w-5 text-dejair-600 mb-1" />
                    <div className="text-sm text-gray-500">Range</div>
                    <div className="font-semibold">{helicopter.range}</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <Clock className="h-5 w-5 text-dejair-600 mb-1" />
                    <div className="text-sm text-gray-500">Speed</div>
                    <div className="font-semibold">{helicopter.speed}</div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="font-semibold mb-2">Features:</div>
                  <div className="flex flex-wrap gap-2">
                    {helicopter.features.map((feature, index) => (
                      <Badge key={index} variant="outline" className="border-dejair-200 text-dejair-800">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center mb-4">
                  <div className="flex items-center text-yellow-500 mr-2">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="ml-1 font-semibold">{helicopter.rating}</span>
                  </div>
                  <div className="text-sm text-gray-500">({helicopter.reviews} reviews)</div>
                </div>
                
                <div className="text-2xl font-bold text-dejair-800 mb-2">
                  ${helicopter.pricePerHour} <span className="text-sm font-normal text-gray-500">per hour</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-500">
                  <Shield className="h-4 w-4 mr-1 text-green-500" />
                  <span>Fully insured and maintained</span>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-3">
                <Button 
                  className="w-full sm:w-auto bg-dejair-600 hover:bg-dejair-700"
                  disabled={!helicopter.available}
                  onClick={() => handleBook(helicopter)}
                >
                  {helicopter.available ? "Book Now" : "Currently Unavailable"}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full sm:w-auto"
                  onClick={() => handleContactAdmin(helicopter)}
                >
                  Request Custom Price
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Helicopters;
