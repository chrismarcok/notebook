// Our app is an express app, bring in express with this.
const express = require('express');

//Handlebars is used to create our HTML
const exphbs = require("express-handlebars");

// Mongoose to connect to our db
const mongoose = require("mongoose");

//Body-parser to parse the information from forms
const bodyParser = require("body-parser");

//Method-override for making put requests (updating DB)
const methodOverride = require('method-override');

// Connect-flash for flash messages
const flash = require("connect-flash");

//express-session for auth
const session = require("express-session");

const path = require("path");

// connect to mongoose. its a promise, so we must catch it
mongoose.connect('mongodb://localhost/notebook-dev', {
  useNewUrlParser: true
})
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));


//Load Routes
const notes = require('./routes/notes');
const users = require('./routes/users');

const app = express();
const port = 5000;

//Handlebars middleware, telling system we want to use handlebars template layout
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static folder. set public folder to be the express static folder.
app.use(express.static(path.join(__dirname, "public")));

// methodOverride middleware
app.use(methodOverride('_method'));

// Express session middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// Flash middleware
app.use(flash());

// Global Variables
app.use(function(req, res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});


// Middleware functions are functions that have access to the request and response objects, and the next middleware function in the application requiest response cycle.

// Index Route. When there is an HTTP request for the index page, we can use the resposne to send things back to the browser
app.get('/', (request, response) => {
  const title = "Welcome";

  // Look for index.handlebars in views folder by default. We have defined the defaultLayout for handlebars to be "main.handlebars". this document wraps every document in that HTML.
  response.render("index",
    // We can add data to our render via json. Can use {{title}} to get the data stored within it in index.handlebars
    {
      title: title
    });
});

app.get('/about', (req, res) => {
  res.render("about");
});



// Use our routes
app.use('/notes', notes);
app.use('/users', users);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});