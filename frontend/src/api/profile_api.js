import React from 'react';
import Cart from './cart';
import ProfileHistory from './profile_history';
import AddFunds from './addfunds';
import axios from "./axios";
import { useState, useEffect } from 'react';

import useAuth from '../hooks/useAuth';


function LoadProfile() {

    const { auth } = useAuth();
    const [availableFunds, setAvailableFunds] = useState(0)
    const [editFunds, setEditFunds] = useState(false)
    const [notEnoughFunds, setNotEnoughFunds] = useState(false)

    const getFunds = async () => {
        const response = await axios.get(`/user/${auth.uid}`,
            {
                headers: { "Authorization": `Bearer ${auth.accessToken}` } //Set authorization header with access token in order to verify login with JWT on backend
            })
        setAvailableFunds(response.data[0].funds)
    }

    const addFundsView = async (e) => {
        setEditFunds(true)
    }


    useEffect(() => {
        getFunds();
        setNotEnoughFunds(false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editFunds])


    return (

        editFunds
            ?
            <AddFunds setDisplay={setEditFunds} />
            :
            <div className="profile">
                <h1>Welcome back {auth.user}!</h1>
                <p>Total funds available: ${availableFunds}</p>
                {notEnoughFunds
                    ? <div className='invalid-funds-warning'><span >Please add funds to complete purchase</span></div>
                    : <></>}
                <div className="profile-separator">
                    <div className="profile-options">
                        <h2>User Options</h2>
                        <button onClick={addFundsView}>Add Funds</button>
                        <button>Update User</button><br />
                        <button>Delete Account</button>
                    </div>
                    <div className="current-cart">
                        <h2>Cart</h2>
                        <Cart availableFunds={availableFunds} notEnoughFunds={setNotEnoughFunds} setFunds={setAvailableFunds} />
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

