class SudokuSolver {

  validate(puzzleString) {
    if (puzzleString.length === 81) {
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
      'D': [27, 36],
      'E': [36, 45],
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
        console.log('skipping current cell')
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
    
  }
}

module.exports = SudokuSolver;

