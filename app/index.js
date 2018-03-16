var S3 = require("./persistence/s3");
var Process = require("./Process/Process");

exports.handler =  function(event, context, callback) {
    const bucket = event.Records[0].s3.bucket.name;
    const key    = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    const ENV_URL_SEARCH = process.env.URL_SEARCH;
    const ENV_URL_FINISH = process.env.URL_FINISH;
    var extension = key.match(/\.([^.]*)$/);

    console.log('-- Processing Info --');
    console.log('Bucket: ' + bucket);
    console.log('File: ' + key);
    console.log('Url search: ' + ENV_URL_SEARCH);
    console.log('Url finish: ' + ENV_URL_FINISH);
    console.log('---------------------');

    if (!extension)
    {
        callback(null, 'Could not determine the file type...');
        return;
    }

    S3.getObject(bucket, key)
        .then(function(data) {
            var parsedData = JSON.parse(data.Body.toString('utf-8'));
            var ObjProcess = new Process(
                parsedData,
                ENV_URL_SEARCH,
                ENV_URL_FINISH
            );
            ObjProcess.run();
        });

    callback(null, 'Message processed');
};