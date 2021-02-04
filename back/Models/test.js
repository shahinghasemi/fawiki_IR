const mongoose = require('mongoose');


const schema = mongoose.Schema({
    text : {
        type: String,
        unique: true
    }
})

module.exports.test = mongoose.model('test', schema);