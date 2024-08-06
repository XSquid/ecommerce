const dblogin = require('../database');

const getOrder = async (request, response) => {
    const order_id = parseInt(request.params.id)
    await dblogin.pool.query('SELECT * FROM orders WHERE order_id = $1', [order_id], (error, results) => {
        if (error) {
            throw error
        }
        return response.status(200).json(results.rows)
    })

}

module.exports = {
    getOrder
}