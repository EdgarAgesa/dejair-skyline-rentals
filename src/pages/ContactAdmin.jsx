
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Send, MessageSquare, Info, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ContactAdmin = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [helicopter, setHelicopter] = useState('');
  const [budget, setBudget] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Get user data from localStorage if available
  React.useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      setEmail(userEmail);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!name || !email || !subject || !message) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    // Submit form (mock submission)
    setIsSubmitting(true);
    
    setTimeout(() => {
      toast({
        title: "Message sent!",
        description: "An administrator will contact you shortly.",
      });
      
      // Reset form
      setSubject('');
      setMessage('');
      setHelicopter('');
      setBudget('');
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="bg-dejair-600 text-white py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Contact Administration</h1>
          <p className="text-dejair-100">Request custom pricing or get in touch with our team</p>
        </div>
      </div>
      
      <div className="flex-grow bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Get in Touch</CardTitle>
                  <CardDescription>
                    Fill out the form below and an administrator will respond to your inquiry shortly.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject *</Label>
                        <Select
                          value={subject}
                          onValueChange={setSubject}
                          required
                        >
                          <SelectTrigger id="subject">
                            <SelectValue placeholder="Select a subject" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Custom Pricing">Request Custom Pricing</SelectItem>
                            <SelectItem value="Booking Question">Booking Question</SelectItem>
                            <SelectItem value="Corporate Event">Corporate Event</SelectItem>
                            <SelectItem value="Special Occasion">Special Occasion</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    {subject === 'Custom Pricing' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="helicopter">Preferred Helicopter</Label>
                          <Select
                            value={helicopter}
                            onValueChange={setHelicopter}
                          >
                            <SelectTrigger id="helicopter">
                              <SelectValue placeholder="Select a helicopter" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Bell 407GXi">Bell 407GXi</SelectItem>
                              <SelectItem value="Airbus H130">Airbus H130</SelectItem>
                              <SelectItem value="Robinson R66">Robinson R66</SelectItem>
                              <SelectItem value="Sikorsky S-76D">Sikorsky S-76D</SelectItem>
                              <SelectItem value="Not Sure">Not Sure</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="budget">Your Budget</Label>
                          <Select
                            value={budget}
                            onValueChange={setBudget}
                          >
                            <SelectTrigger id="budget">
                              <SelectValue placeholder="Select your budget" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="<1000">Less than $1,000</SelectItem>
                              <SelectItem value="1000-2000">$1,000 - $2,000</SelectItem>
                              <SelectItem value="2000-5000">$2,000 - $5,000</SelectItem>
                              <SelectItem value=">5000">More than $5,000</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        rows={6}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Please provide details about your inquiry..."
                        required
                      />
                    </div>
                    
                    <Button type="submit" className="bg-dejair-600 hover:bg-dejair-700 w-full" disabled={isSubmitting}>
                      {isSubmitting ? "Sending..." : "Send Message"}
                      <Send className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
            
            {/* Sidebar */}
            <div>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="mr-2 h-5 w-5 text-dejair-600" />
                    Why Contact an Admin?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm">
                    <li className="flex">
                      <span className="text-dejair-600 mr-2">•</span>
                      <span>Request custom pricing for special occasions</span>
                    </li>
                    <li className="flex">
                      <span className="text-dejair-600 mr-2">•</span>
                      <span>Arrange corporate events or group bookings</span>
                    </li>
                    <li className="flex">
                      <span className="text-dejair-600 mr-2">•</span>
                      <span>Inquire about helicopter availability</span>
                    </li>
                    <li className="flex">
                      <span className="text-dejair-600 mr-2">•</span>
                      <span>Discuss specialized routes or destinations</span>
                    </li>
                    <li className="flex">
                      <span className="text-dejair-600 mr-2">•</span>
                      <span>Request accommodations for special needs</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Info className="mr-2 h-5 w-5 text-dejair-600" />
                    Response Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Our administrators typically respond within 24 hours during business days. For urgent inquiries, please call our customer service line.
                  </p>
                  <div className="font-medium">+1 (800) DEJAIR-1</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Browse Helicopters</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Not sure what helicopter to request? View our fleet to find the perfect aircraft for your needs.
                  </p>
                  <Link to="/helicopters">
                    <Button variant="outline" className="w-full">
                      View Fleet
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
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

export default ContactAdmin;
