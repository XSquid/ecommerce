const express = require('express')
const session = require('express-session');
const bodyParser = require('body-parser')
const app = express();
const port = 3000
const users = require('./user_queries')
const products = require('./product_queries')
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const dblogin = require('./database');

/* var crypto = require('crypto');
const db = require('./database');

passport.use(new LocalStrategy(function verify(username, password, cb) {
  app.get('SELECT * FROM users WHERE username = ?', [username], function(err, user) {
    if (err) { return cb(err) ;}
    if (!user) { return cb(null, false, {message: 'Incorrect username or password'}) ;}

    crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
      if (err) {return cb(err);}
      if (!crypto.timingSafeEqual(user.hased_password, hashedPassword)) {
        return cb(null, false, {message: 'Incorrect username of password' });
      }
      return cb(null,user)
    });
  });
})); */

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

passport.deserializeUser(async (id, done) => {
  await dblogin.pool.query('SELECT * FROM users WHERE user_id = $1', [id], (error, users) => {
    if (error) return done(error)
    done(null, users.rows[0]);
  })
});

// callback function done is used to supply an authenticated user to passport
//logic within the anon function: 1. verify login details in the callback function 2. if login details valid then done callback function invoked, user is authenticated
// 3. user is not authenticated, pass false into callback function
//done takes two arguments, error and user. error null if no error, user is either user or false if no user found
passport.use(new LocalStrategy(async function (username, password, done) {
  await dblogin.pool.query('SELECT * FROM users WHERE username = $1', [username], (error, user) => { //select the row where the username is the same as submitted
    if (error) return done(error);
    if (!user.rows[0]) return done(null, false) //if there is no row, aka no username was not found, return false
    if (user.rows[0].password != password) {
      console.log('Wrong Password')
      return done(null, false); //if password is wrong return false
    }
    return done(null, user.rows[0]) //if username and password match, return the row of data
  });
}));


app.set('view engine', 'ejs');

app.get('/login',
  function (req, res, next) {
    res.render('login');
  }
);




app.get("/profile", (req, res) => {
  res.render("profile", { user: req.user });
});


app.get('/users', users.getUsers) // need to add authorization to these
app.get('/profile/:id', users.getUserById)
app.post('/register', users.createUser)
app.put('/users/:id', users.updateUser)
app.delete('/users/:id', users.deleteUser)

app.get('/products', products.getProducts)
app.get('/products/:id', products.getProductById)
app.post('/products', products.createProduct) //add authorization
app.put('/products/:id', products.updateProduct) // add authorization
app.delete('/products/:id', products.deleteProduct) // add authorization

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