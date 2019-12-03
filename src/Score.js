class Score {
  constructor() {
    this.ball = 0
    this.strike = 0
    this.out = 0
    this.safety = 0
    this.point = 0
  }

  resetScore() {
    this.ball = 0
    this.strike = 0
    this.out = 0
    this.safety = 0
    this.point = 0
  }

  resetPreScore() {
    this.ball = 0
    this.strike = 0
  }

  updateScore(result) {
    this[result]++
    if (this.strike === 3) {
      this.out++
    }
    if (this.ball === 4) {
      this.safety++
    }
    this.point = this.calcPoint()
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
