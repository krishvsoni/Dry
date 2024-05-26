import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaUserCircle } from 'react-icons/fa';
import { useState } from 'react';

interface NavbarProps {
  isSignedIn: boolean;
  isSignedUp: boolean;
  onSignOut: () => void;
}

export function Navbar({ isSignedIn, isSignedUp, onSignOut }: NavbarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await axios.post('http://localhost:3000/api/auth/signout');

      sessionStorage.clear();
      localStorage.removeItem('token');

      window.location.href = '/';

      onSignOut();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav className="fixed top-0 w-full flex items-center justify-between p-6 bg-blue-500">
      <div className="text-white text-xl">
        <Link to="/" className="text-white font-bold">DRY</Link> 
      </div>
      <div className="flex items-center space-x-4">
        {!isSignedUp && (
          <Link to="/signup" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Sign Up</Link>
        )}
        {!isSignedIn && (
          <Link to="/signin" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Sign In</Link>
        )}
        {isSignedIn && (
          <div className="relative">
            <FaUserCircle className="text-white text-2xl cursor-pointer" onClick={() => setIsDropdownOpen(!isDropdownOpen)} />
            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-md">
                <Link to="/profile" className="block px-4 py-2 text-blue-700 hover:bg-gray-200">Profile</Link>
                <button onClick={handleSignOut} className="block w-full text-left px-4 py-2 text-blue-700 hover:bg-gray-200">Sign Out</button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
