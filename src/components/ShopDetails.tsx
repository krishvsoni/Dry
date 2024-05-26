import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { Map, Marker } from 'pigeon-maps';

interface ServiceProvider {
  name: string;
  pincode: string;
  services: string;
  shopAddress: string;
}

interface Coordinates {
  latitude: number;
  longitude: number;
}

export function ShopDetails() {
  const [shop, setShop] = useState<ServiceProvider | null>(null);
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const { index } = useParams<{ index: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false); // State to track if MetaMask wallet is connected
  const [liveLocation, setLiveLocation] = useState(false); // State to track if live location is selected
  const navigate = useNavigate();

  useEffect(() => {
    fetchShopDetails();
  }, [index]);

  const fetchShopDetails = () => {
    setIsLoading(true);
    fetch('http://localhost:3000/api/service-providers')
      .then(response => response.json())
      .then((data: ServiceProvider[]) => {
        const shopIndex = parseInt(index ?? '', 10);
        if (!isNaN(shopIndex) && shopIndex >= 0 && shopIndex < data.length) {
          setShop(data[shopIndex]);
        }
      })
      .catch(error => console.error('Error fetching shop details:', error))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (shop && shop.shopAddress) {
      const apiKey = '9c420bc4c89f43269456a20cefbff5c7';
      const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(shop.shopAddress)}&key=${apiKey}`;
      fetch(url)
        .then(response => response.json())
        .then((data) => {
          if (data.results.length > 0) {
            const result = data.results[0];
            const location = result.geometry;
            setCoordinates({
              latitude: location.lat,
              longitude: location.lng,
            });
          }
        })
        .catch(error => {
          console.error('Error fetching coordinates:', error);
          alert('Error fetching shop coordinates. Please try again.');
        });
    }
  }, [shop]);

  const makeOrder = async (orderDetails: any) => {
    try {
      if (!orderDetails.name) {
        throw new Error('Missing serviceProviderName');
      }
  
      const response = await fetch('http://localhost:3000/api/auth/make-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...orderDetails,
          serviceProviderName: orderDetails.name 
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to place order');
      }
  
      const data = await response.json();
      console.log('Order placed successfully:', data);
  
      const response2 = await fetch('http://localhost:3000/api/auth/save-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data.order), 
      });
  
      if (!response2.ok) {
        throw new Error('Failed to save order to the database');
      }
  
      console.log('Order saved to the database successfully');
  
      alert('Order placed successfully!');
    } catch (error) {
      console.error('Error making order:', error);
      alert('Error placing order. Please try again.');
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const orderDetails: any = {};
    formData.forEach((value, key) => {
      orderDetails[key] = value;
    });

    if (liveLocation) {
      try {
        const position = await getCurrentPosition();
        const apiKey = '9c420bc4c89f43269456a20cefbff5c7';
        const url = `https://api.opencagedata.com/geocode/v1/json?q=${position.coords.latitude}+${position.coords.longitude}&key=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.results.length > 0) {
          const result = data.results[0];
          orderDetails.pickupLocation = result.formatted;
        }
      } catch (error) {
        console.error('Error getting current location:', error);
        alert('Error getting current location. Please try again.');
        return;
      }
    }

    const requiredFields = ['firstName', 'lastName', 'phone', 'pickupLocation', 'clothesCount', 'service', 'name'];
    for (const field of requiredFields) {
      if (!orderDetails[field]) {
        alert('Please fill in all required fields.');
        return;
      }
    }

    makeOrder(orderDetails);
    setShowPopup(false);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const getCurrentPosition = () => {
    return new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  };

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined' && (window as any).ethereum?.isMetaMask) {
      (window as any).ethereum
        .request({ method: 'eth_requestAccounts' })
        .then(() => setWalletConnected(true)) 
        .catch((err: Error) => {
          console.error(err);
          alert('Failed to connect MetaMask wallet.');
        });
    } else {
      alert('MetaMask is not installed. Please install MetaMask to proceed with payment.');
    }
  }, []);

  return (
    <>
      <Navbar isSignedIn={true} isSignedUp={true} onSignOut={() => {}} />
      <div className="flex justify-center">
        <div style={{ marginTop: '100px', padding: '20px' }} className="relative">
          {isLoading && <div>Loading...</div>}
          {shop && (
            <>
              <div className="card" style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
                <h2>{shop.name}</h2>
                <p>Pincode: {shop.pincode}</p>
                <p>Services: {shop.services}</p>
                <p>Address: {shop.shopAddress}</p>
                {!showPopup && (
                  <button className={walletConnected ? 'bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600' : 'bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600'} onClick={() => setShowPopup(true)}>
                    {walletConnected ? 'Order ' : 'Connect MetaMask Wallet'}
                  </button>
                )}
              </div>
              <div style={{ height: '400px', width: '100%', marginBottom: '20px' }}>
                {coordinates &&(
                  <Map center={[coordinates.latitude, coordinates.longitude]} zoom={12} width={600} height={400}>
                    <Marker anchor={[coordinates.latitude, coordinates.longitude]} payload={1} />
                  </Map>
                )}
              </div>
              <button onClick={handleBack} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Back</button>
            </>
          )}
        </div>
        {showPopup && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg p-8">
              <h2 className="text-lg font-bold mb-4">Order Form</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="block mb-1">Shop Name:</label>
                  <input type="text" id="name" name="name" value={shop?.name} readOnly className="border border-gray-300 rounded px-3 py-1 w-full" />
                </div>
                <div className="mb-4">
                  <label htmlFor="firstName" className="block mb-1">First Name:</label>
                  <input type="text" id="firstName" name="firstName" required className="border border-gray-300 rounded px-3 py-1 w-full" />
                </div>
                <div className="mb-4">
                  <label htmlFor="lastName" className="block mb-1">Last Name:</label>
                  <input type="text" id="lastName" name="lastName" required className="border border-gray-300 rounded px-3 py-1 w-full" />
                </div>
                <div className="mb-4">
                  <label htmlFor="phone" className="block mb-1">Phone:</label>
                  <input type="text" id="phone" name="phone" required className="border border-gray-300 rounded px-3 py-1 w-full" />
                </div>
                <div className="mb-4">
                  <label htmlFor="pickupLocation" className="block mb-1">Pickup Location:</label>
                  {liveLocation ? (
                    <input type="text" id="pickupLocation" name="pickupLocation" readOnly className="border border-gray-300 rounded px-3 py-1 w-full" />
                  ) : (
                    <input type="text" id="pickupLocation" name="pickupLocation" required className="border border-gray-300 rounded px-3 py-1 w-full" />
                  )}
                  <label className="block mt-2">
                    <input type="checkbox" checked={liveLocation} onChange={(e) => setLiveLocation(e.target.checked)} className="mr-2" />
                    Use live location
                  </label>
                </div>
                <div className="mb-4">
                  <label htmlFor="clothesCount" className="block mb-1">Clothes Count:</label>
                  <input
                    type="number"
                    id="clothesCount"
                    name="clothesCount"
                    required
                    min="1"
                    className="border border-gray-300 rounded px-3 py-1 w-full"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="service" className="block mb-1">Service:</label>
                  <input type="text" id="service" name="service" required className="border border-gray-300 rounded px-3 py-1 w-full" />
                </div>
                <div className="mb-4">
                  <label htmlFor="urgent" className="block mb-1">Urgent:</label>
                  <input type="checkbox" id="urgent" name="urgent" />
                </div>
                <div className="flex justify-between">
                  <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Submit Order</button>
                  <button onClick={() => setShowPopup(false)} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ShopDetails;
