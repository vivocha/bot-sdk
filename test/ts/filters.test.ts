import * as chai from 'chai';
import { BotFilter } from '../../dist/filter';
import { BotRequest, BotResponse } from '@vivocha/public-entities/dist/bot';
import * as http from 'request-promise-native';

chai.should();

const engineType = 'test';


const getTextMessage = function (body?: string, payload?: string): any {
    let msg = {
        code: 'message',
        type: 'text'
    };
    if (body) {
        msg['body'] = body;
    }
    if (payload) {
        msg['payload'] = payload;
    }
    return msg;
};

const getSettings = function (): any {
    return {
        engine: {
            type: engineType,
            settings: {
            }
        }
    }
};

const getHTTPOptions = function getOptions(body) {
    return {
        method: 'POST',
        uri: 'http://localhost:8080/filter/request',
        body: body,
        headers: {
            'x-vvc-host': 'localhost:8888',
            'x-vvc-acct': 'vvc_test1'
        },
        json: true
    };
}


describe('Vivocha BOT FILTERS Tests', function () {

    describe('Request Bot Filter Environment tests', function () {
        const filter = new BotFilter(async (req: BotRequest): Promise<BotRequest> => { 
            return req;
        });
        let server;
        before('starting bot filter', async function () {          
            // Run the BotManager:
            const port = process.env.PORT as any || 8080;
            server = await filter.listen(port);
            return;
        });
        it('sending an environment it should be correctly parsed and set in the request as response', async function () {
            const request1: BotRequest = {
                language: 'en',
                event: 'start',
                settings: getSettings(),
                environment: {
                    campaignId: 'abcd123',
                    contactId: 'aldo-dice-26-x-1'
                }
            };            
            const result1 = await http(getHTTPOptions(request1));
            
            result1.should.have.property('environment');
            result1.environment.should.have.property('campaignId');
            result1.environment.should.have.property('contactId');
            result1.environment.should.have.property('host');
            result1.environment.should.have.property('acct');
            return;
        });
        it('sending an empty environment it should be correctly parsed and in the request as response environment should contain the headers', async function () {
            const request1: BotRequest = {
                language: 'en',
                event: 'start',
                settings: getSettings(),
                environment: {
                }
            };            
            const result1 = await http(getHTTPOptions(request1));
            //console.dir(result1, {colors: true, depth: 20});
            result1.should.have.property('environment');
            result1.environment.should.have.property('host');
            result1.environment.should.have.property('acct');
            return;
        });
        it('sending a request without environment the request as response environment should contain the headers', async function () {
            const request1: BotRequest = {
                language: 'en',
                event: 'start',
                settings: getSettings(),
            };            
            const result1 = await http(getHTTPOptions(request1));
            //console.dir(result1, {colors: true, depth: 20});
            result1.should.have.property('environment');
            result1.environment.should.have.property('host');
            result1.environment.should.have.property('acct');
            return;
        });
        after('shutdown bot manager', function () {
            server.close();
        });
    });
    describe('Response Bot Filter Environment tests', function () {
        const filter = new BotFilter(async (req: BotResponse): Promise<BotResponse> => { 
            return req;
        });
        let server;
        before('starting bot filter', async function () {          
            // Run the BotManager:
            const port = process.env.PORT as any || 8080;
            server = await filter.listen(port);
            return;
        });
        it('sending an environment it should be correctly parsed and set in the request as response', async function () {
            const request1: BotResponse = {
                language: 'en',
                event: 'continue',
                settings: getSettings(),
                environment: {
                    campaignId: 'abcd123',
                    contactId: 'aldo-dice-26-x-1'
                }
            };            
            const result1 = await http(getHTTPOptions(request1));
            
            result1.should.have.property('environment');
            result1.environment.should.have.property('campaignId');
            result1.environment.should.have.property('contactId');
            result1.environment.should.have.property('host');
            result1.environment.should.have.property('acct');
            return;
        });
        it('sending an empty environment it should be correctly parsed and in the request as response environment should contain the headers', async function () {
            const request1: BotResponse = {
                language: 'en',
                event: 'continue',
                settings: getSettings(),
                environment: {
                }
            };            
            const result1 = await http(getHTTPOptions(request1));
            //console.dir(result1, {colors: true, depth: 20});
            result1.should.have.property('environment');
            result1.environment.should.have.property('host');
            result1.environment.should.have.property('acct');
            return;
        });
        it('sending a request without environment the request as response environment should contain the headers', async function () {
            const request1: BotResponse = {
                language: 'en',
                event: 'continue',
                settings: getSettings(),
            };            
            const result1 = await http(getHTTPOptions(request1));
            //console.dir(result1, {colors: true, depth: 20});
            result1.should.have.property('environment');
            result1.environment.should.have.property('host');
            result1.environment.should.have.property('acct');
            return;
        });
        after('shutdown bot manager', function () {
            server.close();
        });
    });
});
