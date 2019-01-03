const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create schema

const UserSchema = new Schema({
  name:{
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

//mongoose's model with name "notes" is now the NoteSchema
mongoose.model('users', UserSchema);