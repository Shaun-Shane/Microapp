const WorkerPool = require('./WorkerPool')
const path = require('path')

const pool = new WorkerPool(path.join(__dirname, './test-worker.js'), 8)

const items = (new Array(100)).fill(null)

Promise.all(
  items.map(async (_, i) => {
    await pool.run(() => ({ i }))

    console.log('finished', i)
  })
).then(() => {
  console.log('finished all')
})