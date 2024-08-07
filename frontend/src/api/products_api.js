import React, { useState } from 'react';

const GetProducts = () => {

    function handleClick() {
        fetch('http://localhost:3000/products')
            .then(res => {
                return res.json()
            }).then(val => {
                setProducts(val)
            })
    }


    const [products, setProducts] = useState([])

    function productLI() {
        let allProd = products.map(p => <li>{p.product_name}</li>)
        return allProd
    }

    return (
        <div>
            <button onClick={handleClick}>Fetch products</button>
            <ul>
                {productLI()}
            </ul>
        </div>
    )

}

export default GetProducts