const worker = new Worker('js/work.js')

// 主线程调用worker.postMessage()方法，向 Worker 发消息。
worker.postMessage({
    cmd: 'start',
    msg: 'fladjflajlaaa'
})

worker.postMessage({
    cmd: 'stop',
    msg: 'fafafjoaijfoi'
})

worker.postMessage({
    cmd: '3123',
    msg: 'fafafjoaijfoi'
})

// 主线程通过 worker.onmessage 指定监听函数，接收子线程发回来的消息。
worker.onmessage = function (event) {
    console.log('Received message ' + event.data)
}

// 主线程可以监听 Worker 是否发生错误。如果发生错误，Worker 会触发主线程的error事件。
worker.onerror = function (event) {
    console.log([
        'Error: Line ', event.lineno, ' in ', event.filename, ': ', event.message
    ].join(''))
}

/**
 * 使用完毕，为了节省系统资源，必须关闭 Worker。
 * worker.terminate()
 * self.close()
 */

/**
 * JavaScript 允许主线程把二进制数据直接转移给子线程，但是一旦转移，主线程就无法再使用这些二进制数据了，这是为了防止出现多个线程同时修改数据的麻烦局面
 * 这种转移数据的方法，叫做Transferable Objects。
 * 这使得主线程可以快速把数据交给 Worker，对于影像处理、声音处理、3D 运算等就非常方便了，不会产生性能负担。
 * Transferable Objects 格式
 * worker.postMessage(arrayBuffer, [arrayBuffer]);
 * 例子
 * var ab = new ArrayBuffer(1);
 * worker.postMessage(ab, [ab]);
 */

/**
 * 载入与主线程在同一个网页的代码。
 */
var blob = new Blob([document.querySelector('#worker').textContent])
var url = window.URL.createObjectURL(blob)
var worker2 = new Worker(url)

worker2.onmessage = function (e) {
// e.data === 'some message'
}

