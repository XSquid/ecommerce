import React from 'react';
import Cart from './cart';
import ProfileHistory from './profile_history';
import AddFunds from './addfunds';
import axios from "./axios";
import { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router';


function LoadProfile() {

    const { auth } = useAuth();
    const [availableFunds, setAvailableFunds] = useState(0) //Display for funds currently on the account
    const [editFunds, setEditFunds] = useState(false) //If false, shows the profile with cart and order history, if true shows the view to add funds
    const [notEnoughFunds, setNotEnoughFunds] = useState(false) //Notification of not enough funds
    const navigate = useNavigate();
    const [orderPlaced, setOrderPlaced] = useState(false) //Used to update ProfileHistory component and re-render the order history with new order when an order is placed

    const getFunds = async () => {
        const response = await axios.get(`/user/${auth.uid}`,
            {
                headers: { "Authorization": `Bearer ${auth.accessToken}` } //Set authorization header with access token in order to verify login with JWT on backend
            })
        setAvailableFunds(response.data[0].funds)
    }

    //Change view to add funds
    const addFundsView = async (e) => {
        setEditFunds(true)
    }

    //Redirect to route for deleting account
    const clickDelete = (e) => {
        navigate('/profile/delete')
    }

    useEffect(() => {
        getFunds();
        setNotEnoughFunds(false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editFunds])


    return (

        editFunds
            ? //When editFunds is true, change view to edit funds
            <AddFunds setDisplay={setEditFunds} />
            : //Show regular profile if editFunds is not true
            <div className="profile">
                <h1>Welcome back {auth.user}!</h1>
                <p>Total funds available: ${availableFunds}</p>
                {notEnoughFunds //If not enough funds for the cart, show a warning that funds need to be added. Otherwise show nothing
                    ? <div className='invalid-funds-warning'><span >Please add funds to complete purchase</span></div>
                    : <></>}
                <div className="profile-separator">
                    <div className="profile-options">
                        <h2>User Options</h2>
                        <button onClick={addFundsView}>Add Funds</button>
                        <button>Update User</button><br />
                        <button onClick={clickDelete}>Delete Account</button>
                    </div>
                    <div className="current-cart">
                        <h2>Cart</h2>
                        <Cart availableFunds={availableFunds} notEnoughFunds={setNotEnoughFunds} setFunds={setAvailableFunds} setOrderPlaced={setOrderPlaced} />
                    </div>
                    <div className="order-history">
                        <h2>Order History</h2>
                        <ProfileHistory orderPlaced={orderPlaced} />
                    </div>
                </div>
            </div>


    )

}

export default LoadProfile;

