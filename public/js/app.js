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
		console.log("Save button is clicked " + "articleID: " + articleId);
		$.ajax({
			url: "/articles/save-article/" + articleId,
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

	// click event to remove an article from Saved
	$(document).on("click", ".delete-from-saved", function (event) {
		var articleId = $(this).attr("data-id");
		console.log("Save button is clicked " + "articleID: " + articleId);
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
	$("#clear-articles").on("click", function() {
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

});  