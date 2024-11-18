'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();
  // TODO: tests 10 and 13
  app.route('/api/check')
    .post((req, res) => {
      let puzzle = req.body.puzzle;
      let coord = req.body.coordinate;
      let value = req.body.value;
      let valid = true;
      let conflicts = [];
      let validation = solver.validate(puzzle)

      if (!puzzle || !coord || !value) {
        res.json({  error: 'Required field(s) missing' })
      }

      if (isNaN(value) || value < 1 || value > 9) {
        res.json({ error: 'Invalid value' })
      }
      
      if (validation) {
        // if any return false, conflict = all false returns and valid = false
        if (!solver.checkRowPlacement(puzzle,coord[0],coord[1], value)) {
          conflicts.push('row')
        } 
        if (!solver.checkColPlacement(puzzle,coord[0],coord[1], value)) {
          conflicts.push('column')
        }
        if (!solver.checkRegionPlacement(puzzle,coord[0],coord[1], value)) {
          conflicts.push('region')
        }
        
        if (conflicts.length > 0) {
          valid = false;
        }
        // if no conflicts
        if (valid) {
          res.json({ valid:valid })
        // if conflicts
        } else {
          res.json({ valid:valid, conflicts:conflicts})
        }
      // if puzzle string is too long or short
      } else {
        res.json({ error: 'Expected puzzle to be 81 characters long' })
      }
    });
    
  app.route('/api/solve')
    .post((req, res) => {

    });
};
