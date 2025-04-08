
import React from 'react';

const destinations = [
  {
    id: 1,
    name: 'Maasai Mara',
    image: 'https://images.unsplash.com/photo-1517846875602-2371528547d4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWFhc2FpJTIwbWFyYXxlbnwwfHwwfHx8MA%3D%3D',
    description: 'Float above the sweeping plains of the Maasai Mara, where nature’s grandeur unfolds beneath you.'
  },
  {
    id: 2,
    name: 'Naivasha',
    image: 'https://images.pexels.com/photos/9609129/pexels-photo-9609129.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Where world-class rally meets Kenyan grit — WRC Naivasha is an electrifying celebration of motorsport in the heart of the wild.'
  },
  {
    id: 3,
    name: 'Coastal region',
    image: 'https://images.pexels.com/photos/1835718/pexels-photo-1835718.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Unwind on the sun-kissed shores of Diani and Mombasa, where turquoise waters meet pure coastal bliss.'
  },
  {
    id: 4,
    name: 'Zanzibar',
    image: 'https://images.unsplash.com/photo-1621583628955-42fbc37bf424?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8emFuemliYXJ8ZW58MHx8MHx8fDA%3D',
    description: 'Immerse yourself in a breathtaking island where every moment is rich with life and discovery.'
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
