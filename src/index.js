'use strict';

var aws = require('aws-sdk');
var ssm = new aws.SSM({ apiVersion: '2014-11-06' });
var pub = {};

pub.validate = function (event) {
    if (!event.ResourceProperties.Names) {
        throw new Error('Missing required property Names');
    }
    if (!Array.isArray(event.ResourceProperties.Names)) {
        throw new Error('Property Names must be an array');
    }
};

pub.create = function (event, _context, callback) {
    var params = {
        Names: event.ResourceProperties.Names,
        WithDecryption: true
    };
    ssm.getParameters(params, function (error, response) {
        if (error) {
            return callback(error);
        }

        var data = {};
        response.Parameters.forEach(function (parameter) {
            data[parameter.Name] = parameter.Value;
        });
        return callback(null, data);
    });
};

pub.update = function (event, context, callback) {
    return pub.create(event, context, callback);
};

pub.delete = function (_event, _context, callback) {
    setImmediate(callback);
};

module.exports = pub;
