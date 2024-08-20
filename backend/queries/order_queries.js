const dblogin = require('../database');

const getOrder = (request, response) => {
    const order_id = parseInt(request.params.id)
    dblogin.pool.query('SELECT * FROM orders WHERE order_id = $1', [order_id], (error, results) => {
        if (error) {
            throw error
        }
        return response.status(200).json(results.rows)
    })

}


const getUserOrders = (request, response) => {
    const user_id = parseInt(request.params.id)
    dblogin.pool.query('SELECT * FROM orders WHERE user_id = $1', [user_id], (error, results) => {
        if (error) {
            throw error
        }
        return response.status(200).json(results.rows)
    })
}

module.exports = {
    getOrder,
    getUserOrders
}