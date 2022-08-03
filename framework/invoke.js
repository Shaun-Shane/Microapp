const worker = new Worker('worker.js')

export function addFn (func = '') {
  worker.postMessage({
    type: 'addFn',
    func: func
  })
}

// webworker 进行计算相关函数调用 返回 promise
export function invoke (func = '', params = []) {
    const promise = new Promise((resolve, reject) => {
      worker.onmessage = (e) => {
        if (!e.data) resolve(e.data)
        else if (e.data.type === 'alert') {
          resolve()
          alert(e.data.text)
        }
        else resolve(JSON.parse(e.data))
      }
      worker.onerror = (e) => {
        reject(e)
      }
    })
    worker.postMessage({
        type: 'invoke',
        func: func,
        params: params
    })
    return promise
}
