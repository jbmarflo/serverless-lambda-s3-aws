var aws     = require("aws-sdk");
var s3 = new aws.S3();
var Promise = require('promise');

var s3Client = {
    'deleteObject' : function (bucket, key) {
        return new Promise(function(resolve, reject) {
            s3.deleteObject({
                Bucket: bucket,
                Key: key
            }, function (err, data) {
                if (err) {
                    console.log('Could not delete file into destination bucket... ' + key);
                    reject(err);
                } else {
                    resolve("S3 removeObject "+key+" from "+bucket+" success");
                }
            });
        })
    },

    'getObject': function (bucket, key, acl) {
        return new Promise(function(resolve, reject) {
            s3.getObject({
                Bucket: bucket,
                Key: key
            }, function (err, data) {
                if (err) {
                    console.log('Error getting file from bucket...');
                    reject(err);
                } else {
                    resolve(data);
                }
            })
        })
    }
};

exports.getObject=s3Client.getObject;
exports.putObject=s3Client.putObject;
exports.deleteObject=s3Client.deleteObject;