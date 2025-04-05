
import React from 'react';
import { Plane, Calendar, Building2, Map, Gift, Camera } from 'lucide-react';

const serviceItems = [
  {
    icon: <Plane className="h-12 w-12 text-dejair-600" />,
    title: 'Aerial Tours',
    description: 'Experience breathtaking panoramic views of stunning landscapes, city skylines, and natural wonders.'
  },
  {
    icon: <Calendar className="h-12 w-12 text-dejair-600" />,
    title: 'Special Events',
    description: 'Make your wedding, anniversary, or special occasion truly unforgettable with a helicopter experience.'
  },
  {
    icon: <Building2 className="h-12 w-12 text-dejair-600" />,
    title: 'Corporate Travel',
    description: 'Efficient transportation for executives and business clients, optimizing your valuable time.'
  },
  {
    icon: <Map className="h-12 w-12 text-dejair-600" />,
    title: 'Custom Routes',
    description: 'Design your own journey with flexible routes and destinations tailored to your preferences.'
  },
  {
    icon: <Gift className="h-12 w-12 text-dejair-600" />,
    title: 'Gift Experiences',
    description: 'Give an unforgettable gift of flight to someone special with our gift certificates.'
  },
  {
    icon: <Camera className="h-12 w-12 text-dejair-600" />,
    title: 'Aerial Photography',
    description: 'Professional aerial photography and videography services for events, real estate, and productions.'
  }
];

const Services = () => {
  return (
    <section className="py-20 container-padding">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="heading-md text-dejair-900 mb-4">Our Premium Services</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Dejair Skyline offers exceptional helicopter experiences tailored to your needs. 
            From breathtaking tours to efficient business travel, we elevate every journey.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {serviceItems.map((service, index) => (
            <div 
              key={index} 
              className="glass-card p-8 flex flex-col items-center text-center hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="mb-6">{service.icon}</div>
              <h3 className="text-xl font-bold mb-3 text-dejair-800">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
