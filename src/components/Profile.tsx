import { useState, useEffect } from 'react';
import Navbar from "./Navbar";

export function Profile(){
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    userType: "",
    customer: {
      location: ""
    }
  });


  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await fetch('');
      if (response.ok) {
        const data = await response.json();
        setProfileData(data);
      } else {
        console.error('Failed to fetch profile data');
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  return (
    <>
      <Navbar isSignedIn={true} isSignedUp={true} onSignOut={() => {}} />
      <div className="container mx-auto mt-8 pt-12"> 
        <div className="max-w-md mx-auto bg-white shadow-md rounded-md p-6">
          <h2 className="text-xl font-bold mb-4">Profile Details</h2>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-1" htmlFor="firstName">First Name:</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={profileData.firstName}
              readOnly
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-1" htmlFor="lastName">Last Name:</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={profileData.lastName}
              readOnly
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-1" htmlFor="phone">Phone:</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={profileData.phone}
              readOnly
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-1" htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={profileData.email}
              readOnly
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-1">Pickup Location:</label>
            <input
              type="text"
              id="location"
              name="customer.location"
              value={profileData.customer.location}
              readOnly
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
