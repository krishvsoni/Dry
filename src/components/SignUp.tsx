import { useState } from 'react';
import axios from 'axios';
import AuthNavbar from './authNavbar';

function Signup() {
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    password: '',
    userType: '',
    firstName: '',
    lastName: '',
    name: '',
    shopAddress: '',
    pincode: '',
    services: '',
    location: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/auth/signup', formData);
      console.log(response.data);
      if (formData.userType === 'Customer') {
        window.location.href = '/signin';
      } else {
        window.location.href = '/signin';
      }
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        alert(error.response.data);
      } else {
        console.error(error);
      }
    }
  };

  return (
    <>
    <AuthNavbar/>
    <div style={{ marginTop: '70px', padding: '20px' }} className="flex flex-col items-center justify-center h-screen bg-blue-200">
      <form onSubmit={handleSubmit} className="p-4 bg-white shadow-md rounded-lg mb-4 max-w-md mx-auto">
        <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500" />
        <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500" />
        <div className="relative">
          <input 
            name="password" 
            value={formData.password} 
            onChange={handleChange} 
            placeholder="Password" 
            type={showPassword ? "text" : "password"} 
            className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500" 
          />
          <button 
            type="button" 
            className="absolute top-0 right-0 mr-3 mt-3" 
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <select name="userType" value={formData.userType} onChange={handleChange} className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500">
          <option value="">Select user type</option>
          <option value="ServiceProvider">Service Provider</option>
          <option value="Customer">Customer</option>
        </select>
        <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500" />
        <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500" />
        {formData.userType === 'ServiceProvider' && (
          <>
            <input name="name" value={formData.name} onChange={handleChange} placeholder="Shop Name" className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500" />
            <input name="shopAddress" value={formData.shopAddress} onChange={handleChange} placeholder="Shop Address" className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500" />
            <input name="pincode" value={formData.pincode} onChange={handleChange} placeholder="Pincode" className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500" />
            <input name="services" value={formData.services} onChange={handleChange} placeholder="Services" className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500" />
            <p className='text-sm text-center '> Services: DryCleaning,  Press,  Oil Greasing,  Wash</p>
            <br></br>
          </>
        )}
        {formData.userType === 'Customer' && (
          <input name="location" value={formData.location} onChange={handleChange} placeholder="Location" className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500" />
        )}
        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Sign Up</button>
      </form>
      <div className="w-full max-w-md text-center text-xl">
        <p>Already have an account? <a href="/signin" className="text-blue-700">SignIn</a></p>
      </div>
    </div>
    </>
  );
}

export default Signup;
