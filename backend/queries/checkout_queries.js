const dblogin = require('../database');

const checkoutCart = async (request, response) => {
    const cart_id = parseInt(request.params.id)
    const {order_total} = request.body;
    const paymentSuccess = true;




    //Load data from the database, not using data from the submit. Exception is the order total, which should be saved on the database, but I did not do it like that for
    // this project. I should probably revist and change it at a later date.
    dblogin.pool.query('SELECT * FROM cart_test WHERE cart_id = $1', [cart_id], (error, results) => {
        if (error) {
            throw error
        }
        let order_cart_id = results.rows[0].cart_id;
        let order_user_id = results.rows[0].user_id;
        let order_contents = results.rows[0].contents


        dblogin.pool.query('SELECT funds FROM users WHERE user_id = $1', [order_user_id], (error, results) => {
            if (error) {
                throw error
            }
            let availableFunds = results.rows[0].funds
            
            if (availableFunds >= order_total) {

                dblogin.pool.query('INSERT INTO orders (user_id, contents, cart_id, total) VALUES ($1, $2, $3, $4)', 
                    [order_user_id, order_contents, order_cart_id, order_total], (error, results) => {
                        if (error) {
                            throw error
                        }
                        //Updating the cart to completed = true, so it will not be displayed as an active cart
                        dblogin.pool.query('UPDATE cart_test SET completed = true WHERE cart_id = $1', [order_cart_id], (error, results) => {
                            if (error) {
                                throw error
                            }
                            dblogin.pool.query('INSERT INTO cart_test (user_id) VALUES ($1)', [order_user_id], (error, results) => {
                                if (error) {
                                    console.log(`Error: ${error.detail}`)
                                    response.sendStatus(500)
                                    return null
                                }
                                dblogin.pool.query('UPDATE users SET funds = funds - $1 WHERE user_id = $2 RETURNING funds', [order_total, order_user_id], (error, results) => {
                                    if (error) {
                                        throw error
                                    }
                                    console.log(`Order placed for cart id: ${order_cart_id}, new cart created`)
                                    return response.status(201).json(results.rows[0].funds)
                                })
                                

                            })
                        })
                        
                    })

            } else {
                return response.status(422).send({message: 'Insufficient funds available'})
            }

        })


    })
}

module.exports = {
    checkoutCart
}