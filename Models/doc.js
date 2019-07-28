const mongoose = require('mongoose');

const schema = mongoose.Schema({
    url : String,
    title : String,
    headers2 : [String],
    headers3 : [String],
    contents : [String],
    links : [String]
})

let model = mongoose.model('documents', schema);
module.exports.doc = model ;
