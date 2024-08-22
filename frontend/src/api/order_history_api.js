import axios from "./axios"



export const getHistory = async (order_id, auth_token) => {

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

    const orderResponse = await axios.get(`/order/${order_id}`, {
        headers: { "Authorization": `Bearer ${auth_token}` } //Set authorization header with access token in order to verify login with JWT on backend
    })
    const productResponse = await axios.get('/products/') //Retrieve product data

    let orderItems = await orderResponse.data[0].contents.map(el => ({ product_id: el[0], quantity: el[1] })) //Create array of cart items to be compared with products
    const productData = await productResponse.data //Array of product data to be compared with cart
                
    let holder = compareArrays(orderItems, productData) //Create new array with combined data from cart data and products data
    return holder

}

export const displayHistory = (order) =>{
    let display = order.map(el => <><div key={'name '+el.item_id}>{el.item}</div><div key={'quantity '+el.item_id}>{el.quantity}</div><div key={'price '+el.item_id}>{el.price}</div></>)
    return display
}



