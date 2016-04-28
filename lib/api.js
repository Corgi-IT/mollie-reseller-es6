const {assign} = require('lodash');
const {createHmac} = require('crypto');
const {fixedEncodeURIComponent} = require('./static_functions');
const parseString = require('xml2js').parseString;
const request = require('request');

const thunkify = require('thunkify');
const post = thunkify(request.post);
const parseXML = thunkify(parseString);

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

    *accountValid(username, password) {
        if (!username || !password) {
            throw {error: 'No username or password supplied'};
        }
        const method = 'account-valid';
        const data = this.generateBasicDataObject();

        assign(data, {username, password});

        this.generateSignature(method, data);

        try {
            return yield this.performRequest(method, data);
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
            clone_uri += `${key}=${fixedEncodeURIComponent(clone[key])}&`;
        }

        clone_uri = clone_uri.slice(0, -1);

        data.signature = createHmac('sha1', this.secret).update(clone_uri).digest('hex');
    }

    *performRequest(method, data) {
        const url = `https://www.mollie.com${this.api_start}${method}`;
        const obj = {
            form: {}
        };

        assign(obj.form, data);

        try {
            const result = yield post(url, obj);

            return yield this.parseResponse(result[1]);
        } catch (error) {
            throw {error};
        }
    }

    *parseResponse(xml_string) {
        if (!xml_string) {
            throw {error: 'No response string given'};
        }
        if (xml_string.constructor !== String) {
            throw {error: 'Response is not a String'};
        }

        try {
            const {response} = yield parseXML(xml_string);

            delete response.$;

            for (const key in response) {
                response[key] = response[key][0];
                switch (response[key]) {
                    case 'true':
                        response[key] = true;
                        break;
                    case 'false':
                        response[key] = false;
                        break;
                    default:
                        break;
                }
            }
            return response;
        } catch (error) {
            throw {error};
        }
    }
};
