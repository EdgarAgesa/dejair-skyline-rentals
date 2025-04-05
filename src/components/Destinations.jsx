
import React from 'react';

const destinations = [
  {
    id: 1,
    name: 'Grand Canyon',
    image: 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2631&q=80',
    description: 'Experience the majesty of one of the world's natural wonders from above.'
  },
  {
    id: 2,
    name: 'Manhattan Skyline',
    image: 'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    description: 'Soar over the iconic skyscrapers and landmarks of New York City.'
  },
  {
    id: 3,
    name: 'Hawaiian Islands',
    image: 'https://images.unsplash.com/photo-1542259009477-d625272157b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80',
    description: 'Discover paradise from the air, including remote waterfalls and volcanic landscapes.'
  },
  {
    id: 4,
    name: 'Niagara Falls',
    image: 'https://images.unsplash.com/photo-1489447068241-b3490214e879?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    description: 'View the magnificent falls from a unique aerial perspective.'
  }
];

const Destinations = () => {
  return (
    <section className="py-20 sky-gradient">
      <div className="container-padding max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="heading-md mb-4">Popular Destinations</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Discover some of our most requested helicopter tour destinations. 
            Each location offers a unique perspective that can only be appreciated from the air.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {destinations.map((destination) => (
            <div key={destination.id} className="rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div className="h-64 overflow-hidden">
                <img 
                  src={destination.image} 
                  alt={destination.name} 
                  className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="p-6 bg-white">
                <h3 className="text-xl font-bold mb-2 text-dejair-800">{destination.name}</h3>
                <p className="text-gray-600">{destination.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Destinations;
