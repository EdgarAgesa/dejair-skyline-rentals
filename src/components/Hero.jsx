
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Background image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1643913224222-17cc6adb2dfc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fG5haXJvYmklMjBjaXR5fGVufDB8fDB8fHww')",
          backgroundPosition: "center 30%"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 py-24 md:py-32 lg:py-40 container-padding max-w-7xl mx-auto">
        <div className="max-w-3xl">
          <h1 className="heading-lg text-white mb-6 animate-fade-in">
            Experience the World from Above
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 animate-slide-up" style={{animationDelay: "200ms"}}>
            Premium helicopter rental services for tours, events, and business travel. 
            Elevate your journey with Dejair Charters's luxury fleet.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{animationDelay: "400ms"}}>
            <Link to="/helicopters">
              <Button size="lg" className="bg-dejair-600 hover:bg-dejair-700 text-white px-8 py-6">
                Book a Helicopter
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/contact-admin">
              <Button variant="outline" size="lg" className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-white/30 px-8 py-6">
                Request Custom Quote
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
