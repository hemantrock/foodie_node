const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name:String,  
  username: { type: String, unique: true },
  password: String,
  Wishlist: Array,
});

module.exports = mongoose.model('User', userSchema);
