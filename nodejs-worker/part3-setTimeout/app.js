const timeoutState = new Map()

const runWorker = require('./run-worker')
const path = require('path')
const uuid = require('uuid')

// 使用 .terminate() 方法强制 worker 退出，并从该状态中删除该这个worker：
function myCancleTimeout(id) {
  if (timeoutState[id]) {
    timeoutState[id].terminate()

    timeoutState[id] = undefined

    return true
  }

  return false
}

function mySetTimeout(callback, time) {
  const id = uuid.v4()

  const worker = runWorker(
    path.join(__dirname, './timeout-worker.js'),
    (err) => {
      if (!timeoutState[id]) {
        return null
      }

      timeoutState[id] = null

      if (err) {
        return callback(err)
      }

      callback(null)
    },
    {
      time
    }
  )

  timeoutState[id] = worker

  return id
}

const id = mySetTimeout(() => {
  console.log("helloworld")
  myCancleTimeout(id)
}, 1000)

console.log(id)