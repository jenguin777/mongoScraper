# Mongo Scraper

* a web app that lets users view and leave comments on the latest articles displayed at [NPR's website] (https://www.npr.org/). 

* Whenever a user visits the site, the app scrapes stories and display them for the user. Each scraped article is saved to a Mongo  database. The app scrapes and displays the following information for each article:

   * Headline - the title of the article

   * Summary - a short summary of the article

   * URL - the url to the original article

# Technologies Used
* Node.js - open-source, cross-platform JavaScript run-time environment that executes JavaScript code outside of a browser
* Express.js - build server-side routes and functions
* Handlebars - html templating engine
* Mongoose (Mongo DB) - define schema, create custom methods to fetch data, create relationships between collections (tables)
* Cheerio- scrapes articles from https://www.npr.org/
* Axios - a promised-based http library, similar to jQuery's Ajax library. It works on the client and on the server.
* Morgan - express middleware used for automated logging of requests, responses and related data to stdout (i.e., logs remote ip, request method, http version, response status, etc.). 

# To run the application
Just run "npm install" in a terminal window after cloning the project. The required packages will be fetched from the package.json file and installed on your machine. Or you can see a deployed version [here.](https://thawing-island-65565.herokuapp.com/)

# License
MIT license applies.

# Code of Conduct
Be nice and don't talk to strangers.
