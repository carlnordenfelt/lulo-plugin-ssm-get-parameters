const aws = require('aws-sdk');
const ssm = new aws.SSM({ apiVersion: '2014-11-06' });

module.exports = {
    validate,
    create,
    update,
    delete: _delete
};

function validate(event) {
    if (!event.ResourceProperties.Parameters) {
        throw new Error('Missing required property Parameters');
    }
    if (!Array.isArray(event.ResourceProperties.Parameters)) {
        throw new Error('Property Parameters must be an array');
    }
}

function create(event, _context, callback) {
    // GetParameters accepts only 10 Params at a time
    _getParamsRecursively(event.ResourceProperties.Parameters, {}, function (error, data) {
        return callback(error, data);
    });
}

function update(event, context, callback) {
    return create(event, context, callback);
}

function _delete(_event, _context, callback) {
    setImmediate(callback);
}

function _getParamsRecursively(params, data, callback) {
    const chunkSize = 10;
    if (!params.length) {
        return callback(null, data);
    }

    for (let i = 0; i < params.length; i += chunkSize) {
        const paramChunk = params.splice(i, i + chunkSize);

        const map = new Map();
        for (const [getAttName, paramPath] of paramChunk) {
            map.set(paramPath, getAttName);
        }

        const ssmParams = {
            Names: Array.from(map.keys()),
            WithDecryption: true
        };

        ssm.getParameters(ssmParams, function (error, response) {
            if (error) {
                return callback(error);
            }

            response.Parameters.forEach(function (parameter) {
                data[map.get(parameter.Name)] = parameter.Value;
            });
            return _getParamsRecursively(params, data, callback);
        });
    }
}
