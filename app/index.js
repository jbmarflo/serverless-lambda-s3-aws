var AWS = require("aws-sdk");
var S3 = require("./persistence/s3");
var Transform = require("./Process/transformData");
// var SQS = AWS.SQS();

// var url ='https://hookb.in/ZjLLxW1D';

exports.handler =  function(event, context, callback) {
    const bucket = event.Records[0].s3.bucket.name;
    const key    = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    var extension = key.match(/\.([^.]*)$/);

    console.log('-- Processing Info --');
    console.log('Bucket: ' + bucket);
    console.log('File: ' + key);
    console.log('---------------------');

    if (!extension)
    {
        callback(null, 'Could not determine the file type...');
        return;
    }

    S3.getObject(bucket, key)
        .then(function(data) {
            var parsedData = JSON.parse(data.Body.toString('utf-8'));
            var Process = new Transform(parsedData);
            Process.run();
        });

    callback(null, 'Message processed');
};