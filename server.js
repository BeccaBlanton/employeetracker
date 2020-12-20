
var express = require("express");
var mysql = require("mysql")

var app = express();

var PORT = process.env.PORT || 8080;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.listen(PORT, function() {
  console.log("App listening on PORT: " + PORT);
});
