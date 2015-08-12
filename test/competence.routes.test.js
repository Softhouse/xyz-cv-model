'use strict';

var expect = require('expect.js');
var server = require('../app/server');
var config = require('config');
var nock = require('nock');
var mockedUrl = config.API_URL;
var url = 'localhost:' + config.PORT;
var request = require('supertest');

describe('/competence', function() {

    afterEach(function(done) {
        nock.cleanAll();
        done();
    });

    it('should reply with HTTP status code 200 and a correctly formatted JSON object when getting competence', function(done) {
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

        var userToSkillConnectors = [
            {
                _id: '55c9b205d2f81e1a0098554c',
                userId: '55c9b204d2f81e1a00985510',
                skillId: '55c9b205d2f81e1a00985542',
                level: 1,
                years: 10,
                createdAt: '2015-08-11T08:27:49.384Z',
                updatedAt: '2015-08-11T08:27:49.384Z'
            },
            {
                _id: '55c9b205d2f81e1a0098554a',
                userId: '55c9b204d2f81e1a0098551a',
                skillId: '55c9b205d2f81e1a00985543',
                level: 5,
                years: 8,
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
            },
            {
                _id: '55c9b205d2f81e1a00985543',
                name: 'Cobol',
                icon: 'fa fa-flask',
                createdAt: '2015-08-11T08:27:49.177Z',
                updatedAt: '2015-08-11T08:27:49.177Z'
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

        var officeConnectors = [
            {
                _id: '55c9b205d2f81e1a0098556b',
                userId: '55c9b204d2f81e1a00985510',
                officeId: '55c9b205d2f81e1a00985515',
                createdAt: '2015-08-11T08:27:49.626Z',
                updatedAt: '2015-08-11T08:27:49.626Z'
            },
            {
                _id: '55c9b205d2f81e1a0098556c',
                userId: '55c9b204d2f81e1a0098551a',
                officeId: '55c9b205d2f81e1a00985520',
                createdAt: '2015-08-11T08:27:49.626Z',
                updatedAt: '2015-08-11T08:27:49.626Z'
            }
        ];

        var expectedResult = '{"competence":[{"skill":"Java","users":[{"name":"Enoch Mertz","level":1,"office":"Karlskrona","userId":"55c9b204d2f81e1a00985510"},{"name":"Marcus Lastname","level":"","office":"Miami","userId":"55c9b204d2f81e1a0098551a"}]},{"skill":"Cobol","users":[{"name":"Enoch Mertz","level":"","office":"Karlskrona","userId":"55c9b204d2f81e1a00985510"},{"name":"Marcus Lastname","level":5,"office":"Miami","userId":"55c9b204d2f81e1a0098551a"}]}],"offices":[{"offices":["Karlskrona","Miami"]}],"skills":[{"skills":["Java","Cobol"]}]}';

        nock(mockedUrl)

            .get('/userToSkillConnector')
            .reply(200, userToSkillConnectors)

            .get('/userToOfficeConnector')
            .reply(200, officeConnectors)

            .get('/user')
            .reply(200, users)

            .get('/skill')
            .reply(200, skills)

            .persist()
            .get('/office')
            .reply(200, offices);

        request(url)
            .get('/competence')
            .set('x-forwarded-email', 'a@softhouse.se')
            .send({
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
