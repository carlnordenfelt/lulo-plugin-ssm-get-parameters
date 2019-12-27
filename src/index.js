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
    const map = new Map();
    for (const [getAttName, paramPath] of event.ResourceProperties.Parameters) {
        map.set(paramPath, getAttName);
    }

    const params = {
        Names: Array.from(map.keys()),
        WithDecryption: true
    };

    ssm.getParameters(params, function (error, response) {
        if (error) {
            return callback(error);
        }

        const data = {};
        response.Parameters.forEach(function (parameter) {
            data[map.get(parameter.Name)] = parameter.Value;
        });
        return callback(null, data);
    });
}

function update(event, context, callback) {
    return create(event, context, callback);
}

function _delete(_event, _context, callback) {
    setImmediate(callback);
}
