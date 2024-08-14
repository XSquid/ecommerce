import React from "react"
import GetProducts from "../api/products_api";
import "./css/products.css"


const Products = () => {


    return (
        <div className='products'>
        <GetProducts />
        </div>
    )

}

export default Products;