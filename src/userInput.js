class UserInput {
  open() {
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    })
    this.readline = readline;
  }

  close() {
    this.readline.close()
  }

  question(question) {
    return new Promise((res) => {
      this.readline.question(question, (answer) => {
        res(answer)
      })
    })
  }
}

exports.UserInput = UserInput;