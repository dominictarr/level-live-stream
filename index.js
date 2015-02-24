var pull = require('pull-level')
var toStream = require('pull-stream-to-stream')
var xtend = require('xtend')

var liveStream = module.exports = function (db, opts) {
  var ts
  opts = opts || {}
  opts.tail = opts.tail !== false
  if(opts.old === false)
    return toStream(null, pull.live(db, opts))

  opts.onSync = function () {
    ts.emit('sync')
  }
  return ts = toStream(null, pull.read(db, opts))
}

module.exports.install = function (db, opts) {
  db.methods = db.methods || {}
  db.methods['liveStream'] =
  db.methods['createLiveStream'] = {type: 'readable'}

  db.liveStream =
  db.createLiveStream =
    function (_opts) {
      return liveStream(db, xtend(opts, _opts))
    }
}
