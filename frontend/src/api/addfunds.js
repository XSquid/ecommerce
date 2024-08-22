import React from 'react';
import axios from "./axios";
import { useState } from 'react';
import useAuth from '../hooks/useAuth';


const AddFunds = (props) => {

    const [fundsToAdd, setFundsToAdd] = useState(0)
    const [warning, setWarning] = useState(false)
    const { auth } = useAuth();
    const [waiting, setWaiting] = useState('')


    const addFunds = async (e) => {
        e.preventDefault();
        if (fundsToAdd < 1 || fundsToAdd > 250) {
            return setWarning(true)
        }
        e.target.disabled = true;
        const response = await axios.post(`/user/${auth.uid}/editFunds`,
            {
                fundsToAdd
            },
            {
                headers: { "Authorization": `Bearer ${auth.accessToken}` } //Set authorization header with access token in order to verify login with JWT on backend
            })
        if (response.status === 201) {
            setTimeout(function () {
                setWaiting('Adding funds...')
                setTimeout(function () {
                    setWaiting('Funds added!')
                    setTimeout(function () {
                        props.setDisplay(false)
                    }, 2000)
                }, 1500)

            }, 200)
        }
    }

    return (
        <div>
            <button className='back-btn' onClick={() => props.setDisplay(false)}>Back</button>
            <div className='add-funds'>

                <h2>Add funds to account</h2>
                <form>
                    <div className='add-funds-form'>
                        <label for="amount">Amount to add, between $1 and $250:</label><br />
                        {warning
                            ? <h4 id='invalid-fund-amount'>Please enter a valid number</h4>
                            : <></>}
                        <input
                            id="amount"
                            type="number"
                            value={fundsToAdd}
                            onChange={event => setFundsToAdd(event.target.value)}
                            required />
                    </div>
                    <button type="submit" onClick={addFunds}>Add funds</button>
                </form>
                <h4>{waiting}</h4>
            </div>
        </div>

    )

}

export default AddFunds;