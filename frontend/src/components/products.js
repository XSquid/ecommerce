import React from "react"
import { Link } from "react-router-dom";
import GetProducts from "../api/products_api";

const Products = () => {


    return (
        <div className='products'>
            <h1>Welcome to Products</h1>
            <Link to={'/home'}>
                <button>Go to Home</button>
            </Link>
        <GetProducts />
        </div>
    )

}

export default Products;