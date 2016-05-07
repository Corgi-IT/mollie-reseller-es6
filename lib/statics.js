module.exports.fixedEncodeURIComponent = function fixedEncodeURIComponent(str) {
    return encodeURIComponent(str).replace(/[~!'()*]/g, (c) => {
        return `%${c.charCodeAt(0).toString(16)}`;
    });
};

module.exports.fixResponseObject = function fixResponseObject(response) {
    for (const key in response) {
        const value = response[key];

        if (value === 'true') {
            response[key] = true;
        } else if (value === 'false') {
            response[key] = false;
        }

        if (!isNaN(value) && value.constructor === String) {
            response[key] = parseInt(value);
        }

        if (value.constructor === Object) {
            fixResponseObject(response[key]);
        }

        if (value.constructor === Array) {
            const value_length = response[key].length;
            for (let i = 0; i < value_length; i++) {
                fixResponseObject(response[key][i]);
            }
        }
    }

    if (response.resultmessage && response.resultmessage.constructor !== String) {
        response.resultmessage = '';
    }
};

module.exports.getLegalForms = function getLegalForms() {
    return require('../data/legal_forms.json');
};
