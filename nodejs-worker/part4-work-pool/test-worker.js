const { isMainThread, parentPort } = require('worker_threads')

if (isMainThread) {
  throw new Error('Its not a worker')
}

const doCalcs = (data) => {
  const collection = new Array(1000000)

  for (let i = 0; i < 1000000; i += 1) {
    collection[i] = Math.round(Math.random() * 100000)
  }

  return collection.sort((a, b) => {
    if (a > b) {
      return 1
    }

    return -1
  })
}

parentPort.on('message', (data) => {
  const result = doCalcs(data)

  parentPort.postMessage(result)
})