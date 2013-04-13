var through = require('through')

var liveStream = module.exports = function (db, opts) {
  var ts
  opts = opts || {}
  opts.onSync = function () {
    ts.emit('sync')
  }  
  return ts = toPull(pull.live(db, opts))
}

module.exports.install = function (db) {
  db.liveStream =
  db.createLiveStream =
    function (opts) {
      return liveStream(db, opts)
    }
}
