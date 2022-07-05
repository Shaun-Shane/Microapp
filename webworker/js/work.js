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