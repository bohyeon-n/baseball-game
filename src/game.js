class BaseballGame {
  constructor(team1, team2, team1Score, team2Score, userInput) {
    this.team1Score = team1Score
    this.team2Score = team2Score
    this.team1 = team1
    this.team2 = team2
    this.userInput = userInput
    this.inning = 1
    this.offenseTeam = 1
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
    let menu = `신나는 야구시합
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
    this.userInput.open()
    let open = false
    while (!open) {
      await this.openMenu()
    }
  }

  math() {
    const matchStartMessage = `${this.team1.teamName} VS ${this.team2.teamName}의 시합을 시작합니다.`
    console.log(matchStartMessage)
    for (let i = 0; i < 9; i++) {
      // 초 공격
      this.offense(this.team1, this.team1Score, i + 1, 'top')
      // 말 공격
      this.offense(this.team2, this.team2Score, i + 1, 'bottom')
    }
    const matchResultString = `경기 종료 \n${this.getMathResultString()} \nThank you!`
    console.log(matchResultString)
  }

  getMathResultString() {
    return `${this.team1.teamName} VS ${this.team2.teamName}
    ${this.team1Score.point} : ${this.team2Score.point}`
  }

  // 팀 한 번 공격하기
  offense(team, teamScore, inning, topOrBottom) {
    let isChangeOffenseTeam = false
    let playerNumber = 1
    while (!isChangeOffenseTeam) {
      console.log(
        `${inning} ${topOrBottom === 'top' ? '초' : '말'} ${team.teamName} 공격
        `
      )
      while (!isChangeOffenseTeam) {
        this.runPlayer(team.players[playerNumber - 1], teamScore)
        playerNumber > 1 ? 1 : playerNumber++
        playerNumber = 1
        isChangeOffenseTeam = teamScore.out >= 3
      }
    }
  }

  runPlayer(player, teamScore) {
    console.log(`${player.turn}번 ${player.name}`)
    let isNextPlayerTurn = false
    while (!isNextPlayerTurn) {
      const result = this.getRandomResult()
      this.printResult(result)
      teamScore.updateScore(result)
      isNextPlayerTurn = this.isNextPlayerTurn(teamScore, result)
      !isNextPlayerTurn && this.printScore(teamScore)
    }
    teamScore.resetPreScore()
    this.printScore(teamScore)
  }

  printResult(result) {
    const resultInKorean = this.resultToKorean(result)
    console.log(`${resultInKorean} ! `)
  }

  isNextPlayerTurn(teamScore, result) {
    return (
      teamScore.ball === 4 ||
      teamScore.strike === 3 ||
      result === 'safety' ||
      result === 'out'
    )
  }

  resetPrePlayerScore() {
    this.ball = 0
    this.strike = 0
  }

  isGameOver() {
    return this.out === 3
  }

  updateScore(teamScore, result) {
    teamScore[result]++
    if (teamScore.strike === 3) {
      teamScore.out++
    }
    if (teamScore.ball === 4) {
      teamScore.safety++
    }
  }

  getScoreString(teamScore) {
    return `${teamScore.strike}S ${teamScore.ball}B ${teamScore.out}O`
  }

  printScore(teamScore) {
    const teamScoreString = this.getScoreString(teamScore)
    console.log(`${teamScoreString}
    `)
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
