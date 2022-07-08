/*
以下是最常见的事件：

worker.on('error', (error) => {});
只要 worker 中有未捕获的异常，就会发出 error 事件。
然后终止 worker，错误可以作为提供的回调中的第一个参数。


worker.on('exit', (exitCode) => {});
在 worker 退出时会发出 exit 事件。
如果在worker中调用了 process.exit()，那么 exitCode 将被提供给回调。
如果 worker 以 worker.terminate() 终止，则代码为1。

worker.on('online', () => {});
只要 worker 停止解析 JavaScript 代码并开始执行，就会发出 online 事件。
它不常用，但在特定情况下可以提供信息。

worker.on('message', (data) => {});
只要 worker 将数据发送到父线程，就会发出 message 事件。

要将数据发送到另一个线程，可以用 port.postMessage() 方法。它的原型如下：
port.postMessage(data[, transferList])

function.bind(thisArg[, arg1[, arg2[, ...]]])
*/

const { Worker } = require('worker_threads')

module.exports = function runWorker (path, cb, workerData) {
  const worker = new Worker(path, { workerData })

  worker.on('message', cb.bind(null, null))
  worker.on('error', cb)

  worker.on('exit', (exitCode) => {
    if (exitCode === 0) {
      return null
    }
    return cb(new Error(`Worker has stopped with code ${exitCode}`))
  })

  return worker
}
