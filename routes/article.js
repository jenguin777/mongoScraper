//Dependencies
var express = require("express");
var db = require("../models");

// Initialize Express
var app = express();

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

module.exports = app;