const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

//Load Note Model
require('../models/Notes');
const Note = mongoose.model('notes');

//Notes index page
router.get('/', (req, res) => {
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
router.get('/add', (req, res) => {
  res.render("notes/add");
});

//Edit Note form
router.get('/edit/:id', (req, res) => {
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
router.post("/", (req, res) => {
  let errors = [];
  if (!req.body.title) {
    errors.push({ text: 'A Title Is Required.' });
  }
  if (!req.body.details) {
    errors.push({ text: 'Alan Please Add Details.' });
  }
  if (errors.length > 0) {
    res.render('/add', {
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
      .then( () => {
        req.flash("success_msg", "Note Created");
        res.redirect('/notes');
      });
  }
});

// Edit form process
router.put('/:id', (req, res) => {
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
router.delete('/:id', (req, res) => {
  Note.remove({ _id: req.params.id })
    .then(() => {
      req.flash("success_msg", "Note Removed");
      res.redirect('/notes');
    })
});

module.exports = router;