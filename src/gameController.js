class GameController {
  constructor(game, userInput, scoreboard) {
    this.game = game
    this.userInput = userInput
    this.skip = false
    this.skipNumber = null
    this.scoreboard = scoreboard
  }

  start() {
    this.userInput.open()
    this.openMenu()
  }

  async openMenu() {
    const isAbleMatchStart = this.game.isAbleMatchStart()
    const menu = this.getMenu(isAbleMatchStart)
    this.printMenu(menu)
    const selectedMenu = await this.getSelectedMenu(isAbleMatchStart)
    await this.onSelectMenu(selectedMenu)
    if (selectedMenu === '1' || selectedMenu === '2') {
      this.openMenu()
    }
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

  printMenu(menu) {
    console.log(menu)
  }

  async onSelectMenu(selectedMenuNumber) {
    switch (selectedMenuNumber) {
      case '1':
        await this.game.setTeams()
        break
      case '2':
        this.game.printTeamsInfo()
        break
      case '3':
        this.matchStart()
        break
      default:
        console.log('메뉴를 잘못 선택하셨습니다.')
    }
  }

  async matchStart() {
    const { team1, team2, team1Score, team2Score } = this.game.getGameInfo()
    console.log(`${team1.teamName} VS ${team2.teamName}의 시합을 시작합니다.`)
    let i = 0
    while (i < 6) {
      await this.teamOffenseStart(team1, team1Score, i + 1, true)
      await this.teamOffenseStart(team2, team2Score, i + 1, false)
      const isTeam1winner = team1Score.point > team2Score.point
      if (i === 5 && isTeam1winner) {
        break
      }
      i++
    }
    console.log(
      `경기 종료
      ${team1.teamName} VS ${team2.teamName}
      ${team1Score.point} VS ${team2Score.point}
      Thank you!
      `
    )
  }

  async teamOffenseStart(team, teamScore, inning, isTop) {
    let isChangeOffenseTeam = false
    let playerNumber = 1
    if (this.skip) {
      this.skip = inning <= this.skipNumber
    }
    !this.skip &&
      console.log(`\n${inning} ${isTop ? '초' : '말'} ${team.teamName} 공격\n`)
    while (!isChangeOffenseTeam) {
      await this.runPlayer(
        team.players[playerNumber - 1],
        teamScore,
        playerNumber,
        isTop,
        inning
      )
      playerNumber = this.getNextPlayer(team.players.length, playerNumber)
      isChangeOffenseTeam = teamScore.out >= 3
    }
    this.game.updateScoreAfterInning(inning, isTop)
  }

  async runPlayer(player, teamScore, playerNumber, isTop, inningCount) {
    !this.skip && (await this.askSkip(inningCount))
    let isNextPlayerTurn = false
    while (!isNextPlayerTurn) {
      const result = this.game.throwBall(teamScore, player)
      isNextPlayerTurn = this.game.isNextPlayerTurn(teamScore, result)
      isNextPlayerTurn && teamScore.resetPlayerScore()
      !this.skip && this.scoreboard.print(this.game.scores, playerNumber, isTop)
      !this.skip &&
        this.printThrowResult(player, result, isNextPlayerTurn, teamScore)
      !isNextPlayerTurn && !this.skip && (await this.askSkip(inningCount))
    }
  }

  // 투구 후 출력되는
  printThrowResult(player, result, isNextPlayerTurn, teamScore) {
    const accResult = this.game.getAccBallAndStrikeResult(teamScore)
    console.log(`\n${player.turn}번 ${player.name}입니다.\n`)
    this.game.printResult(result)
    accResult && console.log(this.game.resultToKorean(accResult))
    !this.skip && this.printScore(teamScore)
  }

  async askSkip(inningCount) {
    let answer = false
    while (!answer) {
      const res = await this.userInput.question(
        `\n다음 투구 보기(enter) or 스킵하고 X회말 후 투구보기(숫자+enter) ?\n`
      )
      if (res === '') {
        answer = true
      } else if (this.isValidSkipNumber(res, inningCount)) {
        this.skip = true
        this.skipNumber = Number(res)
        answer = true
      }
    }
  }

  isValidSkipNumber(answerString, inningCount) {
    const skipNumber = Number(answerString)
    const isValidSkipNumber =
      skipNumber && inningCount < skipNumber && skipNumber < 6
    return isValidSkipNumber
  }

  getNextPlayer(playerCount, currentPlayer) {
    return currentPlayer >= playerCount ? 1 : currentPlayer + 1
  }

  printScore(teamScore) {
    console.log(`${teamScore.strike}S ${teamScore.ball}B ${teamScore.out}O`)
  }

  getMenu(isAbleMatchStart) {
    let menu = `신나는 야구시합
    1. 데이터 입력
    2. 데이터 출력
    `
    if (isAbleMatchStart) {
      menu += `3. 시합하기
      `
    }
    return menu
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
}

exports.GameController = GameController