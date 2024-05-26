import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface ServiceProvider {
  name: string;
  pincode: string;
  services: string;
  shopAddress: string;
}

export function ServiceProviderCard() {
  const [serviceProviders, setServiceProviders] = useState<ServiceProvider[]>([]);
  const [, setSelectedShopIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    fetch('http://localhost:3000/api/service-providers')
      .then(response => response.json())
      .then((data: ServiceProvider[]) => setServiceProviders(data))
      .catch(error => console.error('Error fetching service providers:', error));
  }, []);

  const handleClick = (index: number) => {
    setSelectedShopIndex(index);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredProviders = serviceProviders.filter(provider =>
    provider.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ marginTop: '100px', padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search shops..."
          value={searchQuery}
          onChange={handleSearch}
          className="px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
        />
      </div>
      {filteredProviders.map((provider, index) => (
        <div key={index} className="card" style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', cursor: 'pointer' }} onClick={() => handleClick(index)}>
          <h2>{provider.name}</h2>
          <p>Pincode: {provider.pincode}</p>
          <p>Services: {provider.services}</p>
          <p>Address: {provider.shopAddress}</p>
          <Link to={`/shop/${index}`} style={{ textDecoration: 'none' }}>
            <button className='text-blue-700'>View</button>
          </Link>
        </div>
      ))}
    </div>
  );
}

export default ServiceProviderCard;
