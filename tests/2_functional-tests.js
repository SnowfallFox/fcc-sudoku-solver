const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
    suite('POST /api/solve tests', function() {
        test('Successfully solve a valid puzzle string', function(done) {
            chai
                .request(server)
                .keepOpen()
                .post('/api/solve')
                .send({ puzzle:'82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51' })
                .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.property(res.body, 'solution')
                assert.equal(res.body.solution, '827549163531672894649831527496157382218396475753284916962415738185763249374928651');
                done();
            });
        })
        test('Successfully handle a missing puzzle string', function(done) {
            chai
                .request(server)
                .keepOpen()
                .post('/api/solve')
                .send({  })
                .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.property(res.body, 'error')
                assert.equal(res.body.error, 'Required field missing');
                done();
            });
        })
        test('Successfully handle an invalid puzzle string', function(done) {
            chai
                .request(server)
                .keepOpen()
                .post('/api/solve')
                .send({ puzzle:'82..4..6...e6..89...98315.749.157....,........53..4...96.415..81..7632..3...28.51' })
                .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.property(res.body, 'error')
                assert.equal(res.body.error, 'Invalid characters in puzzle');
                done();
            });
        })
        test('Successfully handle a puzzle string of invalid length', function(done) {
            chai
                .request(server)
                .keepOpen()
                .post('/api/solve')
                .send({ puzzle:'82..4..6...16..89...98315.749.157.53..4...96.415..81..7632..3...28.51' })
                .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.property(res.body, 'error')
                assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
                done();
            });
        })
        test('Successfully handle an invalid (unsolvable) puzzle', function(done) {
            chai
                .request(server)
                .keepOpen()
                .post('/api/solve')
                .send({ puzzle:'15.....8.........7.4.8..2....92..3..5..3.9..8..6.1.4....5..7.1.6.........7.....43' })
                .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.property(res.body, 'error')
                assert.equal(res.body.error, 'Puzzle cannot be solved');
                done();
            });
        })
    })
    suite('POST /api/check tests', function() {
        test('Successfully respond to valid placement (all placements)', function(done) {
            chai
                .request(server)
                .keepOpen()
                .post('/api/check')
                .send({ puzzle:'..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', coordinate:'A1', value:'7'  })
                .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.property(res.body, 'valid')
                assert.equal(res.body.valid, true);
                done();
            });
        })
        test('Successfully respond to a single placement conflict', function(done) {
            chai
                .request(server)
                .keepOpen()
                .post('/api/check')
                .send({ puzzle:'..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', coordinate:'A1', value:'2'  })
                .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.property(res.body, 'valid')
                assert.equal(res.body.valid, false);
                assert.property(res.body, 'conflict')
                assert.deepEqual(res.body.conflict, ['region'])
                done();
            });
        })
        test('Successfully respond to multiple placement conflicts', function(done) {
            chai
                .request(server)
                .keepOpen()
                .post('/api/check')
                .send({ puzzle:'..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', coordinate:'A1', value:'4'  })
                .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.property(res.body, 'valid')
                assert.equal(res.body.valid, false);
                assert.property(res.body, 'conflict')
                assert.deepEqual(res.body.conflict, ['column', 'region'])
                done();
            });
        })
        test('Successfully respond to all placement conflicts', function(done) {
            chai
                .request(server)
                .keepOpen()
                .post('/api/check')
                .send({ puzzle:'..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', coordinate:'A1', value:'5'  })
                .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.property(res.body, 'valid')
                assert.property(res.body, 'conflict')
                assert.equal(res.body.valid, false)
                assert.deepEqual(res.body.conflict, ['row', 'column', 'region'])
                done();
            });
        })
        test('Successfully respond to missing required fields', function(done) {
            chai
                .request(server)
                .keepOpen()
                .post('/api/check')
                .send({ puzzle:'..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',   })
                .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.property(res.body, 'error')
                assert.deepEqual(res.body.error, 'Required field(s) missing')
                done();
            });
        })
        test('Successfully respond to a puzzle with invalid characters', function(done) {
            chai
                .request(server)
                .keepOpen()
                .post('/api/check')
                .send({ puzzle:'1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.3dw', coordinate:'A1', value:'5'  })
                .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.property(res.body, 'error')
                assert.deepEqual(res.body.error, 'Invalid characters in puzzle')
                done();
            });
        })
        test('Successfully respond to a puzzle with invalid characters', function(done) {
            chai
                .request(server)
                .keepOpen()
                .post('/api/check')
                .send({ puzzle:'1.5..2.84..63.12.7.2..5..9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.3', coordinate:'A1', value:'5'  })
                .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.property(res.body, 'error')
                assert.deepEqual(res.body.error, 'Expected puzzle to be 81 characters long')
                done();
            });
        })
        test('Successfully respond to a puzzle with invalid coordinate', function(done) {
            chai
                .request(server)
                .keepOpen()
                .post('/api/check')
                .send({ puzzle:'..9..5.1.85.4....2432..1...69.83.9...6.62.71...9......1945....4.37.4.3..6..', coordinate:'K3', value:'4'  })
                .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.property(res.body, 'error')
                assert.deepEqual(res.body.error, 'Invalid coordinate')
                done();
            });
        })
        test('Successfully respond to a puzzle with invalid value', function(done) {
            chai
                .request(server)
                .keepOpen()
                .post('/api/check')
                .send({ puzzle:'..9..5.1.85.4....2432..1...69.83.9...6.62.71...9......1945....4.37.4.3..6..', coordinate:'A1', value:'A'  })
                .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.property(res.body, 'error')
                assert.deepEqual(res.body.error, 'Invalid value')
                done();
            });
        })
    })

    
});

