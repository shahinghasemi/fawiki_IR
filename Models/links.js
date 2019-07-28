const mongoose = require('mongoose');

const schema = mongoose.Schema({
    url : String, 
    visited : Boolean,
})

module.exports.link = mongoose.model('links', schema);