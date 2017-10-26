import { fetchHeaders } from '../../dist/sample';

//WARNING: ASYNC / AWAIT WORK ONLY WITH NODE > v7.6

var mochaAsync = (fn) => {
    return async () => {
        try {
            await fn();
            return;
        } catch (err) {
            return;
        }
    };
};

//global before
before(mochaAsync(async () => {
    const headers = await fetchHeaders('http://www.vivocha.com');
}));

describe('test fetchHeaders', function () {
    it('should return headers as an object', async function () {
        return async () => {
            const headers = await fetchHeaders('http://www.vivocha.com');
            console.log('Complete your TS test here.');
        }
    });
});