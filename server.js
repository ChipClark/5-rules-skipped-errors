var serverType = 'AM-Vendors';
var express = require('express');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();
var port = process.env.PORT || 8110;

app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
    next();
    });


app.use(express.static(__dirname + '/dist/am-vendors'));

//body parse
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ limit: '50mb',extended: true }))


// parse application/json
app.use(bodyParser.json({limit: '50mb', extended: true}))
app.get('/*', (req,res) => res.sendFile(path.join(__dirname)));


app.all('/*', function(req, res, next) {
    // Just send the index.html for other files to support HTML5Mode
    res.sendFile('/dist/am-committees/index.html', { root: __dirname });
});

// Handle 404
app.use(function(req, res) {
    //res.send(‘404: Page not Found’, 404);
    res.status(404).send({status:404, message: '404 Not Found', type:'client'}); 
   });

// Handle 500
app.use(function(error, req, res, next) {
    res.status(500).send({status:500, message: 'internal error', type:'internal'}); 
   });


var httpServer = http.createServer(app);
httpServer.listen(port,() => console.log(serverType +' server running on port: '+ port));

