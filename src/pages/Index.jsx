
import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Destinations from '../components/Destinations';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Award, Clock } from 'lucide-react';

const Index = () => {
  // Stats for the stats section
  const stats = [
    { value: '10,000+', label: 'Flight Hours' },
    { value: '500+', label: 'Premium Clients' },
    { value: '50+', label: 'Locations' },
    { value: '99.8%', label: 'Safety Rating' }
  ];

  // Testimonials
  const testimonials = [
    {
      quote: "My family and I had the most incredible experience with Dejair Skyline. The views were breathtaking, and the pilot was both professional and knowledgeable.",
      author: "Michael Thompson",
      role: "Family Tour"
    },
    {
      quote: "As a business executive, time is my most valuable asset. Dejair Skyline has revolutionized my travel between meetings and events.",
      author: "Syphy Auma",
      role: "Business Executive."
    },
    {
      quote: "Our wedding proposal helicopter tour was beyond perfect. The staff went above and beyond to make our special moment unforgettable.",
      author: "James & Emily Rodriguez",
      role: "Engagement Tour"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      
      {/* Why Choose Us */}
      <section className="py-20 container-padding">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="heading-md text-dejair-900 mb-4">Why Choose Dejair Charters?</h2>
              <p className="text-lg text-gray-600 mb-6">
                With years of experience, a commitment to safety, and a passion for excellence, 
                we deliver helicopter experiences that exceed expectations.
              </p>
              
              <div className="space-y-6 mt-8">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Shield className="h-6 w-6 text-dejair-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Safety First</h3>
                    <p className="mt-2 text-gray-600">
                      Our rigorous maintenance protocols and experienced pilots ensure the highest safety standards.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Award className="h-6 w-6 text-dejair-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Luxury Experience</h3>
                    <p className="mt-2 text-gray-600">
                      Premium helicopters with comfortable interiors and panoramic views for an unforgettable journey.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Clock className="h-6 w-6 text-dejair-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Flexibility</h3>
                    <p className="mt-2 text-gray-600">
                      Customizable routes, schedules, and experiences tailored to your specific needs.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <Link to="/helicopters">
                  <Button className="bg-dejair-600 hover:bg-dejair-700">
                    Explore Our Fleet
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1565652536652-b0f36077f6cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80" 
                alt="Luxury Helicopter" 
                className="rounded-xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-lg shadow-xl p-4 max-w-xs">
                <div className="flex items-center">
                  <div className="bg-green-500 rounded-full h-3 w-3 mr-2"></div>
                  <div className="text-sm font-medium">Available Now</div>
                </div>
                <div className="mt-2 font-bold">Instant Booking Available</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Services />
      <Destinations />
      
      {/* Stats Section */}
      <section className="py-20 hero-gradient text-white">
        <div className="container-padding max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="heading-md mb-4">By the Numbers</h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Our track record speaks for itself. We're proud of what we've accomplished 
              and the experiences we've provided to our clients.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-20 container-padding bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="heading-md text-dejair-900 mb-4">What Our Clients Say</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it. Hear from clients who have experienced 
              the Dejair Charters difference.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="glass-card p-8">
                <div className="text-4xl text-dejair-300 mb-4">"</div>
                <p className="text-gray-600 italic mb-6">{testimonial.quote}</p>
                <div>
                  <div className="font-bold text-dejair-800">{testimonial.author}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 container-padding bg-dejair-800 text-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="heading-md mb-6">Ready to Experience the Sky?</h2>
          <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
            Book your helicopter experience today and discover the world from a new perspective. 
            Our team is ready to create an unforgettable journey for you.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/helicopters">
              <Button size="lg" className="bg-white text-dejair-800 hover:bg-gray-100 px-8">
                Book Now
              </Button>
            </Link>
            <Link to="/contact-admin">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10 px-8">
                Request Quote
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
