var express = require('express');
var app = express();

//define static folder
app.use(express.static('public'))

//root route (default) www.site.com
app.get('/', function(req, res){
   res.send("Hello World!");
});

//hello route www.site.com/hello
app.get('/hello', function(req, res){
   res.send("You just called'/hello'!\n");
});

 //hello route www.site.com/hellohtml (sendinf formatted response)
app.get('/hellohtml', function(req, res){
   res.send("<p><h2>hello</h2> is it me you're looking for!</p>");
});

 //question route www.site.com/question?name=xxx&drink=xxx demonstrates parameters
app.get('/question', function(req, res){

   var name = req.query.user;
   var drink= req.query.drink;
   res.send("Hello "+name+" would you like a "+drink+"?");
});

//about route www.site.com/about sends an HTML file
app.get('/about', function(req, res){
      res.sendFile("about.html");
   });

//default route for file not found. Must come at the end
app.use(function ( req, res) {
      res.sendFile('404.html')
})

app.listen(8080);

