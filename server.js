var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

// morgan is used for automated logging of requests, responses and related data. When added as a middleware to an express/connect app, by default it should log statements to stdout showing details of: remote ip, request method, http version, response status

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

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

// Connect to the Mongo DB
// var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// need , { useNewUrlParser: true } because current URL string parser is deprecated and will be removed in a future version
// mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// This is what it was in the activity gitLab Unsolved folder:
mongoose.connect("mongodb://localhost/mongoHeadlines", { useNewUrlParser: true });

// Routes

// A GET route for scraping the NPR website
app.get("/scrape", function(req, res) {
	// First, we grab the body of the html with axios
	axios.get("https://www.npr.org/").then(function(response) {
		// Then, we load that into cheerio and save it to $ for a shorthand selector
		var $ = cheerio.load(response.data);

		// Now, we grab every h3 within an article tag, and do the following:
		$("h3.title").each(function(i, element) {
			// Save an empty result object
			var result = {};

			// var title = $(element).parent().text();
			// var link = $(element).parent("a").attr("href");
			// var teaser = $(element).parent("a").siblings("a").children("p").text();

			// Add the text and href of every link, and the teaser, and save them as properties of the result object
			result.title = $(this)
				.parent("a")
				.text();
			result.link = $(this)
				.parent("a")
				.attr("href");
			result.teaser = $(this)
				.parent("a")
				.siblings("a")
				.children("p")
				.text();

			// Create a new Article using the `result` object built from scraping
			db.Article.create(result)
				.then(function(dbArticle) {
					// View the added result in the console
					console.log("This is the created dbArticle" + dbArticle);
				})
				.catch(function(err) {
					// If an error occurred, send it to the client
					return res.json(err); // this row is causing UnhandledPromiseRejectionWarning: Error: Can't set headers after they are sent.
				});
		// });
		// }).then(function() {
		// 	// View the added result in the console
		// 	console.log("This is the promise and catch Jen added");
		// })
		}).catch(function(err) {
			// If an error occurred, send it to the client
			return res.json(err);
		});

		// If we were able to successfully scrape and save an Article, send a message to the client
		res.send("Scrape Complete");
	});
});

// db.Burger.findAll({}).then(function(results){
// 	// results are available to us inside the .then
	
// 	res.render("index", { burgers: results });
	
// }).catch(function(error) {
// 	throw error;
// }); 


// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
	// TODO: Finish the route so it grabs all of the articles
	db.Article.find({})
		.then(function(article) {
			// res.json(article);
			res.render("index", { articles: article });
		})
		.catch(function(err) {
			// res.json(err);
			throw err;
		});
});

// Route for getting the saved articles - WIP
app.get("/savedArticles", function(req, res) {
	// TODO: Finish the route so it grabs all of the articles
	db.Article.find({})
		.then(function(article) {
			// res.json(article);
			res.render("index", { articles: article });
		})
		.catch(function(err) {
			// res.json(err);
			throw err;
		});
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
	// Find one article using the req.params.id,
	// and run the populate method with "note",
	// then responds with the article with the note included
	db.Article.findOne(
		{
			// Using the id in the url
			_id: req.params.id
		})
		.populate("note")
		.then(function(dbArticle) {
			res.json(dbArticle); 
		})
		.catch(function(err) {
			res.json(err);
		});
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
	// TODO
	// ====
	// save the new note that gets posted to the Notes collection
	// then find an article from the req.params.id
	// and update it's "note" property with the _id of the new note
	db.Note.create(req.body)
		.then(function(dbNote) {
			return db.Article.findOneAndUpdate({
				_id: req.params.id
			},
			{
				note: dbNote._id
			},
			{
				new: true
			}
			);
		})
		.then(function(dbArticle){
			res.json(dbArticle);
		})
		.catch(function(err) {
			res.json(err);
		});
});

// Start the server
app.listen(PORT, function() {
	console.log("App running on port " + PORT + "!");
});
