self.onmessage = (e) => {
    const {method, params} = JSON.parse(e).data
    const result = self[method].apply(null, params)
    postMessage(JSON.stringify(result))
}