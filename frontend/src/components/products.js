import React from "react"
import { Link } from "react-router-dom";

const Products = () => {

    return (
        <div className='products'>
            <h1>Welcome to Products</h1>
            <Link to={'/home'}>
                <button>Go to Home</button>
            </Link>

        </div>
    )

}

export default Products;