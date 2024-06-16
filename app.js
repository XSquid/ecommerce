const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const users = require ('./user_queries')
const products = require ('./product_queries')


app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
app.set('view engine', 'ejs');



app.get('/users', users.getUsers) // need to add authorization to these
app.get('/users/:id', users.getUserById)
app.post('/register', users.createUser)
app.put('/users/:id', users.updateUser)
app.delete('/users/:id', users.deleteUser)

app.get('/products', products.getProducts) 
app.get('/products/:id', products.getProductById)
app.post('/products', products.createProduct) //add authorization
app.put('/products/:id', products.updateProduct) // add authorization
app.delete('/products/:id', products.deleteProduct) // add authorization

app.use('/', function (req, res, next) {
  res.render('index')
  next();
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


// user for ecommerce db username = 'ecommerce' password = 'password'