import React from "react"
import './css/orderhistory.css'
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import useAuth from "../hooks/useAuth";
import { getHistory, displayHistory } from "../api/order_history_api";




const OrderHistory = () => {

    const { auth } = useAuth();
    const location = useLocation();
    const order_id = location.state.orderID
    const [order, setOrder] = useState([])
    const navigate = useNavigate()
    const [total, setTotal] = useState()

    let subtotal = 0
    const findSubtotal = () => {
        order.forEach(el => {
            subtotal += (el.price * el.quantity)
        })
        subtotal = +subtotal.toFixed(2)
        setTotal(subtotal)
        console.log('subtotal set')
        return
    }

    useEffect(() => {
        async function fetchOrder() {
            await getHistory(order_id, auth.accessToken)
            .then(results => setOrder(results))
            .then(results => findSubtotal())
        }
        fetchOrder()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [total])

    return (
        order
            ?
            <div className='order-information-page'>
                <button className='back-btn' onClick={() => navigate(-1)}>Back</button>
                <div className='order-information'>
                    <div><h4>Name</h4></div>
                    <div><h4>Quantity</h4></div>
                    <div><h4>Price</h4></div>
                    {displayHistory(order)}
                    <div className='order-total-line'></div>
                    <div className='order-total-line'><b>Total: </b></div>
                    <div className='order-total-line'><b>{total}</b></div>

                </div>
            </div>


            :
            <div className='order-information-page'>
                Order History Page
                <button onClick={() => console.log(order)}></button>
            </div>
    )

}

export default OrderHistory;