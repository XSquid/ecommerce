const dblogin = require('./database');

const getUsers = (request, response) => {
    dblogin.pool.query('SELECT * FROM users ORDER BY user_id ASC', (error, results) => {
        if (error) {
            throw error
        }
        return response.status(200).json(results.rows)
    })
}

const getUserById = (request, response) => {
    const id = parseInt(request.params.id)

    dblogin.pool.query('SELECT * FROM users WHERE user_id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        return response.status(200).json(results.rows)
    })
}

const createUser = (request, response) => {
    const { username, password, address, email } = request.body

    dblogin.pool.query('INSERT INTO users (username, password, address, email) VALUES ($1, $2, $3, $4) RETURNING *', [username, password, address, email], (error, results) => {
        if (error) {
            throw error
        }
        return response.status(201).send(`User added with ID: ${results.rows[0].user_id}`)
    })
}

const updateUser = (request, response) => {
    const user_id = parseInt(request.params.id)
    const { username, password, address, email } = request.body

    dblogin.pool.query(
        'UPDATE users SET username = $1, password = $2, address = $3, email = $4 WHERE user_id = $5',
        [username, password, address, email, user_id],
        (error, results) => {
            if (error) {
                throw error
            }
            return response.status(200).send(`User modified with ID: ${user_id}`)
        }
    )
}

const deleteUser = (request, response) => {
    const user_id = parseInt(request.params.id)

    dblogin.pool.query('DELETE FROM users WHERE user_id = $1', [user_id], (error, results) => {
        if (error) {
            throw error
        }
        return response.status(200).send(`User deleted with ID: ${user_id}`)
    })
}


module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
}