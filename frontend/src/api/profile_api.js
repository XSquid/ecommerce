import React from 'react';


import useAuth from '../hooks/useAuth';


function LoadProfile () {

    const {auth} = useAuth();
    
return (
    <div className="profile">
        <h1>Welcome {auth.user}</h1>
        <div className="profile-separator">
            <div className="profile-options">
                <h2>User Options</h2>
                <button>Update User</button><br />
                <button>Delete Account</button>
            </div>
            <div className="current-cart">
                <h2>Cart</h2>
            </div>
            <div className="order-history">
                <h2>Order History</h2>
            </div>
        </div>
    </div>
    
    
)

}

export default LoadProfile;

