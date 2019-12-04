class BaseballGame {
  constructor() {
    this.ball = 0
    this.strike = 0
    this.out = 0
    this.safety = 0
  }

  _init() {
    this.ball = 0
    this.strike = 0
    this.safety = 0
    this.out = 0
  }

  start() {
    this._init()
    console.log(`신나는 야구 게임! \n첫 번 째 타자가 타석에 입장했습니다. \n`)
    while (!this.isGameOver()) {
      this.play()
    }
    console.log(`최종 안타수: ${this.safety} \nGAME OVER`)
  }

  play() {
    const result = this.getRandomResult()
    this.updateScore(result)
    const isNextPlayerTurn = this.isNextPlayerTurn(result)
    const scoreResultString = this.getResultString(result, isNextPlayerTurn)
    if (isNextPlayerTurn || this.out === 3) {
      this.resetPrePlayerScore()
    }
    this.printScore(scoreResultString)
  }

  isNextPlayerTurn(result) {
    return (
      this.out < 3 &&
      (this.ball === 4 ||
        this.strike === 3 ||
        result === 'safety' ||
        result === 'out')
    )
  }

  resetPrePlayerScore() {
    this.ball = 0
    this.strike = 0
  }

  isGameOver() {
    return this.out === 3
  }

  updateScore(result) {
    this[result]++
    if (this.strike === 3) {
      this.out++
    }
    if (this.ball === 4) {
      this.safety++
    }
  }

  getResultString(result, isNextPlayerTurn) {
    const resultInKorean = this.resultToKorean(result)
    let resultScoreString = `${resultInKorean} ! `
    if (isNextPlayerTurn && (result === 'safety' || result === 'out')) {
      resultScoreString += '다음 타자가 타석에 입장했습니다.'
    } else if (isNextPlayerTurn) {
      resultScoreString += this.getAccStrikeAndBallMsg()
    } else if (this.out === 3 && result !== 'out') {
      resultScoreString += '\n아웃 !'
    }
    this.updateAccStrikeAndBall()
    resultScoreString += `\n${this.strike}S ${this.ball}B ${this.out}O`
    return `\n${resultScoreString}\n`
  }

  getAccStrikeAndBallMsg() {
    return `\n${
      this.ball === 4 ? '안타' : '아웃'
    } ! 다음 타자가 타석에 입장했습니다.`
  }

  updateAccStrikeAndBall() {
    if (this.strike === 3) {
      this.strike = 0
    }
    if (this.ball === 4) {
      this.ball = 0
    }
  }

  printScore(scoreResult) {
    console.log(scoreResult)
  }

  resultToKorean(result) {
    switch (result) {
      case 'ball':
        return '볼'
      case 'strike':
        return '스트라이크'
      case 'out':
        return '아웃'
      case 'safety':
        return '안타'
    }
  }

  getRandomResult() {
    const results = ['ball', 'strike', 'out', 'safety']
    const randomNumber = Math.floor(Math.random() * 4)
    return results[randomNumber]
  }
}
exports.BaseballGame = BaseballGame
