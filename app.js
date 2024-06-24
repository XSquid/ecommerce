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
const bcrypt = require('bcrypt')


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

app.get('/login',
  function (req, res, next) {
    res.render('login');
  }
);

app.get('/register',
  function (req, res, next) {
    res.render('register.ejs')
  }
)



app.get("/profile/edit", (req, res) => {
  res.render("profile_edit.ejs", { user: req.user });
});

app.get("/profile/:id", (req, res) => {
  res.render("profile.ejs", { user: req.user });
});

app.post('/profile/edit/:id', users.updateUser)


app.get('/logout', function (req, res, next) {
  console.log(`Logging out ${req.user.username}`)
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});


app.get('/users', users.getUsers) // need to add authorization to these

app.post('/register/create', users.createUser, function (req, res) {
  res.redirect('/login')
})

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