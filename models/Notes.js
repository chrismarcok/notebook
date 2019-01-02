const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create schema

const NoteSchema = new Schema({
  title:{
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

//mongoose's model with name "notes" is now the NoteSchema
mongoose.model('notes', NoteSchema);