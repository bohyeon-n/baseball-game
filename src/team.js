class Team {
  constructor(teamOrder, input) {
    this.teamOrder = teamOrder;
    this.input = input;
  }

  async setTeam() {
    this.input.open()
    this.teamName = await this.getTeamName()
    this.players = await this.getPlayers()
    this.input.close()
  }

  async getPlayers() {
    const players = [];
    for (let i = 0; i < 9; i++) {
      const player = await this.getPlayerInput(i + 1)
      players.push(player)
    }
    return players;
  }

  async getTeamName() {
    while (true) {
      const teamName = await this.input.question(`${this.teamOrder}팀의 이름을 입력하세요>`)
      if (this.isValidName(teamName)) {
        return teamName
      }
    }
  }

  async getPlayerInput(turn) {
    while (true) {
      const playerInput = await this.input.question(`${turn}번 타자 정보 입력>`);
      const splitedInput = playerInput.split(',').map((word) => word.trim())
      const [name, battingAverage] = splitedInput
      if (this.isValidPlayerInput(name, battingAverage)) {
        return {
          name,
          battingAverage: Number(battingAverage)
        }
      }
    }
  }

  isValidPlayerInput(name, battingAverage) {
    const rangeStart = 0.1;
    const rangeEnd = 0.5;
    const decimalPoint = 3;
    return this.isValidName(name) && this.isValidRange(rangeStart, rangeEnd, battingAverage) && this.isValidDecimalPoint(decimalPoint, battingAverage)
  }

  isValidName(name) {
    if (name !== '') return true;
  }

  isValidRange(start, end, number) {
    return start < number && number < end
  }

  isValidDecimalPoint(decimalPoint, number) {
    const decimal = String(number).split('.')[1]
    return !decimal || decimal.length <= decimalPoint
  }

}

exports.Team = Team;