require('dotenv').config();
let express = require('express');
let logger = require('morgan');
let mongoose = require('mongoose');
let axios = require('axios');
let cheerio = require('cheerio');
var mongojs = require('mongojs')
var db = require('./models');

var PORT = process.env.PORT || 8080;
var app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
if(process.env.PORT){
    var MONGODB_URI = process.env.URL
    mongoose.connect(MONGODB_URI, { dbName: 'test' });
}else{
    MONGODB_URI = "mongodb://localhost/mongoHeadlines";
    mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
}

//routes here
app.post("/sendSome", (req, res) => {
    axios.get(`https://www.foxnews.com/category/us/us-regions/${req.body.region}`).then( response => {
        var result = [];
        var $ = cheerio.load(response.data);

        $('main.main-content h4.title').each( (i, element) => {
            let resultB = {};
            resultB.Headline = $(element).text();

            resultB.URL = $(element)
            .children('a')[0].href;

            resultB.Summary = $(element)
            .parent()
            .parent()
            .children("div.content")
            .children().children().text();

            result.push(resultB);    
        });

        db.NYT_articles.create(result)
        .then( () =>{
            res.end();
        }).catch( err => {
            console.warn(err);
        });
    });
});

app.get("/getArticles", (req, res) => {
    db.NYT_articles.find({}, (err, data) => {
        if(err) console.warn(err);
        else res.json(data)
    });
});

app.get("/resetArticles", (req, res) => {

    db.NYT_articles.deleteMany({}, (err, data)=>{
        if(err) console.warn(err)
        else res.json(data)
    });
});

app.get("/getArticle/:id", (req, res) => {

    db.NYT_articles.find({_id: mongojs.ObjectId(req.params.id)}, (err, data) => {
        if(err) console.warn(err);
        else res.json(data)
    });
});

app.get("/getSaved", (req, res) => {
    db.Saved_Articles.find({"deleted": false}, (err, data) => {
        if(err) console.warn(err);
        else res.json(data)
    });
});

app.post("/addSaved", (req, res) => {
    db.Saved_Articles.create(req.body)
});

app.post("/addComment/:id", (req, res) => {
    db.Saved_Articles.findOneAndUpdate({_id: mongojs.ObjectID(req.params.id)}, {$push: req.body}, (err, data)=>{
        if(err) console.warn(err)
        else console.log(data);
    });
    res.end();
});

app.get("/deleteSaved/:id", (req, res) => {
    db.Saved_Articles.updateOne({_id: mongojs.ObjectID(req.params.id)}, {$set:{"deleted": true}}, (err, data) =>{
        if(err) console.warn(err)
    }).catch(err => {
        console.warn(err);
    });
    res.end();
});

app.listen(PORT, () => {
    console.log("App running on port " + PORT + "!");
});