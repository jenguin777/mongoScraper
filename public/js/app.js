$(document).ready(function() {

	// Jumbotron parallax code
	var jumboHeight = $(".jumbotron").outerHeight();
	function parallax(){
		var scrolled = $(window).scrollTop();
		$(".bg").css("height", (jumboHeight-scrolled) + "px");
	}
 
	$(window).scroll(function(e){
		parallax();
	});

	// Begin client side js
  
	//-----------------------ARTICLES-----------------------//

	// click event to scrape new articles
	$("#scrape").on("click", function (event){
		event.preventDefault();
		$.ajax({
			url: "/scrape/",
			type: "GET",
			success: function (response) {
				window.location.href = "/articles/saved/";
			}
		});
	});

	// click event to save an article
	$(document).on("click", ".save", function (event) {
		event.preventDefault();
		var articleId = $(this).attr("data-id");
		$.ajax({
			url: "/articles/save-article/" + articleId,
			type: "POST",
			success: function (response) {
				window.location.href = "/";
			},
			error: function (error) {
				console.log("error" + JSON.stringify(error));
			}
		});
	});

	// click event to remove an article from Saved
	$(document).on("click", ".delete-from-saved", function (event) {
		event.preventDefault();
		var articleId = $(this).attr("data-id");
		$.ajax({
			url: "/articles/delete-from-saved/" + articleId,
			type: "POST",
			// dataType: "json",
			success: function (response) {
				window.location.href = "/";
			},
			error: function (error) {
				console.log("error" + JSON.stringify(error));
			}
		});
	});

	// When the #clear-articles button is pressed
	$("#clear-articles").on("click", function(event) {
		event.preventDefault();
		// Make an AJAX GET request to delete the articles from the db
		$.ajax({
			type: "GET",
			dataType: "json",
			url: "/clear-articles",
			// On a successful call, clear the #results section
			success: function(response) {
				$("#results").empty();
				window.location.href = "/";
			}
		});
	});

	//-----------------------NOTES-----------------------//

	// Article Notes event handler - show the title of the article you are adding a note to in the modal
	$(document).on('click', '.add-note', function(){
		event.preventDefault();
		// var title = $(this).attr("data-title");
		var title = $(this).data("title");
		console.log(title);
		var id = $(this).attr("data-id");
		$("#articleTitle" + id).text(title); // this returns only the first word - have tried several variations of escaping and combinations of quotes
		//https://stackoverflow.com/questions/26848247/variable-from-attribute-only-displays-the-first-word
	});

	// When the saveNote button is clicked
	$("body").on("click", ".save-note", function() {
		event.preventDefault();
		// Grab the id associated with the article from the Save Note button and put it in thisId
		var thisId = $(this).attr("data-id");
		console.log("thisId: " + thisId);

		// AJAX POST call to the submit route on the server
		// This will take the data from the form and send it to the server
		$.ajax({
			type: "POST",
			dataType: "json",
			url: "/articles/save-note/" + thisId,
			data: {
				noteTitle: $(`#noteTitleInput${thisId}`).val(),
				noteBody: $(`#noteBodyInput${thisId}`).val(),
				createDate: Date.now()
			}
		})
			// If that API call succeeds, add the title and a delete button for the note to the page 
			.then(function(dbArticle) {
				console.log("dbArticle with notes from client side: " + JSON.stringify(dbArticle));
				console.log("last dbArticle in array: " + JSON.stringify(dbArticle.note[dbArticle.note.length-1]));

				var newNoteId = dbArticle.note[dbArticle.note.length-1]._id;
				console.log("newNoteId: " + JSON.stringify(newNoteId));
				var newNoteTitle = dbArticle.note[dbArticle.note.length-1].noteTitle;
				console.log("newNoteTitle: " + JSON.stringify(newNoteTitle));
				var newNoteBody = dbArticle.note[dbArticle.note.length-1].noteBody;
				console.log("newNoteBody: " + JSON.stringify(newNoteBody));
				
				$("#noteArea").attr("data-id",thisId);
				// Place the body of the note in the body textarea
				$(".noteTitleInput").val(dbArticle.note[dbArticle.note.length-1].noteTitle);
				// Place the body of the note in the body textarea
				$(".noteBodyInput").val(dbArticle.note[dbArticle.note.length-1].noteBody);
				

				// Add the title and delete button to the #noteArea section

				// Add the title and delete button to the #noteArea section

				// This at least displays Undefined with the X:
				// $("#noteArea" + thisId).prepend("<p class='data-entry' data-id=" + dbArticle.note._id + "><span class='noteTitle' data-id=" +
				// dbArticle.note._id + ">" + dbArticle.note.noteTitle + " </span><span class=delete>X</span></p>");

				$("#noteArea" + thisId).prepend("<p class='data-entry' data-id=" + dbArticle.note[dbArticle.note.length-1]._id + "><span class='noteTitle' data-id=" +
				dbArticle.note[dbArticle.note.length-1]._id + ">" + dbArticle.note[dbArticle.note.length-1].noteTitle + " </span><span class=delete>X</span></p>");
				// Clear the note and title inputs on the page
				$(".noteTitleInput").val("");
				$(".noteBodyInput").val("");

			});
	});

	// When user clicks the delete button for a note
	$(document).on("click", ".delete", function() {
		event.preventDefault();
		var thisId = $(this).attr("data-id");
		console.log("Delete on click event - thisID: " + thisId);
		
		// Make an AJAX GET request to delete the specific note
		// this uses the data-id of the p-tag, which is linked to the specific note
		// $.ajax({
		// 	type: "GET",
		// 	url: "/articles/delete/" + thisId,
		
		// 	// On successful call
		// 	success: function(response) {
		// 		// Remove the p-tag from the DOM
		// 		selected.remove();
		// 		// Clear the note and title inputs
		// 		$("noteTitleInput").val("");
		// 		$("noteBodyInput").val("");
		// 	}
		// });
	});

});