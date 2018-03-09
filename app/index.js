var AWS = require("aws-sdk");
var SQS = AWS.SQS();
var request = require('request');
var url ='https://requestb.in/1fx3ofb1';

exports.handler = function(event, context, callback) {


    request.post({
        headers: {'content-type' : 'application/json'},
        url:     url,
        body:    "mes=heydude"
    }, function(error, response, body){
        console.log(body);
    });
};