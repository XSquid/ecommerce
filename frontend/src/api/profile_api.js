import React from 'react';
import Cart from './cart';
import ProfileHistory from './profile_history';

import useAuth from '../hooks/useAuth';


function LoadProfile () {

    const {auth} = useAuth();
    
return (
    <div className="profile">
        <h1>Welcome back {auth.user}!</h1>
        <p>Total funds available: </p>
        <div className="profile-separator">
            <div className="profile-options">
                <h2>User Options</h2>
                <button>Add Funds</button>
                <button>Update User</button><br />
                <button>Delete Account</button>
            </div>
            <div className="current-cart">
                <h2>Cart</h2>
                <Cart />
            </div>
            <div className="order-history">
                <h2>Order History</h2>
                <ProfileHistory />
            </div>
        </div>
    </div>
    
    
)

}

export default LoadProfile;

