var util = require('util');
var request = require('request');
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var app = express();
var port = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(express.static('dist'));
app.use(bodyParser.json({
    limit: '50mb'
}));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));

app.listen(port, function() {
    console.log(util.format('Start mock server on %s', port));
});
