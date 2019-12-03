class Score {
  constructor() {
    this.ball = 0
    this.strike = 0
    this.out = 0
    this.safety = 0
    this.point = 0
    this.accSafety = 0
    this.accStrikeout = 0
    this.pitchCount = 0
  }

  resetScore() {
    this.ball = 0
    this.strike = 0
    this.out = 0
    this.safety = 0
    this.point = 0
  }

  resetPrePlayerScore() {
    this.ball = 0
    this.strike = 0
  }

  updateInningPoint() {
    this.point += this.calcPoint()
  }

  resetPreInningScore() {
    this.safety = 0
    this.out = 0
  }

  updateScore(result) {
    this[result]++
    if (this.strike === 3) {
      this.out++
      this.accStrikeout++
    }
    if (this.ball === 4) {
      this.safety++
    }
    if (result === 'safety') {
      this.accSafety++
    }
  }

  calcPoint() {
    let point = 0
    if (this.safety >= 4) {
      point += 1
      point += this.safety - 4
    }
    return point
  }
}

exports.Score = Score
