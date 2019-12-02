const {
  BaseballGame
} = require('./game.js')
const {
  Team
} = require('./team.js')

const {
  UserInput
} = require("./userInput.js")

function main() {
  const userInput = new UserInput()
  const team1 = new Team(1, userInput)
  const team2 = new Team(2, userInput)
  const baseballGame = new BaseballGame(team1, team2, userInput)
  baseballGame.start()
}


main()