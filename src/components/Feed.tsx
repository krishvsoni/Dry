import ServiceProviderCard from './FeedCard';
import Navbar from './Navbar';

export function Feed() {
    

    return (
        <>
        <Navbar isSignedIn={true} isSignedUp={true} onSignOut={function (): void {
                throw new Error('Function not implemented.');
            } }/>
        <ServiceProviderCard/>

            


        </>


    );
}

export default Feed;