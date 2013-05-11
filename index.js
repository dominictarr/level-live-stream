var pull = require('pull-level')
var toStream = require('pull-stream-to-stream')
var SubLevel = require('level-sublevel')

var liveStream = module.exports = function (db, opts) {
  SubLevel(db)

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
