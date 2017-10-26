const{ fetchHeaders } = require('../../dist/sample');

describe('test fetchHeaders from JS', function () {
    it('should return headers as an object', async function () {
        return async () => {
            const headers = await fetchHeaders('http://www.google.com');
            console.log('Complete your JS test here');
        }
    });
});