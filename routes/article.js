//Dependencies
var express = require("express");
var router = express.Router();
var db = require("../models");

//-----------------------ARTICLES-----------------------//

// Route for displaying all saved articles from the db
router.get("/articles/saved/", function(req, res) {
	db.Article.find({saved: true})
		.then(function(article) {
			res.render("savedArticles", { articles: article });
		})
		.catch(function(err) {
			res.writeContinue(err);
		});
});


// Route for updating the article's saved status
router.post("/save-article/:id", function(req,res) {
	db.Article.findOneAndUpdate(
		{
			_id: req.params.id
		},
		{	
			$set: {saved: true}
		})
		.then(function(dbArticle) {
			// refetch after save
			res.json(dbArticle);
			// res.redirect("/");
		}) 
		.catch(function(err) {
			res.writeContinue(err);
		});
});
  
//delete route to remove a single article from savedArticles
router.post("/delete-from-saved/:id", function(req,res){
	db.Article.findOneAndUpdate(
		{
			_id: req.params.id
		},
		{	
			$set: {saved: false}
		})
		.then(function(response) {
			// Rerender saved articles
			res.redirect("/articles/saved/"); // Do not understand why this takes you back to the Home page rather than saved articles
		}) 
		.catch(function(err) {
			res.writeContinue(err);
		});  
});

//------------------------NOTES------------------------//

// Route for saving/updating an Article's associated Note
router.post("/articles/save-note/:id", function(req, res) {
	// save the new note that gets posted to the Notes collection
	// then find an article from the req.params.id
	// and update it's "note" property with the _id of the new note
	db.Note.create(req.body)
		.then(function(dbNote) {
			return db.Article.findOneAndUpdate(
				{
					_id: req.params.id
				},
				{
					note: req.params.note
				},
				{
					createDate: req.params.createDate
				});
		})
		.then(function(dbArticle){
			res.json(dbArticle);
		})
		.catch(function(err) {
			res.writeContinue(err);
		});
});

module.exports = router;