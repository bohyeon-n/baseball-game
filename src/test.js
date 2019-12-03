const { Score } = require('./Score.js')
test('Score calcPoint Test', () => {
  const score = new Score()
  score.safety = 10
  const point = score.calcPoint(score.safety)
  expect(point).toBe(7)
})
