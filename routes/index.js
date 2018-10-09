//Dependencies
var express = require("express");
var db = require("../models");

// Initialize Express
var app = express();

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
	// app.get("/", function(req, res) {
	// Find all articles
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
		// 	console.log("This is the promise and catch Jen added");
		});
		// }).catch(function(err) {
		// 	// If an error occurred, send it to the client
		// 	return res.json(err);
		// });

		// If we were able to successfully scrape and save an Article, send a message to the client
		res.send("Scrape Complete");
	});
});

module.exports = app;