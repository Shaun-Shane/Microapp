const { parentPort } = require('worker_threads')

parentPort.on('message', (data) => {
  const { port } = data // port: MessagePort
  port.postMessage(`here's your message`)
})