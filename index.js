var pull = require('pull-level')
var toStream = require('pull-stream-to-stream')

var liveStream = module.exports = function (db, opts) {
  var ts
  opts = opts || {}
  opts.tail = opts.tail !== false
  opts.onSync = function () {
    ts.emit('sync')
  }
  return ts = toStream(null, pull.read(db, opts))
}

module.exports.install = function (db) {
  db.liveStream =
  db.createLiveStream =
    function (opts) {
      return liveStream(db, opts)
    }
}
