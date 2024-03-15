var mongoose = require("mongoose");

const textSchema = new mongoose.Schema({
    text : {
        type : String,
        require : true
    },
    lang : {
        type : String,
        default : 'text',
        require : true
    }
})

const Texts = mongoose.model('texts',textSchema);
module.exports = Texts;