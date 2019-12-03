class GameController {
  constructor(game, userInput) {
    this.game = game
    this.userInput = userInput
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

  matchStart() {
    const { team1, team2, team1Score, team2Score } = this.game.getGameInfo()
    console.log(`${team1.teamName} VS ${team2.teamName}의 시합을 시작합니다.`)
    let i = 0
    while (i < 6) {
      this.teamOffenseStart(team1, team1Score, i + 1, true)
      this.teamOffenseStart(team2, team2Score, i + 1, false)
      i++
    }
  }

  teamOffenseStart(team, teamScore, inning, isTop) {
    let isChangeOffenseTeam = false
    let playerNumber = 1
    console.log(
      `${inning} ${isTop === 'top' ? '초' : '말'} ${team.teamName} 공격`
    )
    while (!isChangeOffenseTeam) {
      this.runPlayer(team.players[playerNumber - 1], teamScore)
      playerNumber = this.getNextPlayer(team.players.length, playerNumber)
      isChangeOffenseTeam = teamScore.out >= 3
    }
  }

  runPlayer(player, teamScore) {
    console.log(`${player.turn}번 ${player.name}`)
    let isNextPlayerTurn = false
    while (!isNextPlayerTurn) {
      const result = this.game.throwBall(teamScore, player)
      isNextPlayerTurn = this.game.isNextPlayerTurn(teamScore, result)
      !isNextPlayerTurn && this.printScore(teamScore)
    }
    this.printScore(teamScore)
    this.game.processAfterRunPlayer(teamScore)
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
