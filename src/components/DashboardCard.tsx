import React, { ReactNode, useEffect, useState } from 'react';
import { Map, Marker } from 'pigeon-maps';
import axios from 'axios';

interface ServiceProvider {
  name: string;
  shopAddress: string;
  pincode: string;
}
// qgUY6gv28i43SoXHU7Lzlp2Z8UxzeaLj5HpfOQCnC8d3flC2jifPVro5PLpknvn8GZ1Fo-eYEkqCXziemsxfCw
interface Coordinate {
  name: ReactNode;
  latitude: number;
  longitude: number;
}

interface DashboardCardProps {
  userData: {
    firstName: string;
    userType: string;
    serviceProviders: ServiceProvider[];
  };
}

const DashboardCard: React.FC<DashboardCardProps> = ({ userData }) => {
  const [coordinates, setCoordinates] = useState<Coordinate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCoordinates = async () => {
    const promises = userData.serviceProviders.map(async (provider) => {
      if (provider.shopAddress) {
        const apiKey = '9c420bc4c89f43269456a20cefbff5c7';
        const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(provider.shopAddress)}&key=${apiKey}`;
        const response = await axios.get(url);
        const data = response.data;
        if (data.results.length > 0) {
          const result = data.results[0];
          const location = result.geometry;
          return {
            name: provider.name,
            latitude: location.lat,
            longitude: location.lng,
          };
        }
      }
      return null;
    });
    const filteredResults = await Promise.all(promises);
    const validResults = filteredResults.filter(result => result !== null) as Coordinate[];
    setCoordinates(validResults);
    setLoading(false);
  };

  useEffect(() => {
    fetchCoordinates();
  }, [userData.serviceProviders]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex justify-between flex-col">
      <div className="bg-gray-100 p-4 rounded-md">
        <h2 className="text-lg font-semibold mb-2">Welcome, {userData.firstName}!</h2>
        <h2 className="text-lg font-semibold mb-2">Service Providers</h2>
        {coordinates.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Shop Address</th>
                  <th className="px-4 py-2">Pincode</th>
                  <th className="px-4 py-2">Location</th>
                </tr>
              </thead>
              <tbody>
                {coordinates.map((coordinate, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">{coordinate.name}</td>
                    <td className="border px-4 py-2">{userData.serviceProviders[index].shopAddress}</td>
                    <td className="border px-4 py-2">{userData.serviceProviders[index].pincode}</td>
                    <td className="border px-4 py-2">
                      <div style={{ height: '200px', width: '100%' }}>
                        <Map center={[coordinate.latitude, coordinate.longitude]} zoom={12} width={'100%'} height={200}>
                          <Marker anchor={[coordinate.latitude, coordinate.longitude]} payload={1} />
                        </Map>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No service providers available</p>
        )}
        <div className="mt-4">
          <label htmlFor="order" className="block text-lg font-semibold mb-2">Order:</label>
          <input type="text" id="order" className="border border-gray-300 rounded-md px-3 py-2 w-full" />
        </div>
      </div>
      <div className="bg-gray-100 p-4 rounded-md mt-4">
        <h2 className="text-lg font-semibold mb-2">Customers</h2>
      </div>
    </div>
  );
};

export default DashboardCard;
