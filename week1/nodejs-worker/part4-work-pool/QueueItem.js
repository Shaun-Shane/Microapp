module.exports = function QueueItem(callback = (err, result) => {}, getData = () => {}) {
  this.callback = callback
  this.getData = getData
}