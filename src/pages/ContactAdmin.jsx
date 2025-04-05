
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Helicopter, Calendar, Clock, MapPin, User, Wallet } from 'lucide-react';

const ContactAdmin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    helicopter: location.state?.helicopter?.name || '',
    date: '',
    time: '',
    location: '',
    requestedPrice: location.state?.helicopter?.pricePerHour ? (location.state.helicopter.pricePerHour * 0.8).toFixed(0) : '', // Default to 20% off
    standardPrice: location.state?.helicopter?.pricePerHour || '',
    message: ''
  });

  useEffect(() => {
    // Check if user is logged in
    const userLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(userLoggedIn);
    
    // If logged in, pre-fill user information
    if (userLoggedIn) {
      const userEmail = localStorage.getItem('userEmail');
      setFormData(prev => ({
        ...prev,
        name: "John Doe", // In a real app, this would be fetched from your backend
        email: userEmail,
        phone: "+1 555-123-4567" // In a real app, this would be fetched from your backend
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if user is logged in
    if (!isLoggedIn) {
      toast({
        title: "Login required",
        description: "Please sign in to submit a custom pricing request.",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }
    
    // Validate form
    const requiredFields = ['name', 'email', 'phone', 'helicopter', 'date', 'time', 'location', 'requestedPrice', 'message'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    // In a real app, this would send the request to your backend
    setTimeout(() => {
      toast({
        title: "Request submitted",
        description: "Your custom pricing request has been sent to our team. We'll respond shortly.",
      });
      
      navigate('/user-dashboard');
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="py-16 container-padding bg-gray-50 flex-grow">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="heading-md text-dejair-900 mb-4">Request Custom Pricing</h1>
            <p className="text-lg text-gray-600">
              Let us know your budget and requirements, and our team will work with you to create a custom package.
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-dejair-600" />
                Custom Pricing Request
              </CardTitle>
              <CardDescription>
                Fill out the form below with your details and requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-dejair-800 flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Your Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={isLoggedIn}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={isLoggedIn}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={isLoggedIn}
                    />
                  </div>
                </div>
                
                {/* Flight Details */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-dejair-800 flex items-center">
                    <Helicopter className="h-4 w-4 mr-2" />
                    Flight Details
                  </h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="helicopter">Helicopter Model</Label>
                    <Input
                      id="helicopter"
                      name="helicopter"
                      value={formData.helicopter}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Preferred Date</Label>
                      <Input
                        id="date"
                        name="date"
                        type="date"
                        value={formData.date}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Preferred Time</Label>
                      <Input
                        id="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        placeholder="e.g. 10:00 AM - 12:00 PM"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Location/Route</Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g. Grand Canyon Tour, NYC to Hamptons, etc."
                    />
                  </div>
                </div>
                
                {/* Pricing Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-dejair-800 flex items-center">
                    <Wallet className="h-4 w-4 mr-2" />
                    Pricing Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="standardPrice">Standard Price (per hour)</Label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                        <Input
                          id="standardPrice"
                          name="standardPrice"
                          value={formData.standardPrice}
                          onChange={handleChange}
                          className="pl-8"
                          readOnly
                        />
                      </div>
                      {formData.standardPrice && (
                        <p className="text-xs text-gray-500 mt-1">This is our standard hourly rate for the selected helicopter.</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="requestedPrice">Your Requested Price (per hour)</Label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                        <Input
                          id="requestedPrice"
                          name="requestedPrice"
                          value={formData.requestedPrice}
                          onChange={handleChange}
                          className="pl-8"
                        />
                      </div>
                      {formData.standardPrice && formData.requestedPrice && (
                        <p className="text-xs text-gray-500 mt-1">
                          This is {((1 - formData.requestedPrice / formData.standardPrice) * 100).toFixed(1)}% off our standard rate.
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Additional Details</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Please provide any additional details about your request, such as special requirements, number of passengers, or why you're requesting a custom price."
                      rows={5}
                    />
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full bg-dejair-600 hover:bg-dejair-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Submitting Request..." : "Submit Custom Price Request"}
                  </Button>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col text-center text-sm text-gray-500">
              <p>Our team typically responds to custom pricing requests within 24 hours.</p>
              {!isLoggedIn && (
                <p className="mt-2">
                  Already have an account?{" "}
                  <Link to="/login" className="text-dejair-600 hover:underline">
                    Log in
                  </Link>{" "}
                  to complete your request.
                </p>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ContactAdmin;
