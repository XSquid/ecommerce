import React from "react"
import "./css/getProduct.css"
import { useNavigate } from "react-router"
import GetProduct from "../api/getProduct_api"


const ProductPage = () => {
    const navigate = useNavigate();

    return (
        <div className='products'>
            <button onClick={() => navigate(-1)}>Go Back</button>
            <GetProduct />
        </div>
    )

}

export default ProductPage;