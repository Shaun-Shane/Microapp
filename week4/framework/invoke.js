const worker = new Worker('worker.js')

// webworker 进行计算相关函数调用 返回 promise
export function invoke (func = '', params = []) {
    const promise = new Promise((resolve, reject)=> {
      worker.onmessage = (e) => {
        resolve(JSON.parse(e.data))
      }
      worker.onerror = (e) => {
        reject(e)
      }
    })
    worker.postMessage({
        func: func,
        params: params
    })
    return promise
}
