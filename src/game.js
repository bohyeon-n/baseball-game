class BaseballGame {
  constructor(team1, team2, team1Score, team2Score, userInput) {
    this.team1Score = team1Score
    this.team2Score = team2Score
    this.team1 = team1
    this.team2 = team2
    this.userInput = userInput
    this.scores = []
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
        this.match()
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

  match() {
    const matchStartMessage = `${this.team1.teamName} VS ${this.team2.teamName}의 시합을 시작합니다.`
    console.log(matchStartMessage)
    for (let i = 0; i < 9; i++) {
      // 초 공격
      this.offense(this.team1, this.team1Score, i + 1, 'top')
      // 말 공격
      this.offense(this.team2, this.team2Score, i + 1, 'bottom')
      this.updateScoreAfterInning()
    }
    const matchResultString = `경기 종료 \n${this.getMathResultString()} \nThank you!`
    console.log(matchResultString)
  }

  updateScoreAfterInning() {
    this.scores.push({
      team1Point: this.team1Score.calcPoint(),
      team2Point: this.team2Score.calcPoint()
    })
    this.team1Score.updateInningPoint()
    this.team2Score.updateInningPoint()
    this.team1Score.resetPreInningScore()
    this.team2Score.resetPreInningScore()
  }

  getMathResultString() {
    return `${this.team1.teamName} VS ${this.team2.teamName}
    ${this.team1Score.point} : ${this.team2Score.point}`
  }

  // 팀 한 번 공격하기
  offense(team, teamScore, inning, topOrBottom) {
    let isChangeOffenseTeam = false
    let playerNumber = 1
    console.log(
      `${inning} ${topOrBottom === 'top' ? '초' : '말'} ${team.teamName} 공격`
    )
    while (!isChangeOffenseTeam) {
      this.runPlayer(team.players[playerNumber - 1], teamScore)
      playerNumber = this.getNextPlayer(team.players.length, playerNumber)
      isChangeOffenseTeam = teamScore.out >= 3
    }
  }

  getNextPlayer(playerCount, currentPlayer) {
    return currentPlayer >= playerCount ? 1 : currentPlayer + 1
  }

  runPlayer(player, teamScore) {
    console.log(`${player.turn}번 ${player.name}`)
    let isNextPlayerTurn = false
    while (!isNextPlayerTurn) {
      const result = this.getRandomResult(player.battingAverage)
      this.printResult(result)
      teamScore.updateScore(result)
      isNextPlayerTurn = this.isNextPlayerTurn(teamScore, result)
      !isNextPlayerTurn && this.printScore(teamScore)
      teamScore.pitchCount++
    }
    const accResult = this.getAccBallAndStrikeResult(teamScore)
    accResult && console.log(this.resultToKorean(accResult))
    teamScore.resetPrePlayerScore()
    this.printScore(teamScore)
  }

  getAccBallAndStrikeResult(teamScore) {
    if (teamScore.ball === 4) {
      return 'safety'
    }
    if (teamScore.strike === 3) {
      return 'out'
    }
    return null
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

  getRandomResult(h) {
    const results = ['ball', 'strike', 'out', 'safety']
    const ballAndStrikeWeight = (1 - h) / (2 - 0.05)
    const safetyWeight = h
    const outWegith = 0.1
    const weight = [
      ballAndStrikeWeight,
      ballAndStrikeWeight,
      outWegith,
      safetyWeight
    ]
    const weightedList = this.generateWeightedList(results, weight)
    const randomNumber = Math.floor(Math.random() * weightedList.length)
    return weightedList[randomNumber]
  }

  generateWeightedList(list, weight) {
    const weightedList = []
    for (let i = 0; i < list.length; i++) {
      const multiple = Math.floor(weight[i] * 100)
      const multiplelist = new Array(multiple).fill(list[i])
      weightedList.push(...multiplelist)
    }
    return weightedList
  }
}

exports.BaseballGame = BaseballGame
