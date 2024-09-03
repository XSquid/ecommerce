import axios from "./axios";
import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import "../components/css/cart.css"

const Cart = (props) => {

    const { auth } = useAuth();
    const [userCart, setUserCart] = useState([]) //Contains contents of the cart, or information when an order is placed
    const [cartId, setCartId] = useState() //Contains cart ID from database, needed for removing items and placing order
    const [orderTotal, setOrderTotal] = useState() //Sum of items in cart, used for checking if enough funds are available both client and server side (not ideal)

    //Combine the retrieved cart and product info, so it will show product name, quantity, price and ID
    const compareArrays = (arr1, arr2) => {
        var result = [];
        for (let i = 0; i < arr1.length; i++) {
            for (let j = 0; j < arr2.length; j++) {
                if (arr1[i].product_id == arr2[j].product_id) { //eslint-disable-line
                    result.push({ item: arr2[j].product_name, price: arr2[j].price, quantity: arr1[i].quantity, product_id: arr2[j].product_id })
                }
            }
        }
        return result
    }

    //Get the cart data and product data from database, combine the two for display
    const fetchCart = async () => {
        if (userCart.length === 0) {
            try {
                const cartResponse = await axios.get(`/cart/${auth.uid}`, {
                    headers: { "Authorization": `Bearer ${auth.accessToken}` } //Set authorization header with access token in order to verify login with JWT on backend
                }) //Retrieve cart data
                if (cartResponse.data.length === 0) return // If nothing is returned from the cart query, stop the fetch function
                const productResponse = await axios.get('/products/') //Retrieve product data
                if (cartResponse.data[0].contents === null) { return }
                let cartItems = await cartResponse.data[0].contents.map(el => ({ product_id: el[0], quantity: el[1] })) //Create array of cart items to be compared with products
                const productData = await productResponse.data //Array of product data to be compared with cart
                let holder = compareArrays(cartItems, productData) //Create new array with combined data from cart data and products data
                setUserCart(holder) //Set new array to state
                setCartId(cartResponse.data[0].cart_id)
            } catch (err) {
                console.log(err)
            }
        }

    }

    //Function to display all items in cart
    // return as 3 divs inside an empty element in order to properly fill the grid container
    function displayCart() {
        let display = userCart.map(el => <>
            <div ><span className="material-symbols-outlined" id={el.product_id} onClick={removeCart}>delete</span><span>{el.item}</span></div>
            <div >{el.quantity}</div>
            <div >{el.price}</div>
        </>)
        return display
    }

    //Function to find total of all items in cart
    const findSubtotal = () => {
        var subtotal = 0
        if (userCart !== "PROCESSING_ORDER") {
            userCart.forEach(el => {
                subtotal += (el.price * el.quantity)
            })
        }
        subtotal = +subtotal.toFixed(2)
        return setOrderTotal(subtotal)
    }

    const removeCart = async (e) => { //Remove selected item from database, and update the displayed cart
        e = e.target || e.srcElement
        let product_id = e.id
        const cartResponse = await axios.post(`/cart/remove/${cartId}`, {
            product_id
        }, {
            headers: { "Authorization": `Bearer ${auth.accessToken}` } //Set authorization header with access token in order to verify login with JWT on backend
        })
        const productResponse = await axios.get('/products/') //Retrieve product data
        let cartItems = await cartResponse.data.contents.map(el => ({ product_id: el[0], quantity: el[1] })) //Create array of cart items to be compared with products
        const productData = await productResponse.data //Array of product data to be compared with cart
        let holder = compareArrays(cartItems, productData) //Create new array with combined data from cart data and products data
        setUserCart(holder) //Set new array to state
    }

    const placeOrder = async (e) => {

        if (orderTotal > props.availableFunds) {
            return props.notEnoughFunds(true)
        }
        try {
            const response = await axios.post(`/cart/${cartId}/checkout`, {
                order_total: orderTotal
            }, {
                headers: { "Authorization": `Bearer ${auth.accessToken}` } //Set authorization header with access token in order to verify login with JWT on backend
            })

            props.setFunds(response.data) // Set available funds to remaining funds after purchase



            setTimeout(function () {
                setUserCart([]) //Empty the cart display
                setUserCart('PROCESSING_ORDER')
                setTimeout(function () {
                    document.getElementById("processing-order").innerHTML = "Purchase successful!"
                    props.setOrderPlaced(true)
                }, 1500)
            }, 250)


        } catch (err) {
            if (err.response.status === 422) {
                return props.notEnoughFunds(true)
            }
        }
    }

    //Runs fetchProduct to get the product info once on page load
    useEffect(() => {
        fetchCart();
        findSubtotal();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userCart])

    return (
        //If there are no items in cart, show No cart otherwise show the cart
        userCart.length === 0
            ?
            <div className='empty-cart'>
                No items in the cart
            </div>
            :
            userCart === "PROCESSING_ORDER"
                ? <div id="processing-order">Processing Order...</div>
                :
                <div>
                    <div className='cart-container'>
                        <div><h4>Name</h4></div>
                        <div><h4>Quantity</h4></div>
                        <div><h4>Price</h4></div>
                        {displayCart()}
                        <div className='total-line'> </div>
                        <div className='total-line'><b>Total: </b></div>
                        <div className='total-line'>{orderTotal}</div>
                    </div>
                    <button className="place-order-btn" onClick={placeOrder}>Place Order</button>
                </div>


    )
}

export default Cart;