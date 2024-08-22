const dblogin = require('../database');
const bcrypt = require("bcrypt");

const saltRounds = 10


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
    const saltRounds = 10
    const { username, password, address, email } = request.body

    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {

            dblogin.pool.query('INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *', [username, hash, email], (error, results) => {
                if (error) {
                    console.log(`Error: ${error.detail}`)
                    response.sendStatus(400)
                    return null
                }
                const user_id = (results.rows[0].user_id)
                console.log(`Created user with username: ${username}`)
                dblogin.pool.query('INSERT INTO cart_test (user_id) VALUES ($1)', [user_id], (error, results) => {
                    if (error) {
                        console.log(`Error: ${error.detail}`)
                        response.sendStatus(400)
                        return null
                    }
                    console.log(`Created empty cart for user ${username}`)
                })
                response.sendStatus(201)
            })

        });
    });


}

const editUserFunds = (request, response) => {
    const user_id = parseInt(request.params.id)
    const {fundsToAdd} = request.body
    console.log(fundsToAdd)

    dblogin.pool.query('UPDATE users SET funds = funds + $1 WHERE user_id = $2 RETURNING funds', [fundsToAdd, user_id],
        (error, results) => {
            if (error) {
                throw error
            }
            console.log(results.rows[0].funds)
            return response.status(201).json(results.rows[0].funds)
        }
    )
}

const updateUser = (request, response) => {
    const user_id = parseInt(request.params.id)
    const {username, password, address, email } = request.body

    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {

            dblogin.pool.query(
                'UPDATE users SET username = $1, password = $2, address = $3, email = $4 WHERE user_id = $5',
                [username, hash, address, email, user_id],
                (error, results) => {
                    if (error) {
                        throw error
                    }
                    console.log(`User modified with ID: ${user_id}`)
                    return response.status(200).redirect('/login')
                }
            )

        });
    });


}

const deleteUser = (request, response) => {
    const user_id = parseInt(request.params.id)
    request.logout(function (err) {
        if (err) { return next(err); }
        response.redirect('/');
      });
    dblogin.pool.query('DELETE FROM users WHERE user_id = $1', [user_id], (error, results) => {
        if (error) {
            throw error
        }
        console.log(`User deleted with ID: ${user_id}`)
        return response.status(200)
    })
}


module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    editUserFunds
}