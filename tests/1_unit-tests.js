const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

suite('Unit Tests', () => {
    test('Successfully handles a valid puzzle string of 81 characters', function() {
        assert.typeOf(solver.validate('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'), 'boolean');
        assert.strictEqual(solver.validate('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'), true);
    })
    test('Successfully handles a puzzle with invalid characters', function() {
        assert.typeOf(solver.validate('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.3dw'),'Object');
        assert.property(solver.validate('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.3dw'),'error')
        assert.equal(solver.validate('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.3dw').error,'Invalid characters in puzzle')
    })
    test('Successfully handles a puzzle of invalid length', function() {
        assert.typeOf(solver.validate('.7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.'), 'boolean');
        assert.strictEqual(solver.validate('.7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.'), false);
        assert.typeOf(solver.validate('.7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.............'), 'boolean');
        assert.strictEqual(solver.validate('.7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.............'), false);
    })
    test('Successfully handle valid row placement', function() {
        assert.typeOf(solver.checkRowPlacement('.7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.','A',1,'3'), 'boolean')
        assert.strictEqual(solver.checkRowPlacement('.7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.','A',1,'3'), true)
    })
    test('Successfully handle invalid row placement', function() {
        assert.typeOf(solver.checkRowPlacement('.7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.','A',1,'7'), 'boolean')
        assert.strictEqual(solver.checkRowPlacement('.7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.','A',1,'7'), false)
    })
    test('Successfully handle valid column placement', function() {
        assert.typeOf(solver.checkColPlacement('.7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.','A',1,'3'), 'boolean')
        assert.strictEqual(solver.checkColPlacement('.7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.','A',1,'3'), true)
    })
    test('Successfully handle invalid column placement', function() {
        assert.typeOf(solver.checkColPlacement('.7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.','A',1,'7'), 'boolean')
        assert.strictEqual(solver.checkColPlacement('.7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.','A',1,'7'), false)
    })
    test('Successfully handle valid region placement', function() {
        assert.typeOf(solver.checkRegionPlacement('.7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.','A',1,'3'), 'boolean')
        assert.strictEqual(solver.checkRegionPlacement('.7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.','A',1,'3'), true)
    })
    test('Successfully handle invalid region placement', function() {
        assert.typeOf(solver.checkRegionPlacement('.7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.','A',1,'7'), 'boolean')
        assert.strictEqual(solver.checkRegionPlacement('.7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.','A',1,'7'), false)
    })
    test('Successfully solve valid puzzle strings', function() {
        assert.typeOf(solver.solve('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'), 'string');
        assert.strictEqual(solver.solve('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'), '135762984946381257728459613694517832812936745357824196473298561581673429269145378')
    })
    test('Successfully handles invalid puzzle string', function() {
        assert.typeOf(solver.solve('15.....8.........7.4.8..2....92..3..5..3.9..8..6.1.4....5..7.1.6.........7.....43'), 'boolean')
        assert.strictEqual(solver.solve('15.....8.........7.4.8..2....92..3..5..3.9..8..6.1.4....5..7.1.6.........7.....43'), false)
    })
    test('Successfully return solution to valid incomplete puzzle', function() {
        assert.typeOf(solver.solve('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'), 'string');
        assert.strictEqual(solver.solve('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'),'135762984946381257728459613694517832812936745357824196473298561581673429269145378')
    })

});