import { useParams } from 'react-router';
import axios from './axios';
import { useState, useEffect } from 'react';
import useAuth from "../hooks/useAuth";

const GetProduct = () => {


    const [productInfo, setProductInfo] = useState({})
    const { id } = useParams();
    const [cartAmount, setCartAmount] = useState(0);
    const { auth } = useAuth();
    const [createAccount, setCreateAccount] = useState(false)

    //Fetch to the database on page load to get product info
    const fetchProduct = async () => {
        try {
            const response = await axios.get(`/product/${id}`)
            setProductInfo(response.data[0])
        } catch (err) {
            console.log(err)
        }
    }

    //Loading picture - Picture is not saved to database, a reference to it is saved in the database but the picture itself is stored locally.
    let picture

    if (productInfo.picture) {
        picture = require(`./database_pictures/${productInfo.picture}.png`)
    } else {
        picture = 'ballpeen_hammer'
    }

    //increment button for cart
    const cartAmountUp = () => {
        if (cartAmount >= productInfo.stock_amount) {
            return setCartAmount(productInfo.stock_amount)
        } else if (cartAmount < 0) {
            return setCartAmount(0)
        }
        else {
            return setCartAmount(cartAmount + 1);
        }

    }
    //decrement button for cart
    const cartAmountDown = () => {
        if (cartAmount <= 0) {
            return setCartAmount(0)
        } else if (cartAmount > productInfo.stock_amount) {
            return setCartAmount(productInfo.stock)
        } else {
            return setCartAmount(cartAmount - 1);
        }

    }

    //Click handler for button to add to cart
    const addToCart = async (e) => {
        e.preventDefault();
        if (cartAmount <= 0) {
            return setCartAmount(0)
        } else if (cartAmount > productInfo.stock_amount) {
            return setCartAmount(productInfo.stock_amount)
        }

        try {
            const response = await axios.post(`cart/add/${auth.uid}`, {
                product_id: productInfo.product_id,
                quantity: cartAmount
            } , {
                headers: {"Authorization": `Bearer ${auth.accessToken}`} //Set authorization header with access token in order to verify login with JWT on backend
            }
            )

            console.log(response)
        } catch (err) {
            if (err.response.status === 401) {
                return setCreateAccount(true)
            }
        }

    }


    //Runs fetchProduct to get the product info once on page load
    useEffect(() => {
        fetchProduct()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (

        productInfo
            //if the product info is successfully retrieved from server
            ?
            <div>
                {createAccount
                    ? <p className='please-login'>Please log in to add items to your cart!</p>
                    : <></>}
                <h1 id='product-page-title'>{productInfo.product_name}</h1>
                <div className="product-page">
                    <img id="product-picture" src={picture} alt={productInfo.picture} />


                    <div className='product-stock'>
                        <p><b>Amount in Stock: </b>{productInfo.stock_amount}</p>
                        <p><b>Price: </b>{productInfo.price}</p>
                    </div>

                    <div className='product-cart'>
                        <div>
                            <span class="material-symbols-outlined" id="arrow-up" onClick={cartAmountUp}>keyboard_arrow_up</span><br />
                            <input id="cart-amount" type="number" max={productInfo.stock_amount} min="0" value={cartAmount} readOnly /><br />
                            <span class="material-symbols-outlined" id="arrow-down" onClick={cartAmountDown}>keyboard_arrow_down</span><br />
                        </div>

                        <div><button onClick={addToCart}>Add to Cart</button><br />

                        </div>

                        
                    </div>
                    <div className='product-description'><p >{productInfo.description}</p></div>
                    

                </div>
            </div>
            :
            //if the product info is not retrieved from server
            <div><h1>Failed to load from database</h1></div>

    )

}

export default GetProduct;

