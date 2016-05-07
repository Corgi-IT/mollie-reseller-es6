const {assign} = require('lodash');
const {createHmac} = require('crypto');
const {toJson} = require('xml2json');
const request = require('request');
const thunkify = require('thunkify');

const post = thunkify(request.post);

module.exports = class API {

    constructor({partner_id, profile_key, secret} = {}) {
        if (!partner_id || !profile_key || !secret) {
            throw {error: 'Not all required keys are given'};
        }

        this.api_start = '/api/reseller/v1/';
        this.partner_id = partner_id;
        this.profile_key = profile_key;
        this.secret = secret;
    }

    *accountClaim(username, password) {
        if (!username || !password) {
            throw {error: 'No username or password supplied'};
        }
        const method = 'account-claim';
        const data = this.generateBasicDataObject();

        assign(data, {username, password});

        try {
            return yield this.performRequest(method, data);
        } catch (error) {
            throw {error: error.error};
        }
    }

    *accountValid(username, password) {
        if (!username || !password) {
            throw {error: 'No username or password supplied'};
        }
        const method = 'account-valid';
        const data = this.generateBasicDataObject();

        assign(data, {username, password});

        try {
            return yield this.performRequest(method, data);
        } catch (error) {
            throw {error: error.error};
        }
    }

    *profiles({username, password, partner_id_customer} = {}) {
        if ((!username || !password) && !partner_id_customer) {
            throw {error: 'No username and password or partner_id_customer supplied'};
        }

        const method = 'profiles';
        const data = this.generateBasicDataObject();

        if (partner_id_customer) {
            assign(data, {partner_id_customer});
        } else {
            assign(data, {username, password});
        }

        try {
            const result = yield this.performRequest(method, data);

            if (result.items && result.items.profile && result.items.profile.constructor === Object) {
                const profile = result.items.profile;
                result.items.profile = [];
                result.items.profile.push(profile);
            }

            return result;
        } catch (error) {
            throw {error: error.error};
        }
    }

    generateBasicDataObject() {
        return {
            partner_id: this.partner_id,
            profile_key: this.profile_key,
            timestamp: Date.now().toString().slice(0, -3)
        };
    }

    generateSignature(method, data) {
        const clone = {};

        Object.keys(data).sort().forEach((key) => {
            clone[key] = data[key];
        });

        let clone_uri = `${this.api_start}${method}?`;

        for (const key in clone) {
            clone_uri += `${key}=${API.stringToEncodedURI(clone[key])}&`;
        }

        clone_uri = clone_uri.slice(0, -1);

        data.signature = createHmac('sha1', this.secret).update(clone_uri).digest('hex');
    }

    *performRequest(method, data) {
        const url = `https://www.mollie.com${this.api_start}${method}`;
        const obj = {
            form: {}
        };

        this.generateSignature(method, data);

        assign(obj.form, data);

        try {
            const result = yield post(url, obj);

            return API.parseResponse(result[1]);
        } catch (error) {
            throw {error};
        }
    }

    static parseResponse(xml_string) {
        if (!xml_string) {
            throw {error: 'No response string given'};
        }
        if (xml_string.constructor !== String) {
            throw {error: 'Response is not a String'};
        }

        try {
            const {response} = toJson(xml_string, {object: true});

            delete response.version;

            API.fixResponseObject(response);

            return response;
        } catch (error) {
            throw {error};
        }
    }

    static stringToEncodedURI(str) {
        return encodeURIComponent(str).replace(/[~!'()*]/g, (c) => {
            return `%${c.charCodeAt(0).toString(16)}`;
        });
    }

    static fixResponseObject(response) {
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
                API.fixResponseObject(response[key]);
            }

            if (value.constructor === Array) {
                const value_length = response[key].length;
                for (let i = 0; i < value_length; i++) {
                    API.fixResponseObject(response[key][i]);
                }
            }
        }

        if (response.resultmessage && response.resultmessage.constructor !== String) {
            response.resultmessage = '';
        }
    }

    static getLegalForms() {
        return require('../data/legal_forms.json');
    }
};
