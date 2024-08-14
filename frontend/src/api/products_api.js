import React, { useState } from 'react';
import hammer from "../components/css/pictures/hammer.png"
import nail from "../components/css/pictures/nails.png"
import allproducts from "../components/css/pictures/all-products.png"
import axios from './axios';
import { useNavigate } from 'react-router-dom';

const GetProducts = () => {

    const navigate = useNavigate();

    const [displayHome, setDisplayHome] = useState(true)
    const [products, setProducts] = useState()

    function displayProducts() {
        let display = products.map(p => <><div className="selectProduct" onClick={() => loadProduct(p.product_id)}>{p.product_name}</div><div>{p.price}</div><div>{p.stock_amount}</div></>)
        return display
    }

    const loadProduct = (pid) => {
        navigate(`/product/${pid}`)
    }


    const searchAll = async (type) => {
        try {
            const response = await axios.get(type)
            setDisplayHome(false)
            setProducts(response.data)
        } catch (err) {
            if (!err?.response) {
                console.log('No Server Response')
            } else {
                console.log('Unable to retrieve products')
            }
        }
    }


    return (

        displayHome
            ?
            <div>
                <div className="search-container">
                    <div className="search-icon" id="all-products" onClick={() => searchAll('/products')}><h3>All Products</h3><img src={allproducts} alt="All Products" /></div>
                    <div className="search-icon" id='hammers' onClick={() => searchAll('/products/hammer')}><h3>Hammers</h3><img src={hammer} alt="Hammers" /></div>
                    <div className="search-icon" id='nails' onClick={() => searchAll('/products/nail')}><h3>Nails</h3><img src={nail} alt="Nails" /></div>
                </div>
            </div>
            :
            <div>
                <button id="backBtn" onClick={() => setDisplayHome(true)}>Back</button>
                <div className="product-wrapper">
                    
                    <div className="product-title">Name</div>
                    <div className="product-title">Price</div>
                    <div className="product-title">Quantity in Stock</div>
                    {displayProducts()}

                </div>
            </div>

    )

}

export default GetProducts