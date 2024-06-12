const Pool = require('pg').Pool
const pool = new Pool({
  user: 'ecommerce',
  host: 'localhost',
  database: 'ecommerce',
  password: 'password',
  port: 5432,
})

module.exports = {pool};