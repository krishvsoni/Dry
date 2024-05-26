import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./components/Home";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import Feed from "./components/Feed";
import { Dashboard } from "./components/Dashboard";
import ShopDetails from "./components/ShopDetails";
import ServiceProviderCard from "./components/FeedCard";
import Profile from "./components/Profile";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} /> 
          <Route path="/feed" element={<Feed />} />
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/shop/:index" element={<ShopDetails />} />
          <Route path="/service-providers" element={<ServiceProviderCard />} />
          <Route path="/profile" element={<Profile/>}/>
        </Routes>
      </Router>
    </>
  );
}

export default App;
