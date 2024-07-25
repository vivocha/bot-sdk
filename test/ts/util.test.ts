import * as chai from 'chai';
import { getVvcEnvironment } from '../../dist/util';
import { EnvironmentInfo } from '@vivocha/public-types/dist/bot';

chai.should();

describe('Get VVC Environment', function () {

    describe('From HTTP headers', function () {
        it('for existing headers it should return a complete EnvironmentInfo', function () {
            const env: EnvironmentInfo = getVvcEnvironment({
                'x-vvc-host': 'https://a.b.com',
                'x-vvc-acct': '123456',
                'x-vvc-hmac': '74e6f7298a9c2d168935f58c001bad88'
            });
            env.should.have.property('host');
            env.host.should.equal('https://a.b.com');
            env.should.have.property('acct');
            env.acct.should.equal('123456');
            env.should.have.property('hmac');
            env.hmac.should.equal('74e6f7298a9c2d168935f58c001bad88');
        });
        it('for partially existing headers it should return a partial EnvironmentInfo', function () {
            const env: EnvironmentInfo = getVvcEnvironment({
                'x-vvc-host': 'https://a.b.com',
                'x-vvc-acct': '123456'
            });
            env.should.have.property('host');
            env.host.should.equal('https://a.b.com');
            env.should.have.property('acct');
            env.acct.should.equal('123456');
            env.should.not.have.property('hmac');
        });
        it('for not existing headers it should return an empty EnvironmentInfo', function () {
            const env: EnvironmentInfo = getVvcEnvironment({
            });
            env.should.not.have.property('host');
            env.should.not.have.property('acct');
            env.should.not.have.property('hmac');
            Object.keys(env).should.length(0);
        });
        it('for not existing vvc headers it should return an empty EnvironmentInfo', function () {
            const env: EnvironmentInfo = getVvcEnvironment({
                'x-abc': 'abc',
                'content-type': 'application/json',
                'host': 'localhost'
            });
            env.should.not.have.property('host');
            env.should.not.have.property('acct');
            env.should.not.have.property('hmac');
            Object.keys(env).should.length(0);
        });
    });
});
