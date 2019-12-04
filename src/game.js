class BaseballGame {
  constructor(team1, team2, team1Score, team2Score) {
    this.team1Score = team1Score
    this.team2Score = team2Score
    this.team1 = team1
    this.team2 = team2
    this.scores = []
  }

  async setTeams() {
    await this.team1.setTeam()
    await this.team2.setTeam()
    this.initScores()
  }

  initScores() {
    const scores = []
    for (let i = 0; i < 6; i++) {
      scores.push({
        team1Point: 0,
        team2Point: 0
      })
    }
    this.scores = scores
  }

  async printTeamsInfo() {
    this.team1.printTeamInfo()
    this.team2.printTeamInfo()
  }

  isAbleMatchStart() {
    return this.team1.players && this.team2.players
  }

  getGameInfo() {
    return {
      team1: this.team1,
      team2: this.team2,
      team1Score: this.team1Score,
      team2Score: this.team2Score
    }
  }

  throwBall(teamScore, player) {
    const result = this.getRandomResult(player.battingAverage)
    teamScore.updateScore(result)
    teamScore.pitchCount++
    return result
  }

  updateScoreAfterInning(innging, isTop) {
    if (isTop) {
      this.scores[innging - 1].team1Point = this.team1Score.calcPoint()
      this.team1Score.updateInningPoint()
      this.team1Score.resetPreInningScore()
    } else {
      this.scores[innging - 1].team2Point = this.team2Score.calcPoint()
      this.team2Score.updateInningPoint()
      this.team2Score.resetPreInningScore()
    }
  }

  getMathResultString() {
    return `${this.team1.teamName} VS ${this.team2.teamName}
    ${this.team1Score.point} : ${this.team2Score.point}`
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
