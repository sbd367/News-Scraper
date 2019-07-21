var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

var SavedSchema = new Schema({

    Headline:{
        type: String,
        required: true
    },

    Summary:{
        type: String,
        required: false
    },

    URL:{
        type: String,
        required: false
    },

    Comments:{
        type: Array,
        required: false
    },

    deleted:{
        type: Boolean,
        default: false
    }
});

var Saved = mongoose.model("Saved", SavedSchema);

// Export the Article model
module.exports = Saved;