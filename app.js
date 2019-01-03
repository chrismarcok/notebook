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

// connect to mongoose. its a promise, so we must catch it
mongoose.connect('mongodb://localhost/notebook-dev', {
  useNewUrlParser: true
})
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));


//Load Note Model
require('./models/Notes');
const Note = mongoose.model('notes');

const app = express();
const port = 5000;

//Handlebars middleware, telling system we want to use handlebars template layout
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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

//Idea index page
app.get('/notes', (req, res) => {
  //look for ALL notes in the db, sort them by date and render
  Note.find({})
    .sort({ date: 'desc' })
    .then(notes => {
      res.render("notes/index", {
        notes: notes
      });
    });
});

//Add note form
app.get('/notes/add', (request, response) => {
  response.render("notes/add");
});

//Edit Note form
app.get('/notes/edit/:id', (req, res) => {
  Note.findOne({
    _id: req.params.id
  })
    .then(note => {
      res.render("notes/edit", {
        note: note
      });
    });

});

//Process Form
app.post("/notes", (req, res) => {
  let errors = [];
  if (!req.body.title) {
    errors.push({ text: 'A Title Is Required.' });
  }
  if (!req.body.details) {
    errors.push({ text: 'Alan Please Add Details.' });
  }
  if (errors.length > 0) {
    res.render('notes/add', {
      //pass to notes/add the errors, the title, and the details that were given.
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details
    };
    new Note(newUser)
      .save()
      .then(note => {
        req.flash("success_msg", "Note Created");
        res.redirect('/notes');
      });
  }
});

// Edit form process
app.put('/notes/:id', (req, res) => {
  // Find one entry with _id = id, then take that note and put in new title and details.
  Note.findOne({
    _id: req.params.id
  })
    .then(note => {
      // Using the new values
      note.title = req.body.title,
        note.details = req.body.details
      note.save()
        .then(note => {
          req.flash("success_msg", "Note Edited");
          res.redirect('/notes');
        })
    });
});

//Deleting notes
app.delete('/ideas/:id', (req, res) => {
  Note.remove({ _id: req.params.id })
    .then(() => {
      req.flash("success_msg", "Note Removed");
      res.redirect('/notes');
    })
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});