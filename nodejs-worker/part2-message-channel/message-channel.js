const path = require('path')

const { Worker, MessageChannel } = require('worker_threads')

const worker = new Worker(path.join(__dirname, 'message-channel-worker.js'))

const { port1, port2 } = new MessageChannel()

port1.on('message', (message) => {
  console.log('message from worker:', message)
})

worker.postMessage({ port: port2 }, [port2])

/*
在创建 port1 和 port2 之后，我们在 port1 上设置事件监听器并将 port2 发送给 worker。
我们必须将它包含在 transferList 中，以便将其传输给 worker 。
*/