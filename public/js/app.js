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
  
	//click event to scrape new articles
	$('#scrape').on('click', function (event){
		event.preventDefault();
		$.ajax({
		  url: '/scrape/',
		  type: 'GET',
		  success: function (response) {
			window.location.href = '/';
		  }
		});
	  });//end of #scrape click event

	//click event to save an article
	$(document).on('click', '.save', function (e) {
		let articleId = $(this).data('id');
		$.ajax({
		url: '/articles/saved/' + this.articleId,
		type: 'GET',
		success: function (response) {
			window.location.href = '/articles/saved';
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
				window.location.href = '/';
			}
		});
	});
  



});  