"use strict";
require('should');
const statics = require('../../lib/statics');


describe('statics', function () {
    describe('.fixedEncodeURIComponent', function () {
        it('Should return a String', function () {
            const result = statics.fixedEncodeURIComponent('foo');
            result.should.be.a.String();
        });

        it('Should change a String in the correct way', function () {
            const result = statics.fixedEncodeURIComponent("t_e.s~t*p'a(s)s!");
            result.should.equal('t_e.s%7et%2ap%27a%28s%29s%21');
        });
    });

    describe('.getLegalForms', function () {
        it('Should return an array of Objects', function () {
            const result = statics.getLegalForms();

            result.should.be.an.Array();
            result[1].should.be.an.Object();
        });

        it('Should contain Objects with a key and value properties', function () {
            const result = statics.getLegalForms();

            const result_length = result.length;
            for(let i = 0; i < result_length; i++) {
                const obj = result[i];
                obj.should.have.property('key');
                obj.should.have.property('value');
            }

        });
    });
});
