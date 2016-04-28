"use strict";
require('should');
const static_functions = require('../../lib/static_functions');


describe('static_functions', function () {
    describe('.fixedEncodeURIComponent', function () {
        it('Should return a String', function () {
            const result = static_functions.fixedEncodeURIComponent('foo');
            result.should.be.a.String();
        });

        it('Should change a String in the correct way', function () {
           const result = static_functions.fixedEncodeURIComponent("t_e.s~t*p'a(s)s!");
            result.should.equal('t_e.s%7et%2ap%27a%28s%29s%21');
        });
    })
});
