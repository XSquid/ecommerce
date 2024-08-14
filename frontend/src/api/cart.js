import axios from "./axios";
import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import "../components/css/cart.css"

const Cart = () => {

    const { auth } = useAuth();
    const [userCart, setUserCart] = useState([])

    const compareArrays = (arr1, arr2) => {
        var result = [];
        for (let i = 0; i < arr1.length; i++) {
            for (let j = 0; j < arr2.length; j++) {
                if (arr1[i].product_id == arr2[j].product_id) { //eslint-disable-line
                    result.push({ item: arr2[j].product_name, price: arr2[j].price, quantity: arr1[i].quantity })
                }
            }
        }
        return result
    }

    const fetchCart = async () => {
        if (userCart.length === 0) {
            try {
                const cartResponse = await axios.get(`/cart/${auth.uid}`) //Retrieve cart data
                if (cartResponse.data.length === 0) return // If nothing is returned from the cart query, stop the fetch function
                const productResponse = await axios.get('/products/') //Retrieve product data
                let cartItems = await cartResponse.data[0].contents.map(el => ({ product_id: el[0], quantity: el[1] })) //Create array of cart items to be compared with products
                const productData = await productResponse.data //Array of product data to be compared with cart
                let holder = compareArrays(cartItems, productData) //Create new array with combined data from cart data and products data
                setUserCart(holder) //Set new array to state
            } catch (err) {
                console.log(err)
            }
        }

    }

    function displayCart() {
        let display = userCart.map(el => <><div>{el.item}</div><div>{el.quantity}</div><div>{el.price}</div></>)
        return display
    }

    const findSubtotal = () => {
        var subtotal = 0
        userCart.forEach(el => {
            subtotal += (el.price * el.quantity)
        })
        subtotal = +subtotal.toFixed(2)
        return subtotal
    }
   



 

    //Runs fetchProduct to get the product info once on page load
    useEffect(() => {
        fetchCart()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, )

    return (

        userCart.length === 0
            ?
            <div>
                <p>No Cart</p>
            </div>
            :
            <div>
            <div className='cart-container'>
                <div><h4>Name</h4></div>
                <div><h4>Quantity</h4></div>
                <div><h4>Price</h4></div>
                {displayCart()}
                <div className='total-line'> </div>
                <div className='total-line'><b>Total: </b></div>
                <div className='total-line'>{findSubtotal()}</div>
            </div>
            <button className="place-order-btn">Place Order</button>
            </div>
           
    )
}

export default Cart;