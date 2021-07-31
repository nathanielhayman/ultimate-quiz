const path = require('path');
const http = require('http');
const express = require('express');

const routing = require('./config/routing');

const app = express();
const bodyParser = require("body-parser");
const server = http.createServer(app);

var port = process.env.PORT || 3000;

app.use('/assets', express.static(path.join(__dirname, "./assets")));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Configure API routing
routing.configure(app);

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Listen on port 3000
server.listen(port, () => {
    console.log(`[i] Server running on port ${port}`);
});