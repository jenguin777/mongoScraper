var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

// morgan is used for automated logging of requests, responses and related data. When added as a middleware to an express/connect app, by default it should log statements to stdout showing details of: remote ip, request method, http version, response status

// Our scraping tools --> moved this section to scrape in index.js
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
// var axios = require("axios");
// var cheerio = require("cheerio");

// Require all models --> don't think I need this, not called in this file
// var db = require("./models");

var PORT = process.env.PORT || 3001;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Make public a static folder
app.use(express.static("public"));

// Set handlebars as the default templating engine
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Import routes and give the server access to them.
require("./routes/index.js")(app);
require("./routes/article.js")(app);

// Connect to the Mongo DB
// var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// need , { useNewUrlParser: true } because current URL string parser is deprecated and will be removed in a future version
// mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// This is what it was in the activity gitLab Unsolved folder:
mongoose.connect("mongodb://localhost/mongoHeadlines", { useNewUrlParser: true });

// Start the server
app.listen(PORT, function() {
	console.log("App running on port " + PORT + "!");
});
