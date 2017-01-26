var pull = require('pull-level')
var toStream = require('pull-stream-to-stream')

var liveStream = module.exports = function (db, opts) {
  var ts
  opts = opts || {}

  if(opts.tail) {
    console.error('level-live-stream: .tail option is deprecated. use .live instead')
  }
  opts.tail = opts.tail !== false

  // opts.tail is deprecated, using opts.live instead
  if(opts.tail) {
    opts.live = opts.tail
  } else {
    opts.live = opts.live !== false
  }

  delete opts.tail

  if(opts.old === false)
    return toStream(null, pull.live(db, opts))

  opts.onSync = function () {
    ts.emit('sync')
  }
  return ts = toStream(null, pull.read(db, opts))
}

module.exports.install = function (db) {
  db.methods = db.methods || {}
  db.methods['liveStream'] =
  db.methods['createLiveStream'] = {type: 'readable'}

  db.liveStream =
  db.createLiveStream =
    function (opts) {
      return liveStream(db, opts)
    }
}
