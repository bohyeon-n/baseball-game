const BaseballGame = require('./game.js')
const {
  Team
} = require('./team.js')

const {
  UserInput
} = require("./userInput.js")

function main() {
  // const game = new BaseballGame.BaseballGame()
  // game.start()
  const userInput = new UserInput()
  const team1 = new Team(1, userInput)
  team1.setTeam()
}

main()