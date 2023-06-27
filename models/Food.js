const mongoose = require('mongoose');

const reciepeSchema = new mongoose.Schema({
  title:String,  
  ingredients: String,
  instructions: String,
  image: String,
});

module.exports = mongoose.model('Reciepe', reciepeSchema);
