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
            var objTransform = new Transform(parsedData);
            objTransform.generate();
                // .then(function(obj) {
                //     obj.map(function (message) {
                //         var timeout = message.timeout;
                //         var data = JSON.stringify(message);
                //         var options = {
                //             host: "hookb.in",
                //             port: 443,
                //             path: "/ZjLLxW1D",
                //             method: "POST",
                //             headers: {
                //                 "Content-Type": "application/json",
                //                 "Content-Length": Buffer.byteLength(data)
                //             }
                //         };
                //         var req = https.request(options, function (res) {
                //             var response = "";
                //
                //             res.setEncoding("utf8");
                //
                //             res.on("data", function (chunk) {
                //                 response += chunk;
                //             });
                //
                //             res.on("end", function () {
                //                 // console.log(response);
                //             });
                //         });
                //         req.write(data);
                //         req.end();
                //     });
                // });
        });

    callback(null, 'Message processed');
};