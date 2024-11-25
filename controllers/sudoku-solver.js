class SudokuSolver {

  validate(puzzleString) {
    let puzzleRegex = /[^0-9.]+/gmi
    if (puzzleString && puzzleString.match(puzzleRegex)) {
      return { error: 'Invalid characters in puzzle' }
    } else if (String(puzzleString).length === 81) {
      return true
    } else {
      return false
    }
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let rows = {
      'A':[0,9],
      'B': [9,18],
      'C': [18,27],
      'D': [27,36],
      'E': [36,45],
      'F': [45,54],
      'G': [54,63],
      'H': [63,72],
      'I': [72,81]
    }

    let currentCell = rows[row][0] + Number(column-1)
    // if testing cell IS the value, return true as it should not conflict with itself
    if (puzzleString[currentCell] === value) {
      return true
    }
    // otherwise take slice of string and test for value
    let r = puzzleString.slice(rows[row][0], rows[row][1])
    if (r.includes(value)) {
      return false
    } else {
      return true
    }
  }

  checkColPlacement(puzzleString, row, column, value) {
    let col = Number(column)-1
    let rows = {
      'A':0, 'B':9, 'C':18, 'D':27, 'E':36, 'F':45, 'G':54, 'H':63, 'I':72
    }
    let currentCell = col + rows[row]

    for (let i = 0; i < 81; i = i+9) {
      if (col+i === currentCell) {
        // console.log('skipping current cell')
      } else if (puzzleString[col+i] === value) {
        return false
      }
    }
    return true
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let regions = [
      [
        0,1,2,
        9,10,11,
        18,19,20
      ],
      [
        3,4,5,
        12,13,14,
        21,22,23
      ],
      [
        6,7,8,
        15,16,17,
        24,25,26
      ],
      [
        27,28,29,
        36,37,38,
        45,46,47
      ],
      [
        30,31,32,
        39,40,41,
        48,49,50
      ],
      [
        33,34,35,
        42,43,44,
        51,52,53
      ],
      [
        54,55,56,
        63,64,65,
        72,73,74
      ],
      [
        57,58,59,
        66,67,68,
        75,76,77
      ],
      [
        60,61,62,
        69,70,71,
        78,79,80
      ]
    ]
    let row_id = {
      'A':0, 'B':9, 'C':18, 'D':27, 'E':36, 'F':45, 'G':54, 'H':63, 'I':72
    }

    // to find string index: take col num - 1, add row_id (D4 = 3 (col-1) + 27 (D row_id) = 30 (index in puzzleString that you are testing))
    let StrIndex = (Number(column)-1) + row_id[row]
    let result = true
    if (puzzleString[StrIndex] === value) {
      return true
    }
    // use index in string to find which region the value would be in
    regions.forEach(region => {
      // check that region for value
      if (region.includes(StrIndex)) {
        region.forEach(i => {
          if (puzzleString[i] === value) {
            result = false
          }
        })
      }
    })
    return result
  }

  solve(puzzleString) {
    let puzzle = puzzleString
    let testPuzzle = puzzleString.split('')
    let options = []
    let candidates = []
    let row;
    let col;
    let solved = false;
    // arrays where if x is between [1] and [2], row = [0]
    let rows = [
      ['A',0,8],
      ['B',9,17],
      ['C',18,26],
      ['D',27,35],
      ['E',36,44],
      ['F',45,53],
      ['G',54,62],
      ['H',63,71],
      ['I',72,80]
    ]
    // object where if x = key, col = value
    let cols = {
      0:1,
      1:2,
      2:3,
      3:4,
      4:5,
      5:6,
      6:7,
      7:8,
      8:9
    }

    // array of cells that are not pre-filled and therefore editable
    for (let i = 0; i < puzzle.length; i += 1) {
      if (puzzle[i] === '.') {
        options.push(i)
      }
    }
    // console.log(options.length)

    // array of arrays, each array corresponding to an entry in options
    for (let o = 0; o < options.length; o+=1) {
      candidates.push([])
    }
    // console.log(candidates.length)

    while (!solved) {
        let comparison = testPuzzle.join('')
        // x = string cursor
        for (let x = 0; x < options.length; x += 1) {
          // get row based on position in string
          for (let r = 0; r < rows.length; r += 1) {
            if (options[x] >= rows[r][1] && options[x] <= rows[r][2]) {
              row = rows[r][0]
              break
            }
          }
          // get column based on position in string % 9
          col = cols[options[x]%9]

          // for each possible number, test cells for validity
          for (let n = 1; n < 10; n+=1) {
            let rowCheck = this.checkRowPlacement(testPuzzle.join(''),row,col,n)
            let colCheck = this.checkColPlacement(testPuzzle.join(''),row,col,String(n))
            let regionCheck = this.checkRegionPlacement(testPuzzle.join(''),row,col,String(n))
            // if valid, save number as a candidate in array that matches position x in options
            if (rowCheck && colCheck && regionCheck) {
            if (testPuzzle[options[x]] !== n) {
                candidates[x].push(n)
              }
            }
          }

          // for each candidate array
          for (let c = 0; c < candidates.length; c+=1) {
            // if only 1 candidate, set position x to candidate number
            if (candidates[c].length === 1) {
              testPuzzle[options[c]] = candidates[c][0]
            // if 2 candidates, and one has been tested, test the other
            } else if (candidates[c].length === 2) {
              if (testPuzzle[options[c]] === candidates[c][0]) {
                testPuzzle[options[c]] = candidates[c][1]
              } else if (testPuzzle[options[c]] === candidates[c][1]) {
                testPuzzle[options[c]] = candidates[c][0]
              }
            }
            // reset candidate arrays for new run
            candidates[c] = []
          }
          
      }
      // if no changes could be made to progress solution, return false (unsolvable)
      if (comparison === testPuzzle.join('')) {
        return false
      }
      // if no more blank spaces, exit while loop
      if (!testPuzzle.includes('.')) {
        solved = true
      }
        
    }
    // console.log(testPuzzle)
    // console.log(testPuzzle.join(''))

    return testPuzzle.join('')    
  }
}

module.exports = SudokuSolver;

