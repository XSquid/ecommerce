const dblogin = require('../database');

const checkoutCart = async (request, response) => {
    const cart_id = parseInt(request.params.id)
    const paymentSuccess = true;
    if (paymentSuccess) {
        await dblogin.pool.query('INSERT INTO orders (cart_id, user_id, item1_id, item1_amount, item2_id, item2_amount, item3_id, item3_amount, item4_id, item4_amount, item5_id, item5_amount, item6_id, item6_amount, item7_id, item7_amount, item8_id, item8_amount, item9_id, item9_amount, item10_id, item10_amount) SELECT cart_id, user_id, item1_id, item1_amount, item2_id, item2_amount, item3_id, item3_amount, item4_id, item4_amount, item5_id, item5_amount, item6_id, item6_amount, item7_id, item7_amount, item8_id, item8_amount, item9_id, item9_amount, item10_id, item10_amount FROM carts WHERE cart_id = $1', 
        [cart_id], (error, results) => {
            if (error) {
                throw error
            }
            return response.status(200).send(`Created order using cart ${cart_id}`)
        })
    }
}

module.exports = {
    checkoutCart
}