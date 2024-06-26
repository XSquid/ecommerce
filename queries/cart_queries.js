const dblogin = require('../database');

const getAllCarts = (request, response) => {
    dblogin.pool.query('SELECT * FROM carts ORDER BY user_id ASC', (error, results) => {
        if (error) {
            throw error
        }
        return response.status(200).json(results.rows)
    })
}

const getCart = (request, response) => {
    const cart_id = parseInt(request.params.id)
    dblogin.pool.query('SELECT * FROM carts WHERE cart_id = $1', [cart_id], (error, results) => {
        if (error) {
            throw error
        }
        return response.status(200).json(results.rows)

    })
}

const createCart = (request, response) => {
    const {user_id, item1_id, item1_amount, item2_id, item2_amount, item3_id, item3_amount, item4_id, item4_amount, item5_id, item5_amount, 
        item6_id, item6_amount, item7_id, item7_amount, item8_id, item8_amount, item9_id, item9_amount, item10_id, item10_amount} = request.body
    dblogin.pool.query('INSERT INTO carts (user_id, item1_id, item1_amount, item2_id, item2_amount, item3_id, item3_amount, item4_id, item4_amount, item5_id, item5_amount, item6_id, item6_amount, item7_id, item7_amount, item8_id, item8_amount, item9_id, item9_amount, item10_id, item10_amount) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21) RETURNING *',
        [user_id, item1_id, item1_amount, item2_id, item2_amount, item3_id, item3_amount, item4_id, item4_amount, item5_id, item5_amount, item6_id, item6_amount, item7_id, item7_amount, item8_id, item8_amount, item9_id, item9_amount, item10_id, item10_amount],
        (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).send(`Cart created with for ${results.rows[0].user_id} with ID ${results.rows[0].cart_id}`)
        }
    )
}

const updateCart = (request, response) => {
    const cart_id = parseInt(request.params.id)
    const {user_id, item1_id, item1_amount, item2_id, item2_amount, item3_id, item3_amount, item4_id, item4_amount, item5_id, item5_amount, 
        item6_id, item6_amount, item7_id, item7_amount, item8_id, item8_amount, item9_id, item9_amount, item10_id, item10_amount} = request.body

    dblogin.pool.query(
        'UPDATE carts SET item1_id =$1, item1_amount = $2 , item2_id = $3, item2_amount =$4, item3_id =$5, item3_amount =$6, item4_id =$7, item4_amount = $8, item5_id = $9, item5_amount = $10, item6_id = $11, item6_amount =$12, item7_id = $13, item7_amount = $14, item8_id = $15, item8_amount = $16, item9_id = $17, item9_amount = $18, item10_id = $19, item10_amount = $20 WHERE cart_id = $21',
        [item1_id, item1_amount, item2_id, item2_amount, item3_id, item3_amount, item4_id, item4_amount, item5_id, item5_amount, item6_id, item6_amount, item7_id, item7_amount, item8_id, item8_amount, item9_id, item9_amount, item10_id, item10_amount, cart_id],
        (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).send(`Cart modified with ID: ${cart_id}`)
        }
    )
}

const deleteCart = (request, response) => {
    const cart_id = parseInt(request.params.id)
    dblogin.pool.query('DELETE FROM carts WHERE cart_id = $1', [cart_id], (error, results) => {
        if (error) {
            throw error
        }
        return response.status(200).send(`Cart deleted with ID: ${cart_id}`)
    })
    
}


module.exports = {
    getAllCarts,
    getCart,
    createCart,
    updateCart,
    deleteCart
}