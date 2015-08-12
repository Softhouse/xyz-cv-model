'use strict';

var expect = require('expect.js');
var server = require('../app/server');
var config = require('config');
var nock = require('nock');
var mockedUrl = config.API_URL;
var url = 'localhost:' + config.PORT;
var request = require('supertest');

describe('/people', function() {

    afterEach(function(done) {
        nock.cleanAll();
        done();
    });

    it('should reply with HTTP status code 200 and a correctly formatted JSON object when getting people', function(done) {
        var offices = [
            {
                _id: '55c9b205d2f81e1a00985515',
                name: 'Karlskrona',
                createdAt: '2015-08-11T08:27:49.004Z',
                updatedAt: '2015-08-11T08:27:49.004Z'
            },
            {
                _id: '55c9b205d2f81e1a00985520',
                name: 'Miami',
                createdAt: '2015-08-11T08:27:49.004Z',
                updatedAt: '2015-08-11T08:27:49.004Z'
            }
        ];

        var users = [
            {
                _id: '55c9b204d2f81e1a00985510',
                email: 'enoch.mertz@softhouse.se',
                name: 'Enoch Mertz',
                role: 'user'
            },
            {
                _id: '55c9b204d2f81e1a0098551a',
                email: 'marcus.lastname@softhouse.se',
                name: 'Marcus Lastname',
                role: 'user'
            }
        ];

        var userToOfficeConnectors = [
            {
                _id: '55c9b205d2f81e1a00985515',
                userId: '55c9b204d2f81e1a00985510',
                officeId: '55c9b205d2f81e1a00985515',
                createdAt: '2015-08-11T08:27:49.368Z',
                updatedAt: '2015-08-11T08:27:49.368Z'
            },
            {
                _id: '55c9b205d2f81e1a0098556c',
                userId: '55c9b204d2f81e1a0098551a',
                officeId: '55c9b205d2f81e1a00985520',
                createdAt: '2015-08-11T08:27:49.626Z',
                updatedAt: '2015-08-11T08:27:49.626Z'
            }
        ];

        var params = {officeId: '55c9b205d2f81e1a00985515'};

        var expectedResult = '{"people":[{"user":{"_id":"55c9b204d2f81e1a00985510","email":"enoch.mertz@softhouse.se","name":"Enoch Mertz","role":"user"},"office":{"_id":"55c9b205d2f81e1a00985515","name":"Karlskrona","createdAt":"2015-08-11T08:27:49.004Z","updatedAt":"2015-08-11T08:27:49.004Z"}},{"user":{"_id":"55c9b204d2f81e1a0098551a","email":"marcus.lastname@softhouse.se","name":"Marcus Lastname","role":"user"},"office":{"_id":"55c9b205d2f81e1a00985520","name":"Miami","createdAt":"2015-08-11T08:27:49.004Z","updatedAt":"2015-08-11T08:27:49.004Z"}}],"office":["Karlskrona","Miami"]}';

        nock(mockedUrl)

            .get('/user')
            .reply(200, users)

            .get('/office')
            .reply(200, offices)

            .get('/userToOfficeConnector')
            .reply(200, userToOfficeConnectors);

        request(url)
            .get('/people')
            .set('x-forwarded-email', 'a@softhouse.se')
            .send({
                params: params
            })

            .end(function(err, res) {
                if (err) {
                    throw err;
                }

                expect(res).to.exist;
                expect(res.status).to.equal(200);
                expect(JSON.stringify(res.body)).to.equal(expectedResult);
                done();
            });
    });
});
