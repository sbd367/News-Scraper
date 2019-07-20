var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
var ArticleSchema = new Schema({
    Headline:{
        type: String,
        required: false
    },
    Summary:{
        type: String,
        required: false
    },
    URL:{
        type: String,
        required: false
    }
});

var Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;