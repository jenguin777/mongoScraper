//Dependencies
var express = require("express");
var router = express.Router();
var db = require("../models");

//-----------------------ARTICLES-----------------------//

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

// Route for grabbing a specific Article by id, populate it with it's note
router.get("/articles/:id", function (req, res) {
	// Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
	db.Article.findOne({
		_id: req.params.id
	})
	// ..and populate all of the notes associated with it
		.populate("note")
		.then(function (dbArticle) {
			// If we were able to successfully find an Article with the given id, send it back to the client
			res.json(dbArticle);
		})
		.catch(function (err) {
			// If an error occurred, send it to the client
			res.writeContinue(err);
		});
});


// Route for saving/updating an Article's associated Note
router.post("/save-note/:id", function(req, res) {
	console.log("saving / updating note route - req.params.id: " + req.params.id);
	console.log("saving / updating note route - req.body: " + JSON.stringify(req.body));
	
	// save the new note that gets posted to the Notes collection
	// then find an article from the req.params.id
	// and update it's "note" property with the _id of the new note
	db.Note.create(req.body)
		.then(function(dbNote) {

			return db.Article.findOneAndUpdate({
				_id: req.params.id
			}, {
				$push: {
					note: dbNote._id
				}}, {
				new: true
			}).populate("note");
		})
		// If the Article was updated successfully, send back article and its corresponding notes to the client
		.then(function(dbArticle){
			console.log("dbArticle with notes" + dbArticle);
			res.json(dbArticle);
		})
		.catch(function(err) {
			res.writeContinue(err);
		});
});

// Delete One from the DB
router.put("/delete/:id", function(req, res) {
	// Remove a note using the objectID
	db.Note.remove(
		{
			_id: req.params.id
		},
		function(error, removed) {
		// Log any errors from mongojs
			if (error) {
				console.log(error);
				res.writeContinue(error);
			}
			else {
				// Otherwise, send the mongojs response to the browser
				// This will fire off the success function of the ajax request
				console.log(removed);
				res.send(removed);
			}
		}
	);
});
  

module.exports = router;