// Our app is an express app, bring in express with this.
// We use nodemon to constantly update our server whenever we make changes
const express = require('express');

//Handlebars is used to create our HTML
const exphbs = require("express-handlebars");

// Mongoose to connect to our db
const mongoose = require("mongoose");

//Body-parser to parse the information from forms
const bodyParser = require("body-parser");

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
  //look for all notes in the db, sort them by date and render
  Note.find({})
  .sort({date:'desc'})
  .then( ideas => {
    res.render("notes/index", {
      ideas:ideas
    });
  });
  
});

//Add note form
app.get('/notes/add', (request, response) => {
  response.render("notes/add");
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
        res.redirect('/notes');
      });
  }
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});