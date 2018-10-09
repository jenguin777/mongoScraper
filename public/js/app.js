$(document).ready(function() {

	// Jumbotron parallax code - may not work
	var jumboHeight = $(".jumbotron").outerHeight();
	function parallax(){
		var scrolled = $(window).scrollTop();
		$(".bg").css("height", (jumboHeight-scrolled) + "px");
	}
 
	$(window).scroll(function(e){
		parallax();
	});

	$("#myModal").on("shown.bs.modal", function() {
		$("#myInput").focus();
	});

	// Begin client side js

	// Save button
	$(".save").on("click", function(){
		var articleId = $(this).attr("data-id");
		alert(articleId);
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
			}
		});
	});
  



});  