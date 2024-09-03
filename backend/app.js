const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const port = 3000
const users = require('./queries/user_queries')
const products = require('./queries/product_queries')
const carts = require('./queries/cart_queries')
const checkout = require('./queries/checkout_queries')
const order = require('./queries/order_queries')
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const dblogin = require('./database');
const bcrypt = require('bcrypt')
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const verifyJWT = require('./controllers/verifyJWT')
const cookieParser = require('cookie-parser')
const corsOptions = require('./config/corsOptions')
const credentials = require('./config/credentials')

//Check if user is logged in/authorized on passport. Passport will create the req.user object, if true they are logged in.
const loggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    console.log('failed')
    res.redirect('/login')
  };
};

app.use(credentials)
app.use(cors(corsOptions));

app.use(session({
  secret: "cats",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use(bodyParser.json())

//middleware to handle urlencoded form data
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
)

//middleware for cookies
app.use(cookieParser())

// callback function done is used to supply an authenticated user to passport
//logic within the anon function: 1. verify login details in the callback function 2. if login details valid then done callback function invoked, user is authenticated
// 3. user is not authenticated, pass false into callback function
//done takes two arguments, error and user. error null if no error, user is either user or false if no user found
passport.use(new LocalStrategy(function (username, password, done) {

  dblogin.pool.query('SELECT * FROM users WHERE username = $1', [username], (error, user) => { //select the row where the username is the same as submitted
    if (error) return done(error)
    if (!user.rows[0]) return done(null, false) //if there is no row, aka no username was not found, return false
    const hash = user.rows[0].password
    bcrypt.compare(password, hash, function (err, result) {
      if (!result) {
        console.log('Wrong Password')
        return done(null, false); //if password is wrong return false
      } else {
        return done(null, user.rows[0])
      }
    });
  });
}));

app.use(passport.initialize());
app.use(passport.session());



passport.serializeUser((user, done) => {
  console.log(`Serialize user: ${user.user_id}`)
  done(null, user.user_id) //make sure id is same as the column in database
});

passport.deserializeUser((id, done) => {
  console.log(`Deserialize user: ${id}`)
  dblogin.pool.query('SELECT * FROM users WHERE user_id = $1', [id], (error, users) => {
    if (error) { return done(error)}
    done(null, users.rows[0]);
  })
});


app.set('view engine', 'ejs');

// app.get('/login',
//   function (req, res, next) {
//     res.render('login');
//   }
// );

// app.get('/register',
//   function (req, res, next) {
//     res.render('register.ejs')
//   }
// )

//Used when creating new users
app.post('/register/create', users.createUser )// **Sanitize the input


// app.get("/profile/edit/:id", (req, res) => { // No longer needed, this was just for early testing the backend
//   res.render("profile_edit.ejs", { user: req.user });
// });

// app.get("/profile/:id", (req, res) => {  // No longer needed, this was just for early testing the backend
//   res.render("profile.ejs", { user: req.session.user });
// });

//Update user
app.post('/profile/edit/:id', verifyJWT, users.updateUser)

//Delete user
app.post('/profile/delete/:id', verifyJWT, users.deleteUser) //Delete user


// // No longer needed, this was just for early testing the backend
// app.get('/logout', function (req, res, next) {
//   console.log(`Logging out ${req.user.username}`)
//   req.logout(function (err) {
//     if (err) { return next(err); }
//     res.redirect('/');
//   });
// });

app.get('/users', users.getUsers) //Not really needed anymore, unless as admin tool.


//Used only for loading the funds available on profile page
app.get('/user/:id', verifyJWT, users.getUserById)

//Used for adding funds to user account
app.post('/user/:id/editFunds', verifyJWT, users.editUserFunds)

//product CRUD begin here

//Used in cart to reference items
app.get('/products', products.getProducts)

//Used when selecting individual products
app.get('/product/:id', products.getProductById)

//Used when searching for different product types in /products
app.get('/products/:type', products.getProductByType)

//Currently unused - Would be used by admin to create/update/delete products directly on website
app.post('/products/createNew', products.createProduct) //add authorization
app.put('/product/:id', products.updateProduct) // add authorization
app.delete('/product/:id', products.deleteProduct) // add authorization

//carts and orders

//Unused, would be admin tool
app.get('/carts', carts.getAllCarts)

//Used to load user cart
app.get('/cart/:id', verifyJWT, carts.getCart)

//Will now be used when placing an order, may just use the carts.createCart method instead of the call.
app.post('/cart/create', carts.createCart)

//Used for removing individual items from carts
app.post('/cart/remove/:id', verifyJWT, carts.updateCart) 

//Used when adding items to cart
app.post('/cart/add/:id', verifyJWT, carts.addToCart)

// No longer used, when carts are deleted the contents are now set to empty instead
// app.post('/cart/delete/:id', carts.deleteCart)


app.post('/cart/:id/checkout', checkout.checkoutCart)

app.get('/orderhistory/:id', verifyJWT, order.getUserOrders)
app.get('/order/:id', verifyJWT, order.getOrder)

// basic

//Logging in, authenticating and sending a JWT to user for accessToken
app.post('/login/password',
  passport.authenticate('local', { 
    failureRedirect: '/error', 
    failureMessage: true }),
  function (req, res) {
    const accessToken = jwt.sign(
      {"username" : req.user.username},
      process.env.ACCESS_TOKEN_SECRET,
      {expiresIn: "1h"}
    );
    res.cookie('jwt', {httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000});
    const userData = req.user
    res.json({accessToken, userData})

    console.log(req.user)
  });

app.post('/logout', (req, res) => {
  
    req.logout(function (err) {
    if (err) { return next(err); }
    req.session.destroy();
    console.log('logging out')
  });
  res.sendStatus(202);
})

app.use('/error', function (req, res, next) {
  res.sendStatus(401);
})

app.use('/', function (req, res, next) {
  res.render('index')
})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


// user for ecommerce db username = 'ecommerce' password = 'password'