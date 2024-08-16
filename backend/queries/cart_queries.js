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
    const user_id = parseInt(request.params.id)
    dblogin.pool.query('SELECT * FROM cart_test WHERE user_id = $1', [user_id], (error, results) => {
        if (error) {
            throw error
        }
        return response.status(200).json(results.rows)

    })
}

// const createCart = (request, response) => {
//     const {user_id, item1_id, item1_amount, item2_id, item2_amount, item3_id, item3_amount, item4_id, item4_amount, item5_id, item5_amount, 
//         item6_id, item6_amount, item7_id, item7_amount, item8_id, item8_amount, item9_id, item9_amount, item10_id, item10_amount} = request.body
//     dblogin.pool.query('INSERT INTO carts (user_id, item1_id, item1_amount, item2_id, item2_amount, item3_id, item3_amount, item4_id, item4_amount, item5_id, item5_amount, item6_id, item6_amount, item7_id, item7_amount, item8_id, item8_amount, item9_id, item9_amount, item10_id, item10_amount) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21) RETURNING *',
//         [user_id, item1_id, item1_amount, item2_id, item2_amount, item3_id, item3_amount, item4_id, item4_amount, item5_id, item5_amount, item6_id, item6_amount, item7_id, item7_amount, item8_id, item8_amount, item9_id, item9_amount, item10_id, item10_amount],
//         (error, results) => {
//             if (error) {
//                 throw error
//             }
//             response.status(200).send(`Cart created with for ${results.rows[0].user_id} with ID ${results.rows[0].cart_id}`)
//         }
//     )
// }

const createCart = (request, response) => {
    const { cartContents } = request.body
}


//should update the errors, possible errors for this
const updateCart = async (request, response) => {
    const cart_id = parseInt(request.params.id)
    const { product_id } = request.body
    let array
    let returnArray
    dblogin.pool.query(
        'SELECT contents FROM cart_test WHERE cart_id = $1', [cart_id], (error, results) => {
            if (error) {
                throw error
            }
            let holderArray = results.rows[0].contents;
            array = holderArray.filter((el) => !el[0].includes(product_id))
            returnArray = array.map(e => [parseInt(e[0]), parseInt(e[1])])

            dblogin.pool.query(
                'UPDATE cart_test SET contents = $1 WHERE cart_id = $2 RETURNING contents', [returnArray, cart_id], (error, results) => {
                    if (error) {
                        throw error
                    }
                    console.log(`Updated cart ${cart_id} by removing item ID ${product_id}`)
                    return response.status(201).json(results.rows[0])
                }
            )

        }
    )
}

const addToCart = async (request, response) => {
    const user_id = parseInt(request.params.id);
    const { product_id, quantity } = request.body
    dblogin.pool.query('SELECT * FROM cart_test WHERE user_id = $1 AND completed = false', [user_id], (error, results) => {
        if (error) {
            throw error
        }
        if (results.rows.length > 1) {
            return console.log('Multiple active carts')
        }

        const data = results.rows[0].contents

        //Check if item is already in the cart
        let check = false
        if (data !== null) { //Checking for an empty/new cart. Null value given to new carts content when account is created
            data.forEach(el => {
                if (el[0].includes(product_id)) {
                    console.log(`${el[0]} Already in`)
                    check = true
                }
            })
        }

        //If the item is already in the cart
        if (!check) {
            const cart_id = results.rows[0].cart_id
            if (data !== null) { //Checking for an empty/new cart. Null value given to new carts content when account is created
                userCart = data.map(e => [parseInt(e[0]), parseInt(e[1])])
            } else {
                userCart = [];
            }
            userCart.push([product_id, quantity])

            dblogin.pool.query('UPDATE cart_test SET contents = $1 WHERE cart_id = $2', [userCart, cart_id], (error, results) => {
                if (error) {
                    throw error
                }
                console.log(`Added item ${product_id} quantity ${quantity} to cart ${cart_id}`)
                return response.status(201)
            })
        }
    })
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
    deleteCart,
    addToCart
}