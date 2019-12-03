const { BaseballGame } = require('./game.js')
const { Team } = require('./team.js')
const { UserInput } = require('./userInput.js')
const { Score } = require('./Score.js')

function main() {
  const userInput = new UserInput()
  const team1 = new Team(1, userInput)
  const team2 = new Team(2, userInput)
  const team1Score = new Score()
  const team2Score = new Score()
  const baseballGame = new BaseballGame(
    team1,
    team2,
    team1Score,
    team2Score,
    userInput
  )
  baseballGame.start()
}

main()
