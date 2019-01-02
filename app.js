// Our app is an express app, bring in express with this.
// We use nodemon to constantly update our server whenever we make changes
const express = require('express');

//Handlebars is used to create our HTML
const exphbs = require("express-handlebars");

const app = express();
const port = 5000;

//Handlebars middleware, telling system we want to use handlebars template layout
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


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

app.get('/about', (request, response) => {
  response.render("about");
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});