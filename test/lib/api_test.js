"use strict";
require('should');
const co = require('co');
const {readFile} = require('fs');
const {join} = require('path');
const API = require('../../lib/api');

describe('API', function () {
    const keys = require('../test_keys.json');
    const api = new API(keys);

    let check = 0;

    beforeEach(function () {
        check = 0;
    });

    describe('Constructor', function () {
        const reseller_api = new API(keys);

        describe('Basics', function () {
            it('Should be an Object', function () {
                reseller_api.should.be.an.Object;
            });
        });

        describe('Errors', function () {
            it('An Object should be thrown with property error', function () {
                try {
                    new API();
                    check = 1;
                } catch (error) {
                    error.should.be.an.Object();
                    error.should.have.property('error', 'Not all required keys are given');
                    check = 2;
                }
                check.should.equal(2);
            });

            it('Should throw an error if no partner_id is given', function () {
                try {
                    new API({profile_key: 'test', secret: 'test'});
                    check = 1;
                } catch (error) {
                    error.should.have.property('error', 'Not all required keys are given');
                    check = 2;
                }
                check.should.equal(2);
            });

            it('Should throw an error if no profile_key is given', function () {
                try {
                    new API({partner_id: 'test', secret: 'test'});
                    check = 1;
                } catch (error) {
                    error.should.have.property('error', 'Not all required keys are given');
                    check = 2;
                }
                check.should.equal(2);
            });

            it('Should throw an error if no secret is given', function () {
                try {
                    new API({profile_key: 'test', partner_id: 'test'});
                    check = 1;
                } catch (error) {
                    error.should.have.property('error', 'Not all required keys are given');
                    check = 2;
                }
                check.should.equal(2);
            });
        });

        describe('Success', function () {
            it('Should return an Object', function () {
                api.should.be.a.Object();
            });

            it('Should have basic properties', function () {
                api.should.have.property('partner_id', keys.partner_id);
                api.should.have.property('profile_key', keys.profile_key);
                api.should.have.property('secret', keys.secret);
                api.should.have.property('api_start', '/api/reseller/v1/');
            });

            it('Should have functions', function () {
                // accountValid
                api.should.have.property('accountValid');
                api.accountValid.should.be.a.Function();

                // generateBasicDataObject
                api.should.have.property('generateBasicDataObject');
                api.generateBasicDataObject.should.be.a.Function();
            });
        });
    });

    describe('.generateBasicDataObject', function () {
        it('Should return an Object', function () {
            const result = api.generateBasicDataObject();
            result.should.be.an.Object();
        });

        it('Should have basic data properties', function () {
            const result = api.generateBasicDataObject();
            result.should.have.property('partner_id', api.partner_id);
            result.should.have.property('profile_key', api.profile_key);
            result.should.have.property('timestamp');
        });
    });

    describe('.accountValid', function () {
        describe('Error', function () {
            it('Should throw an error if something goes wrong', co.wrap(function *() {
                try {
                    yield api.accountValid();
                    check = 1
                } catch (error) {
                    check = 2
                }
                check.should.equal(2);
            }));

            it('Should throw an error if no username is given', co.wrap(function *() {
                try {
                    yield api.accountValid(null, 'fake_password');
                    check = 1
                } catch (error) {
                    error.should.have.property('error', 'No username or password supplied');
                    check = 2
                }
                check.should.equal(2);
            }));

            it('Should throw an error if no password is given', co.wrap(function *() {
                try {
                    yield api.accountValid('fake_username', null);
                    check = 1
                } catch (error) {
                    error.should.have.property('error', 'No username or password supplied');
                    check = 2
                }
                check.should.equal(2);
            }));
        });

        describe('Success', function () {
            const test_users = require('../test_users.json');

            it('Should return an Object', co.wrap(function *() {
                try {
                    const result = yield api.accountValid(test_users.username, test_users.password);
                    result.should.be.an.Object();
                    check = 1
                } catch (error) {
                    error.should.have.property('error', 'No username or password supplied');
                    check = 2
                }
                check.should.equal(1);
            }));
        });
    });

    describe('.parseResponse', function () {
        let xml = '';

        before(function (done) {
            readFile(join(__dirname, '../response.txt'), function (err, result) {
                xml = result.toString();
                done();
            });
        });


        describe('Error', function () {
            it('Should throw an error if something goes wrong', co.wrap(function *() {
                try {
                    yield api.parseResponse();
                    check = 1
                } catch (error) {
                    check = 2
                }
                check.should.equal(2);
            }));

            it('Error should be an Object with property error', co.wrap(function *() {
                try {
                    yield api.parseResponse();
                    check = 1
                } catch (error) {
                    error.should.be.an.Object();
                    error.should.have.property('error');
                    check = 2
                }
                check.should.equal(2);
            }));

            it('Should throw an error if anything but a string is given', co.wrap(function *() {
                try {
                    yield api.parseResponse(1);
                    check = 1;
                } catch (error) {
                    error.should.have.property('error', 'Response is not a String');
                    check = 2;
                }
                check.should.equal(2);

                try {
                    yield api.parseResponse(true);
                    check = 3;
                } catch (error) {
                    error.should.have.property('error', 'Response is not a String');
                    check = 4;
                }
                check.should.equal(4);

                try {
                    yield api.parseResponse(function() {});
                    check = 5;
                } catch (error) {
                    error.should.have.property('error', 'Response is not a String');
                    check = 6;
                }
                check.should.equal(6);
            }))
        });

        describe('Success', function () {
            it('Should return an Object', co.wrap(function *() {
                try {
                    const result = yield api.parseResponse(xml);
                    result.should.be.an.Object();
                    check = 1;
                } catch (error) {
                    check = 2;
                }
                check.should.equal(1);
            }));

            it('Should at least have properties "success" and "resultcode"', co.wrap(function *() {
                try {
                    const result = yield api.parseResponse(xml);
                    result.should.have.property('success');
                    result.should.have.property('resultcode');
                    check = 1;
                } catch (error) {
                    check = 2;
                }
                check.should.equal(1);
            }));
        });
    });
});
