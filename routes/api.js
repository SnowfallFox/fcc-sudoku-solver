'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      let puzzle = req.body.puzzle;
      let coord = req.body.coordinate;
      let value = req.body.value;
      let valid = true;
      let conflicts = [];
      let coordRegex1 = /[a-iA-I]/gm
      let coordRegex2 = /[1-9]/gm
      let validation = solver.validate(puzzle)

      // if required fields missing, throw error
      if (!req.body.puzzle || !req.body.coordinate || !req.body.value) {
        console.log(puzzle, coord, value)
        res.json({ error:'Required field(s) missing' })
      // if invalid coordinate entered, throw error
      } else if (String(coord).length !== 2 || !coord[0].match(coordRegex1) || !coord[1].match(coordRegex2)) {
        res.json({ error: 'Invalid coordinate' })
      // if invalid value, throw error
      } else if (isNaN(value) || value < 1 || value > 9) {
        res.json({ error: 'Invalid value' })
      // if puzzle passes length validation check
      } else if (validation === true) {
        // if any return false, conflict = all false returns and valid = false
        if (!solver.checkRowPlacement(puzzle,coord[0].toUpperCase(),coord[1], value)) {
          conflicts.push('row')
        } 
        if (!solver.checkColPlacement(puzzle,coord[0].toUpperCase(),coord[1], value)) {
          conflicts.push('column')
        }
        if (!solver.checkRegionPlacement(puzzle,coord[0].toUpperCase(),coord[1], value)) {
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
          res.json({ valid:valid, conflict:conflicts })
        }
      // if puzzle string is too long or short
      } else if (!validation) {
        res.json({ error: 'Expected puzzle to be 81 characters long' })
      } else {
        res.json({ error: 'Invalid characters in puzzle' })
      }
    });
    

  app.route('/api/solve')
    .post((req, res) => {
      let puzzle = req.body.puzzle;
      
      // if required fields missing, throw error
      if (!puzzle) {
        res.json({  error: 'Required field missing' })
      // if puzzle passes length validation check
      } else if (solver.validate(puzzle) === true) {
        if (solver.solve(puzzle)) {
          res.json({ solution:solver.solve(puzzle) })
        }
        res.json({ error:'Puzzle cannot be solved' })
      // if puzzle string is too long or short
      } else if (!solver.validate(puzzle)) {
        res.json({ error: 'Expected puzzle to be 81 characters long' })
      } else {
        res.json({ error: 'Invalid characters in puzzle'})
      }
    });
};
