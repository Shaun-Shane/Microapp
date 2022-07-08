const { Worker } = require("worker_threads")
const QueueItem = require('./QueueItem')

module.exports = function WorkerPool (workerPath, numberOfThreads) {
  this.workerPath = workerPath
  this.numberOfThreads = numberOfThreads
  this.workerById = new Array(this.numberOfThreads)
  this.queue = new Array()
  this.activeWorkerById = new Array(this.numberOfThreads)

  this.init = function () {
    if (numberOfThreads < 1) return null

    for (let i = 0; i < this.numberOfThreads; i++) {
        const worker = new Worker(this.workerPath)

        this.workerById[i] = worker
        this.activeWorkerById[i] = false
        // 是否正在运行的信息，默认情况下该状态始终为false。
    }

    console.log('WorkerPool initialized')
  }

  this.run = function (getData) {
    return new Promise((resolve, reject) => {
      const availableWorkerId = getInactiveWorkerId()

      const queueItem = new QueueItem(
        (error, result) =>{
          if (error) {
            return reject(error)
          }
          return resolve(result)
        },
        getData
      )

      // 无可用 worker
      if (availableWorkerId === -1) {
        this.queue.push(queueItem)
        return null
      }

      runWorker(availableWorkerId, queueItem)
    })
  }

  // 检查是否存在空闲的 worker 可以来处理数据：
  let getInactiveWorkerId = () => {
    for (let i = 0; i < this.numberOfThreads; i++) {
      if (!this.activeWorkerById[i]) {
        return i
      }
    }
    return -1
  }

  let runWorker = async (workerId, queueItem) => {
    const worker = this.workerById[workerId]

    this.activeWorkerById[workerId] = true

    const messageCallback = (result) => {
      queueItem.callback(null, result)

      cleanUp()
    }

    const errorCallback = (error) => {
      queueItem.callback(error)

      cleanUp()
    }

    const cleanUp = () => {
      worker.removeAllListeners('message')
      worker.removeAllListeners('error')

      this.activeWorkerById[workerId] = false

      if (!this.queue.length) return null

      runWorker(workerId, this.queue.shift())
    }

    worker.once('message', messageCallback)
    worker.once('error', errorCallback)

    worker.postMessage(await queueItem.getData())
  }

  this.init()
}