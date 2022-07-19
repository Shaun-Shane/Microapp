/*
为了共享内存
必须将 ArrayBuffer 或 SharedArrayBuffer 的实例作为数据参数
发送到另一个线程。

下为一个与其父线程共享内存的 worker：
*/
const { parentPort } = require('worker_threads')

parentPort.on('message', () => {
  const numberOfElements = 100
  const sharedBuffer = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * numberOfElements)
  const arr = new Int32Array(sharedBuffer)

  for (let i = 0; i < numberOfElements; i++) {
    arr[i] = Math.round(Math.random() * 30)
  }

  parentPort.postMessage({ arr })
})
