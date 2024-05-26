import { Link } from 'react-router-dom'; 
export function AuthNavbar() {
  return (
    <nav className="fixed top-0 w-full flex items-center justify-between p-6 bg-blue-500">
      <div className="text-white text-xl">
        <Link to="/" className="text-white font-bold">DRY</Link> 
      </div>

    </nav>
  );
}

export default AuthNavbar;