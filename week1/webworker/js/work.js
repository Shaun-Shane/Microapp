/**
 * self.postMessage()方法用来向主线程发送消息。
 * self.close()用于在 Worker 内部关闭自身。
 */
self.addEventListener('message', function (e) {
    var data = e.data;
    switch (data.cmd) {
      case 'start':
        self.postMessage('WORKER STARTED: ' + data.msg)
        break
      case 'stop':
        self.postMessage('WORKER STOPPED: ' + data.msg)
        self.close(); // Terminates the worker.
        break;
      default:
        self.postMessage('Unknown command: ' + data.msg)
    };
}, false);

/**
 * Worker 内部如果要加载其他脚本，有一个专门的方法importScripts()。
 * importScripts('script1.js', 'script2.js')
 * 该方法可以同时加载多个脚本。
 */

/* Worker 线程内部还能再新建 Worker 线程（目前只有 Firefox 浏览器支持）。
// settings
var num_workers = 10
var items_per_worker = 1000000

// start the workers
var result = 0;
var pending_workers = num_workers
for (var i = 0; i < num_workers; i += 1) {
  var worker = new Worker('core.js')
  worker.postMessage(i * items_per_worker)
  worker.postMessage((i + 1) * items_per_worker)
  worker.onmessage = storeResult
}

// handle the results
function storeResult (event) {
  result += event.data
  pending_workers -= 1
  if (pending_workers <= 0)
  postMessage(result) // finished!
}
*/