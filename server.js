var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");

// turn on debugging so you can see what's being sent to mongodb
mongoose.set("debug", true);

// morgan is used for automated logging of requests, responses and related data. When added as a middleware to an express/connect app, by default it should log statements to stdout showing details of: remote ip, request method, http version, response status

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
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Import routes and give the server access to them.
require("./routes/index.js")(app);
require("./routes/article.js")(app);

// Connect to the Mongo DB - uncomment this once .env is setup and working
// var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Connect to local mongodb
mongoose.connect("mongodb://localhost/mongoHeadlines", { useNewUrlParser: true });

// Start the server
app.listen(PORT, function() {
	console.log("App running on port " + PORT + "!");
});
