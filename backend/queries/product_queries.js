const dblogin = require('../database');

const getProducts = (request, response) => {
    dblogin.pool.query('SELECT * FROM products ORDER BY product_id ASC', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows);
    })
}

const getProductById = (request, response) => {
    const id = parseInt(request.params.id)
    dblogin.pool.query('SELECT * FROM products WHERE product_id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const getProductByType = (request, response) => {
    const type = (request.params.type)
    dblogin.pool.query('SELECT * FROM PRODUCTS WHERE type = $1' , [type], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}


const createProduct = (request, response) => {
    const { product_name, price, stock_amount, category } = request.body

    dblogin.pool.query('INSERT INTO products ( product_name, price, stock_amount, category) VALUES ($1, $2, $3, $4) RETURNING *', [ product_name, price, stock_amount, category], (error, results) => {
        if (error) {
            throw error
        }
        response.status(201).send(`Product added with ID: ${results.rows[0].product_id}`)
    })
}

const updateProduct = (request, response) => {
    const product_id = parseInt(request.params.id)
    const { product_name, price, stock_amount } = request.body

    dblogin.pool.query(
        'UPDATE products SET product_name = $1, price = $2, stock_amount = $3 WHERE product_id = $4',
        [product_name, price, stock_amount, product_id],
        (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).send(`Product modified with ID: ${product_id}`)
        }
    )
}

const deleteProduct = (request, response) => {
    const product_id = parseInt(request.params.id)

    dblogin.pool.query('DELETE FROM products WHERE product_id = $1', [product_id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send(`Product deleted with ID: ${product_id}`)
    })
}

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductByType
}