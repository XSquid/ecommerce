import axios from './axios';
import { useState, useEffect } from 'react';
import useAuth from "../hooks/useAuth";
import "../components/css/profile_history.css"
import { useNavigate } from 'react-router';


const ProfileHistory = () => {
    const { auth } = useAuth();
    const [history, setHistory] = useState([])

    const navigate = useNavigate();
    const user_id = auth.uid

    //Load the order history, only save the databse order ID and the total
    const loadHistory = async () => {
        const response = await axios.get(`/orderhistory/${user_id}`, {
            headers: { "Authorization": `Bearer ${auth.accessToken}` } //Set authorization header with access token in order to verify login with JWT on backend
        })
        let results = response.data
        setHistory(results.map(el => [el.order_id, el.total]))
    }

    //Click handler for redirecting to the order history page for the specific order clicked on
    const clickHandler = (orderID) => {
        navigate(`/order_history/${orderID}`)
    }

    //Display for all orders, showing the orders ID (not database ID) and total
    function displayHistory() {
        let orderNumber = 0
        let display = history.map(el => <div className='profile-order-history' onClick={() => { clickHandler(el[0]) }}>Order {orderNumber += 1} -- Total: {el[1]} </div>)
        return display
    }

    useEffect(() => { 
        loadHistory()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (

        history.length !== 0
        ?
        <div>
            {displayHistory()}
        </div>
        :
        <div>No order history</div>
    )

}

export default ProfileHistory