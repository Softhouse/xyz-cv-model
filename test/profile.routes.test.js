'use strict';

var expect = require('expect.js');
var server = require('../app/server');
var config = require('config');
var nock = require('nock');
var mockedUrl = config.API_URL;
var url = 'localhost:' + config.PORT;
var request = require('supertest');

describe('/profile', function() {

    var userToOfficeConnectors = [
        {
            _id: '55c9b205d2f81e1a00985515',
            userId: '55c9b204d2f81e1a00985510',
            officeId: '55c9b205d2f81e1a00985515',
            createdAt: '2015-08-11T08:27:49.368Z',
            updatedAt: '2015-08-11T08:27:49.368Z'
        }
    ];

    var office = {
        _id: '55c9b205d2f81e1a00985515',
        name: 'Karlskrona',
        createdAt: '2015-08-11T08:27:49.004Z',
        updatedAt: '2015-08-11T08:27:49.004Z'
    };

    var currentUser = {
        _id: '55c9b204d2f81e1a00985510',
        email: 'admin@softhouse.se',
        name: 'Admin Adminsson',
        role: 'admin',
        hidden: false,
        phoneNumber: '751-408-1392',
        employeeNumber: 1593,
        position: 'Product Optimization Strategist',
        closestSuperior: 'Helen Bechtelar',
        startDateOfEmployment: '2015-08-04T15:38:38.898Z',
        endDateOfEmployment: null,
        certificates:
        ['Bachelor of Science in Engineering in navigating',
        'undefinedtime-frame'],
        ICEName: 'Anabelle Rolfson',
        ICEPhone: '583-325-5406',
        profileImage: null,
        personalIdNumber: 'c367ea55-c5bd-415f-8c1c-7b61ea01085a',
        sex: 'female',
        description: 'libero inventore ut doloribus voluptatibus cumque eum explicabo cum consequatur',
        personalInterests: ['navigating', 'platforms'],
        foodPreferences: 'at dolores ratione debitis',
        shirtSize: 'XXL',
        customHeaders:
        [{title: 'New Jersey',
        body: 'In-state possessions: 379.15 Rupiah'},
        {title: 'Borders',
        body: 'In-county possessions: 604.63 Kwanza'}],
        linkedin: 'https://www.linkedin.com/in/williamhgates',
        facebook: 'https://www.facebook.com/BillGates',
        twitter: 'https://twitter.com/billgates',
        country: 'Zambia',
        address: '995 Tate Green',
        city: 'South Misael',
        ZIP: '75135',
        createdAt: '2015-08-11T08:27:48.968Z',
        updatedAt: '2015-08-11T08:27:48.968Z'
    };

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

    var userToSkill = {
        _id: '55c9b205d2f81e1a0098554c',
        userId: '55c9b204d2f81e1a00985510',
        skillId: '55c9b205d2f81e1a00985542',
        level: 1,
        years: 10,
        createdAt: '2015-08-11T08:27:49.384Z',
        updatedAt: '2015-08-11T08:27:49.384Z'
    };

    var role = {
        _id: '55c9b205d2f81e1a0098551b',
        name: 'admin',
        createdAt: '2015-08-11T08:27:49.084Z',
        updatedAt: '2015-08-11T08:27:49.084Z'
    };

    var userToAssignmentsConnector = [
        {
            _id: '55c9b205d2f81e1a00985566',
            userId: '55c9b204d2f81e1a00985510',
            assignmentId: '55c9b205d2f81e1a00985521',
            skills: ['55c9b205d2f81e1a00985542'],
            dateFrom: '2015-04-13T18:10:49.640Z',
            dateTo: '2015-05-13T18:10:49.640Z',
            description: 'quaerat itaque dicta aut eos qui excepturi',
            createdAt: '2015-08-11T08:27:49.608Z',
            updatedAt: '2015-08-11T08:27:49.608Z'
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

    var assignments = [
        {
            _id: '55c9b205d2f81e1a00985521',
            name: 'madge.info',
            createdAt: '2015-08-11T08:27:49.046Z',
            updatedAt: '2015-08-11T08:27:49.046Z'
        }
    ];

    afterEach(function(done) {
        nock.cleanAll();
        done();
    });

    it('should reply with HTTP status code 200 and a correctly formatted JSON object when getting current profile', function(done) {

        var expectedResult = '{"user":{"_id":"55c9b204d2f81e1a00985510","email":"admin@softhouse.se","name":"Admin Adminsson","role":null,"hidden":false,"phoneNumber":"751-408-1392","employeeNumber":1593,"position":"Product Optimization Strategist","closestSuperior":"Helen Bechtelar","startDateOfEmployment":"2015-08-04T15:38:38.898Z","endDateOfEmployment":null,"certificates":["Bachelor of Science in Engineering in navigating","undefinedtime-frame"],"ICEName":"Anabelle Rolfson","ICEPhone":"583-325-5406","profileImage":null,"personalIdNumber":"c367ea55-c5bd-415f-8c1c-7b61ea01085a","sex":"female","description":"libero inventore ut doloribus voluptatibus cumque eum explicabo cum consequatur","personalInterests":["navigating","platforms"],"foodPreferences":"at dolores ratione debitis","shirtSize":"XXL","customHeaders":[{"title":"New Jersey","body":"In-state possessions: 379.15 Rupiah"},{"title":"Borders","body":"In-county possessions: 604.63 Kwanza"}],"linkedin":"https://www.linkedin.com/in/williamhgates","facebook":"https://www.facebook.com/BillGates","twitter":"https://twitter.com/billgates","country":"Zambia","address":"995 Tate Green","city":"South Misael","ZIP":"75135","createdAt":"2015-08-11T08:27:48.968Z","updatedAt":"2015-08-11T08:27:48.968Z","skills":[{"_id":"55c9b205d2f81e1a00985542","name":"Java","icon":"fa fa-flask","createdAt":"2015-08-11T08:27:49.177Z","updatedAt":"2015-08-11T08:27:49.177Z","level":1,"years":10}],"assignments":[{"_id":"55c9b205d2f81e1a00985521","name":"madge.info","createdAt":"2015-08-11T08:27:49.046Z","updatedAt":"2015-08-11T08:27:49.046Z","skills":[{"_id":"55c9b205d2f81e1a00985542","name":"Java","icon":"fa fa-flask","createdAt":"2015-08-11T08:27:49.177Z","updatedAt":"2015-08-11T08:27:49.177Z"}],"dateFrom":"2015-04-13T18:10:49.640Z","dateTo":"2015-05-13T18:10:49.640Z","description":"quaerat itaque dicta aut eos qui excepturi"}],"office":{"_id":"55c9b205d2f81e1a00985515","name":"Karlskrona","createdAt":"2015-08-11T08:27:49.004Z","updatedAt":"2015-08-11T08:27:49.004Z"}},"cloud":{"map":{"Java":{"text":"Java","weight":2,"opacity":1},"madge.info":{"text":"madge.info","weight":1,"opacity":0.5},"Karlskrona":{"text":"Karlskrona","weight":1,"opacity":0.5},"Zambia":{"text":"Zambia","weight":1,"opacity":0.5}},"words":[{"text":"Java","weight":2,"opacity":1},{"text":"Zambia","weight":1,"opacity":0.5},{"text":"Karlskrona","weight":1,"opacity":0.5},{"text":"madge.info","weight":1,"opacity":0.5}],"maxWeight":2}}';

        nock(mockedUrl)
            .get('/office/55c9b205d2f81e1a00985515')
            .reply(200, office)

            .get('/userToOfficeConnector?officeId=55c9b205d2f81e1a00985515')
            .reply(200, userToOfficeConnectors)

            .get('/userToOfficeConnector?userId=55c9b204d2f81e1a00985510')
            .reply(200, userToOfficeConnectors)

            .get('/role?name=admin')
            .reply(200, role)

            .get('/user/current')
            .reply(200, currentUser)

            .get('/skill')
            .reply(200, skills)

            .get('/assignment')
            .reply(200, assignments)

            .get('/userToAssignmentConnector?userId=55c9b204d2f81e1a00985510')
            .reply(200, userToAssignmentsConnector)

            .persist()
            .get('/userToSkillConnector?userId=55c9b204d2f81e1a00985510')
            .reply(200, userToSkillConnectors);

        request(url)
            .get('/profile/current')
            .set('x-forwarded-email', 'a@softhouse.se')
            .send()

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

    it('should reply with HTTP status code 200 and a correctly formatted JSON object when getting a profile by user id.', function(done) {

        var expectedResult = '{"user":{"_id":"55c9b204d2f81e1a00985510","email":"admin@softhouse.se","name":"Admin Adminsson","role":null,"hidden":false,"phoneNumber":"751-408-1392","employeeNumber":1593,"position":"Product Optimization Strategist","closestSuperior":"Helen Bechtelar","startDateOfEmployment":"2015-08-04T15:38:38.898Z","endDateOfEmployment":null,"certificates":["Bachelor of Science in Engineering in navigating","undefinedtime-frame"],"ICEName":"Anabelle Rolfson","ICEPhone":"583-325-5406","profileImage":null,"personalIdNumber":"c367ea55-c5bd-415f-8c1c-7b61ea01085a","sex":"female","description":"libero inventore ut doloribus voluptatibus cumque eum explicabo cum consequatur","personalInterests":["navigating","platforms"],"foodPreferences":"at dolores ratione debitis","shirtSize":"XXL","customHeaders":[{"title":"New Jersey","body":"In-state possessions: 379.15 Rupiah"},{"title":"Borders","body":"In-county possessions: 604.63 Kwanza"}],"linkedin":"https://www.linkedin.com/in/williamhgates","facebook":"https://www.facebook.com/BillGates","twitter":"https://twitter.com/billgates","country":"Zambia","address":"995 Tate Green","city":"South Misael","ZIP":"75135","createdAt":"2015-08-11T08:27:48.968Z","updatedAt":"2015-08-11T08:27:48.968Z","skills":[{"_id":"55c9b205d2f81e1a00985542","name":"Java","icon":"fa fa-flask","createdAt":"2015-08-11T08:27:49.177Z","updatedAt":"2015-08-11T08:27:49.177Z","level":1,"years":10}],"assignments":[{"_id":"55c9b205d2f81e1a00985521","name":"madge.info","createdAt":"2015-08-11T08:27:49.046Z","updatedAt":"2015-08-11T08:27:49.046Z","skills":[{"_id":"55c9b205d2f81e1a00985542","name":"Java","icon":"fa fa-flask","createdAt":"2015-08-11T08:27:49.177Z","updatedAt":"2015-08-11T08:27:49.177Z"}],"dateFrom":"2015-04-13T18:10:49.640Z","dateTo":"2015-05-13T18:10:49.640Z","description":"quaerat itaque dicta aut eos qui excepturi"}],"office":{"_id":"55c9b205d2f81e1a00985515","name":"Karlskrona","createdAt":"2015-08-11T08:27:49.004Z","updatedAt":"2015-08-11T08:27:49.004Z"}},"cloud":{"map":{"Java":{"text":"Java","weight":2,"opacity":1},"madge.info":{"text":"madge.info","weight":1,"opacity":0.5},"Karlskrona":{"text":"Karlskrona","weight":1,"opacity":0.5},"Zambia":{"text":"Zambia","weight":1,"opacity":0.5}},"words":[{"text":"Java","weight":2,"opacity":1},{"text":"Zambia","weight":1,"opacity":0.5},{"text":"Karlskrona","weight":1,"opacity":0.5},{"text":"madge.info","weight":1,"opacity":0.5}],"maxWeight":2}}';
        var params = {userId: '55c9b204d2f81e1a00985510'};

        nock(mockedUrl)
            .get('/office/55c9b205d2f81e1a00985515')
            .reply(200, office)

            .get('/userToOfficeConnector?officeId=55c9b205d2f81e1a00985515')
            .reply(200, userToOfficeConnectors)

            .get('/userToOfficeConnector?userId=55c9b204d2f81e1a00985510')
            .reply(200, userToOfficeConnectors)

            .get('/role?name=admin')
            .reply(200, role)

            .get('/user/55c9b204d2f81e1a00985510')
            .reply(200, currentUser)

            .get('/skill')
            .reply(200, skills)

            .get('/assignment')
            .reply(200, assignments)

            .get('/userToAssignmentConnector?userId=55c9b204d2f81e1a00985510')
            .reply(200, userToAssignmentsConnector)

            .persist()
            .get('/userToSkillConnector?userId=55c9b204d2f81e1a00985510')
            .reply(200, userToSkillConnectors);

        request(url)
            .get('/profile/55c9b204d2f81e1a00985510')
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
