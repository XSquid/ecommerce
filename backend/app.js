const express = require('express')
const session = require('express-session');
const bodyParser = require('body-parser')
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


//Check if user is logged in/authorized on passport. Passport will create the req.user object, if true they are logged in.
const loggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect('/login')
  };
};

app.use(cors());
app.use(session({
  secret: "cats",
  resave: false,
  saveUninitialized: false
}));


app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
)
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user.user_id) //make sure id is same as the column in database
});

passport.deserializeUser((id, done) => {
  dblogin.pool.query('SELECT * FROM users WHERE user_id = $1', [id], (error, users) => {
    if (error) return done(error)
    done(null, users.rows[0]);
  })
});

// callback function done is used to supply an authenticated user to passport
//logic within the anon function: 1. verify login details in the callback function 2. if login details valid then done callback function invoked, user is authenticated
// 3. user is not authenticated, pass false into callback function
//done takes two arguments, error and user. error null if no error, user is either user or false if no user found
passport.use(new LocalStrategy(function (username, password, done) {

  dblogin.pool.query('SELECT * FROM users WHERE username = $1', [username], (error, user) => { //select the row where the username is the same as submitted
    if (error) return done(error);
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

app.post('/register/create', users.createUser, function (req, res) {
  res.redirect('/login')
})


app.get("/profile/edit/:id", (req, res) => { //not quite how i want it, should add a check to make sure :id is same as user id
  res.render("profile_edit.ejs", { user: req.user });
});

app.get("/profile/:id", (req, res) => {
  res.render("profile.ejs", { user: req.user });
});

app.post('/profile/edit/:id', loggedIn, users.updateUser) // Update user, add auth check
app.post('/profile/edit/:id/delete', loggedIn, users.deleteUser) //Delete user, add auth check

app.get('/logout', function (req, res, next) {
  console.log(`Logging out ${req.user.username}`)
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

app.get('/users', users.getUsers) // need to add authorization to these

//product CRUD begin here

app.get('/products', products.getProducts,
  function (req, res, next) {
    res.render('products.ejs')
  })

app.get('/products/search', products.categorySearch)

app.get('/products/:id', products.getProductById)
app.post('/products/createNew', products.createProduct) //add authorization
app.put('/products/:id', products.updateProduct) // add authorization
app.delete('/products/:id', products.deleteProduct) // add authorization

//carts and orders

app.get('/carts', carts.getAllCarts)
app.get('/cart/:id', carts.getCart)
app.post('/cart/create', carts.createCart)
app.post('/cart/edit/:id', carts.updateCart)
app.post('/cart/delete/:id', carts.deleteCart)
app.post('/cart/:id/checkout', checkout.checkoutCart)
app.get('/order/:id', order.getOrder)

// basic

app.post('/login/password',
  passport.authenticate('local', { failureRedirect: '/login', failureMessage: true }),
  function (req, res) {
    console.log(req.user)
    res.redirect('/profile/' + req.user.user_id);
  });

app.use('/', function (req, res, next) {
  res.render('index')
})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


// user for ecommerce db username = 'ecommerce' password = 'password'