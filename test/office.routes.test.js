'use strict';

var expect = require('expect.js');
var server = require('../app/server');
var config = require('config');
var nock = require('nock');
var mockedUrl = config.API_URL;
var url = 'localhost:' + config.PORT;
var request = require('supertest');

describe('/office', function() {

    afterEach(function(done) {
        nock.cleanAll();
        done();
    });

    it('should reply with HTTP status code 200 and a correctly formatted JSON object when getting an office', function(done) {
        var office = {
            _id: '55c9b205d2f81e1a00985515',
            name: 'Karlskrona',
            createdAt: '2015-08-11T08:27:49.004Z',
            updatedAt: '2015-08-11T08:27:49.004Z'
        };

        var userToOfficeConnectors = [
            {
                _id: '55c9b205d2f81e1a00985515',
                userId: '55c9b204d2f81e1a00985510',
                officeId: '55c9b205d2f81e1a00985515',
                createdAt: '2015-08-11T08:27:49.368Z',
                updatedAt: '2015-08-11T08:27:49.368Z'
            }
        ];

        var userToSkillConnectors = [
            {
                _id: '55c9b205d2f81e1a0098554c',
                userId: '55c9b204d2f81e1a00985510',
                skillId: '55c9b205d2f81e1a00985542',
                level: 1,
                years: 10,
                createdAt: '2015-08-11T08:27:49.384Z',
                updatedAt: '2015-08-11T08:27:49.384Z'
            }
        ];

        var skills = [
            {
                _id: '55c9b205d2f81e1a00985542',
                name: 'Java',
                icon: 'fa fa-flask',
                createdAt: '2015-08-11T08:27:49.177Z',
                updatedAt: '2015-08-11T08:27:49.177Z'
            }
        ];

        var params = {officeId: '55c9b205d2f81e1a00985515'};

        var expectedResult = '{"office":{"_id":"55c9b205d2f81e1a00985515","name":"Karlskrona","createdAt":"2015-08-11T08:27:49.004Z","updatedAt":"2015-08-11T08:27:49.004Z"},"skillFrequencyMap":{"55c9b205d2f81e1a00985542":{"_id":"55c9b205d2f81e1a00985542","name":"Java","icon":"fa fa-flask","createdAt":"2015-08-11T08:27:49.177Z","updatedAt":"2015-08-11T08:27:49.177Z","users":1}},"graphData":{"labels":["Java"],"datasets":[{"label":"Karlskrona","data":[1]}]}}';

        nock(mockedUrl)
            .get('/office/55c9b205d2f81e1a00985515')
            .reply(200, office)

            .get('/userToOfficeConnector?officeId=55c9b205d2f81e1a00985515')
            .reply(200, userToOfficeConnectors)

            .get('/userToSkillConnector')
            .reply(200, userToSkillConnectors)

            .get('/skill')
            .reply(200, skills);

        request(url)
            .get('/office/55c9b205d2f81e1a00985515')
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
