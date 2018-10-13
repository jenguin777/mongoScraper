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

	// When the saveNote button is clicked
	// $("body").on("click", ".saveNote", function(event) {
	// // 	// Grab the id associated with the article from the submit button
	// 	var thisId = $(this).attr("data-id");

	// // 	// AJAX POST call to the submit route on the server
	// // 	// This will take the data from the form and send it to the server
	// 	$.ajax({
	// 		type: "POST",
	// 		dataType: "json",
	// 		url: "/articles/submit-note/" + thisId,
	// 		data: {
	// 			title: $("#noteTitleInput").val(),
	// 			note: $("#noteBodyInput").val(),
	// 			created: Date.now()
	// 		}
	// 	})
	// // 	// If that API call succeeds, add the title and a delete button for the note to the page
	// 		.then(function(data) {
	// // 			// Add the title and delete button to the noteArea section
				
	// // 			// Clear the note and title inputs on the page
	// 			$("#note").val("");
	// 			$("#title").val("");
	// 		});
	// });
  

});  