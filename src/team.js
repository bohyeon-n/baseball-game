class Team {
  constructor(teamOrder, input) {
    this.teamOrder = teamOrder
    this.input = input
  }

  async setTeam() {
    this.teamName = await this.getTeamName()
    this.players = await this.getPlayers()
  }

  async getPlayers() {
    const players = []
    for (let i = 0; i < 9; i++) {
      const player = await this.getPlayerInput(i + 1)
      players.push({
        ...player,
        turn: i + 1
      })
    }
    return players
  }

  async getTeamName() {
    let teamName
    while (!teamName) {
      const input = await this.input.question(
        `${this.teamOrder}팀의 이름을 입력하세요>`
      )
      if (this.isValidName(input)) {
        teamName = input
      } else {
        console.log('잘못입력하셨습니다. 다시 입력해주세요.')
      }
    }
    return teamName
  }

  async getPlayerInput(turn) {
    let player
    while (!player) {
      const playerInput = await this.input.question(
        `${turn}번 타자 정보 입력(예: 김타자, 0.12)>`
      )
      const splitedInput = playerInput.split(',').map(word => word.trim())
      const [name, battingAverage] = splitedInput
      if (this.isValidPlayerInput(name, Number(battingAverage))) {
        player = { name, battingAverage: Number(battingAverage) }
      } else {
        console.log(
          `잘못 입력하셨습니다! 타율 h는 0.1 < h < 0.5이고 소수 세째 자리까지 입력할 수 있습니다.`
        )
      }
    }
    return player
  }

  printTeamInfo() {
    const teamInfo = this.getTeamInfo()
    console.log(teamInfo)
  }

  getTeamInfo() {
    let teamInfo = ''
    if (!this.teamName || !this.players) {
      return `${this.teamOrder}팀 정보가 없습니다.`
    }
    teamInfo += `${this.teamName}팀 정보\n`
    this.players.forEach(player => {
      teamInfo += `${player.turn}번 ${player.name}, ${player.battingAverage}\n`
    })
    return teamInfo
  }

  isValidPlayerInput(name, battingAverage) {
    const rangeStart = 0.1
    const rangeEnd = 0.5
    const decimalPoint = 3
    return (
      this.isValidName(name) &&
      this.isValidRange(rangeStart, rangeEnd, battingAverage) &&
      this.isValidDecimalPoint(decimalPoint, battingAverage)
    )
  }

  isValidName(name) {
    if (name !== '') return true
  }

  isValidRange(start, end, number) {
    return start < number && number < end
  }

  isValidDecimalPoint(decimalPoint, number) {
    const decimal = String(number).split('.')[1]
    return !decimal || decimal.length <= decimalPoint
  }
}

exports.Team = Team
