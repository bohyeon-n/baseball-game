class BaseballGame {
  constructor(team1, team2, userInput) {
    this.ball = 0
    this.strike = 0
    this.out = 0
    this.safety = 0
    this.team1 = team1
    this.team2 = team2
    this.userInput = userInput
  }

  _init() {
    this.ball = 0
    this.strike = 0
    this.safety = 0
    this.out = 0
  }

  async setTeams() {
    await this.team1.setTeam()
    await this.team2.setTeam()
  }

  async printTeamsInfo() {
    this.team1.printTeamInfo()
    this.team2.printTeamInfo()
  }

  getMenu(isAbleMathStart) {
    let menu = `
    신나는 야구시합
    1. 데이터 입력
    2. 데이터 출력
    `
    if (isAbleMathStart) {
      menu += `3. 시합하기
      `
    }
    return menu
  }

  async onSelectMenu(selectedMenuNumber) {
    switch (selectedMenuNumber) {
      case '1':
        await this.setTeams()
        break
      case '2':
        this.printTeamsInfo()
        break
      case '3':
        this.math()
        break
      default:
        console.log('메뉴를 잘못 선택하셨습니다.')
    }
  }

  async PrintMenu(menu) {
    console.log(menu)
  }

  async getSelectedMenu(isAbleMathStart) {
    const selectMessage = isAbleMathStart
      ? '메뉴선택(1 - 3)'
      : '메뉴선택 (1 - 2)'
    const selectedMenu = await this.userInput.question(selectMessage)
    return this.isValidMenuNumber(selectedMenu, isAbleMathStart)
      ? selectedMenu
      : null
  }

  isValidMenuNumber(selectedMenu, isAbleMathStart) {
    if (isAbleMathStart) {
      return (
        selectedMenu === '1' || selectedMenu === '2' || selectedMenu === '3'
      )
    } else {
      return selectedMenu === '1' || selectedMenu === '2'
    }
  }

  async openMenu() {
    const isAbleMathStart = this.team1.players && this.team2.players
    const menu = this.getMenu(isAbleMathStart)
    this.PrintMenu(menu)
    const selectedMenu = await this.getSelectedMenu(isAbleMathStart)
    await this.onSelectMenu(selectedMenu)
  }

  async start() {
    this._init()
    this.userInput.open()
    while (true) {
      await this.openMenu()
    }
  }

  math() {
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
    if (isNextPlayerTurn || this.out === 3) {
      this.resetPrePlayerScore()
    }
    const scoreResultString = this.getResultString(result, isNextPlayerTurn)
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
      resultScoreString += `\n${
        this.ball === 4 ? '안타' : '아웃'
      } ! 다음 타자가 타석에 입장했습니다.`
    } else if (this.out === 3 && result !== 'out') {
      resultScoreString += '\n아웃 !'
    }
    resultScoreString += `\n${this.strike}S ${this.ball}B ${this.out}O`
    return `\n${resultScoreString}\n`
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
