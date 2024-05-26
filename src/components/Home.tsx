import { Navbar } from './Navbar';
import '../index.css';

export function Home() {
    return (
        <div className="min-h-screen bg-blue-200 flex flex-col items-center justify-center">
            <Navbar isSignedIn={false} isSignedUp={false} onSignOut={function (): void {
                throw new Error('Function not implemented.');
            } }/>
            
            <h1 className='text-4xl font-bold text-blue-900 mb-4 text-center sm:text-center'>Laundry Made Easy: Providers Meet Customers</h1>
            <p className='text-blue-800 mb-8 text-center'>One Step Solution For Clothes</p>
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => {
                    window.location.href = "/signup";
                }}
            >
                Get Started
            </button>
        </div>
    )
}

export default Home;
