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
				window.location.href = "/";
			}
		});
	});

	// click event to save an article
	$(document).on("click", ".save", function (event) {
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

	// Article Notes event handler
	$(document).on('click', '.add-note', function(){
		var title = $(this).attr('data-title');
		var id = $(this).attr('data-id');
		$("#noteTitle" + id).text(title);
	});

	// When the saveNote button is clicked
	$("body").on("click", ".save-note", function() {
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
				noteTitle: $(".noteTitleInput").val(),
				noteBody: $(".noteBodyInput").val(),
				createDate: Date.now()
			}
		})
			// If that API call succeeds, add the title and a delete button for the note to the page 
			.then(function(dbArticle) {

				// I think I may have a this / scoping problem???
				$("#noteArea").attr("data-id",thisId);
				// Place the body of the note in the body textarea
				$(".noteTitleInput").val(dbArticle.note.noteTitle);
				// Place the body of the note in the body textarea
				$(".noteBodyInput").val(dbArticle.note.noteBody);
				
				console.log(dbArticle.note.noteTitle + " This should be the note title");
				console.log(JSON.stringify(dbArticle) + " This is dbArticle");

				// Add the title and delete button to the #noteArea section ---// I think I may have a this / scoping problem???
				$("#noteArea" + thisId).prepend("<p class='data-entry' data-id=" + dbArticle.note._id + "><span class='noteTitle' data-id=" +
				dbArticle.note._id + ">" + dbArticle.note.noteTitle + " </span><span class=delete>X</span></p>");
				// Clear the note and title inputs on the page
				// $("#noteTitleInput").val("");
				// $("#noteBodyInput").val("");

				// The title of the article --------------------------------I wish this would display right when you click the button------
				// $("#note-header").html("<h6>Adding note for: " + dbArticle.title + "</h6>");
		  
				// Another approach, populate the entry fields with the last note
				// If there's a note in the article
				// if (data.note) {
				  // Place the title of the note in the title input
				//   $("#noteTitleInput").val(dbArticle.note.noteTitle);
				  // Place the body of the note in the body textarea
				//   $("#noteBodyInput").val(dbArticle.note.noteBody);
				// }

					// Clear the note and title inputs on the page
				// $("#note").val("");
				// $("#title").val("");
			});
	});
	// When user clicks the delete button for a note
// 	$(document).on("click", ".delete", function() {
// 		var thisId = $(this).attr("data-id");
		
// 		// Make an AJAX GET request to delete the specific note
// 		// this uses the data-id of the p-tag, which is linked to the specific note
// 		$.ajax({
// 			type: "PUT",
// 			url: "/articles/delete/" + thisId,
		
// 			// On successful call
// 			success: function(response) {
// 				// Remove the p-tag from the DOM
// 				selected.remove();
// 				// Clear the note and title inputs
// 				$("#note").val("");
// 				$("#title").val("");
// 			}
// 		});
// 	});
});