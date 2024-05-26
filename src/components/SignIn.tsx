import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router'; 
import AuthNavbar from './authNavbar';

function SignIn() {
  const [formData, setFormData] = useState({
    loginMethod: 'email',
    email: '',
    phone: '',
    password: '',
  });

  const navigate = useNavigate(); 
  const { loginMethod, email, phone, password } = formData;

  const handleChange = (event: { target: { name: any; value: any; }; }) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    try {
      const url = 'http://localhost:3000/api/auth/signin';
      const formDataToSend = {
        password,
        ...(loginMethod === 'email' ? { email } : { phone }),
      };
      const response = await axios.post(url, formDataToSend);
      console.log('Response data:', response.data);
      const userType = response.data.userType;
      console.log('User type:', userType);
  
      const serviceProviders = [
        {
          name: response.data.name,
          shopAddress: response.data.shopAddress,
          pincode: response.data.pincode,
        },
      ];
  
      localStorage.setItem('userData', JSON.stringify({
        ...response.data,
        firstName: response.data.firstName, 
        serviceProviders,
      }));
  
      if (userType === 'ServiceProvider') {
        navigate('/dashboard');
      } else {
        navigate('/feed');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-blue-200">
      <AuthNavbar />
      <form onSubmit={handleSubmit} className="p-4 bg-white shadow-md rounded-lg mb-4 max-w-md mx-auto">
        <div className="mb-4">
          <label htmlFor="loginMethod" className="block text-gray-700 font-bold mb-2">
            Choose login method:
          </label>
          <div className="flex items-center">
            <input type="radio" id="email" name="loginMethod" value="email" className="mr-2" checked={loginMethod === 'email'} onChange={handleChange} />
            <label htmlFor="email" className="text-gray-700">Email</label>
          </div>
          <div className="flex items-center mt-2">
            <input type="radio" id="phone" name="loginMethod" value="phone" className="mr-2" checked={loginMethod === 'phone'} onChange={handleChange} />
            <label htmlFor="phone" className="text-gray-700">Phone</label>
          </div>
        </div>
        {loginMethod === 'email' && (
          <>
            <input type="email" id="email" name="email" value={email} onChange={handleChange} placeholder="Email" className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500" />
            <input name="password" value={password} onChange={handleChange} placeholder="Password" type={showPassword ? "text" : "password"} className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500" />
          </>
        )}
        {loginMethod === 'phone' && (
          <>
            <input name="phone" value={phone} onChange={handleChange} placeholder="Phone" className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500" />
            <input name="password" value={password} onChange={handleChange} placeholder="Password" type={showPassword ? "text" : "password"} className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500" />
          </>
        )}
        <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-700 focus:outline-none mb-4 ">{showPassword ? "Hide" : "Show"} Password</button>
        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Sign In</button>
      </form>
      <div className="w-full max-w-md text-center text-xl">
        <p>Don't have an account? <a href="/signup" className="text-blue-700">SignUp</a></p>
      </div>
    </div>
  );
}

export default SignIn;
