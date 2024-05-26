import { useEffect, useState } from 'react';
import DashboardCard from "./DashboardCard";
import Navbar from "./Navbar";

export function Dashboard() {
    const [userData, setUserData] = useState<{ firstName: string; userType: string; serviceProviders: { name: string; shopAddress: string; pincode: string; }[] } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
            setUserData(JSON.parse(storedUserData));
            setLoading(false);
        } else {
            console.log('No user data found in local storage');
        }
    }, []);

    return (
        <>
            <Navbar isSignedIn={true} isSignedUp={true} onSignOut={() => {}} />
            {loading ? (
                <p>Loading user data...</p>
            ) : (
                <DashboardCard userData={userData!} />
            )}
        </>
    );
}

export default Dashboard; 
