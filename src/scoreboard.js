class Scoreboard {
  constructor(team1, team2, team1Score, team2Score) {
    this.team1 = team1
    this.team2 = team2
    this.team1Score = team1Score
    this.team2Score = team2Score
  }

  print(scores, playerNumber, isTop) {
    const offenseTeamScore = isTop ? this.team1Score : this.team2Score
    const board = `+--------------------------------------------+
|        1  2  3  4  5  6| TOT      |
  ${this.getTotalScore(
    this.team1,
    this.team2,
    scores,
    this.team1Score.point,
    this.team2Score.point
  )}  
|                                 |
|  ${this.team1.teamName}             ${this.team2.teamName}             |
  ${this.getPlayersInfo(
    this.team1,
    this.team2,
    playerNumber,
    isTop,
    offenseTeamScore
  )}
|                                 |
  ${this.getTeamAccScore(this.team1Score, this.team2Score)}
+-------------------------------------------+
`
    console.log(board)
  }

  getTotalScore(team1, team2, scores, team1TotalPoint, team2TotalPoint) {
    let totalScore = `|`
    totalScore += `${team1.teamName}`
    for (let i = 0; i < scores.length; i++) {
      totalScore += ` ${scores[i].team1Point}`
    }
    totalScore += `| ${team1TotalPoint} |`
    totalScore += `\n|${team2.teamName}`
    for (let i = 0; i < scores.length; i++) {
      totalScore += ` ${scores[i].team2Point}`
    }
    totalScore += `| ${team2TotalPoint} |`
    return totalScore
  }

  getTeamAccScore(team1Score, team2Score) {
    let teamAccScore = `
|투구: ${team1Score.pitchCount}               투구: ${team2Score.pitchCount}|
|삼진: ${team1Score.accStrikeout}              삼진: ${team2Score.accStrikeout} |
|안타: ${team1Score.accSafety}               안타: ${team2Score.accSafety}  |
     `
    return teamAccScore
  }

  getPlayersInfo(team1, team2, playerNumber, isTop, offenseTeamScore) {
    let playersInfo = ``

    for (let i = 0; i < team1.players.length; i++) {
      const team1player = this.getPlayerInfo(
        team1.players[i],
        playerNumber,
        isTop ? true : false
      )
      const team2player = this.getPlayerInfo(
        team2.players[i],
        playerNumber,
        isTop ? false : true
      )
      playersInfo += `\n| ${team1player}   ${this.getOffenseTeamScore(
        i,
        offenseTeamScore
      )}   ${team2player}|`
    }
    return playersInfo
  }

  getOffenseTeamScore(line, teamScore) {
    if (line === 2) {
      return `S ${this.getShape(teamScore.strike, 'X')}${this.getShape(
        4 - teamScore.strike,
        ' '
      )}`
    }
    if (line === 3) {
      return `B ${this.getShape(teamScore.ball, 'X')}${this.getShape(
        4 - teamScore.ball,
        ' '
      )}`
    }
    if (line === 4) {
      return `O ${this.getShape(teamScore.out, 'X')}${this.getShape(
        4 - teamScore.out,
        ' '
      )}`
    }
    return '     '
  }

  getShape(number, shape) {
    let result = ''
    for (let i = 0; i < number; i++) {
      result += shape
    }
    return result
  }

  getPlayerInfo(player, playerNumber, isOffenseTeam) {
    return `${player.turn}. ${player.name} ${
      playerNumber === player.turn && isOffenseTeam ? 'V' : ''
    }`
  }
}
exports.Scoreboard = Scoreboard

// +--------------------------------+
// |        1 2 3 4 5 6  | TOT      |
// | Mouse  0 0 1 1 0 0  |  2       |
// | Cats   0 0 2 0 0 0  |  2       |
// |                                |
// |  Mouse                  Cats   |
// | 1. 윤지수               1. 김고양  |
// | 2. 김정정               2. 이고양  |
// | 3. 정호영     S X       3. 박고양  |
// | 4. 나두성     B            ...   |
// | 5. 김두정     O X X              |
// | 5. 김세정                  ...   |
// | 6. 김네정 V                      |
// | 7. 김오정                  ...   |
// | 8. 김육정                        |
// | 9. 김칠정                  ...   |
// |                                |
// | 투구: 31                  ...   |
// | 삼진: 2                         |
// | 안타: 8                         |
// +--------------------------------+
