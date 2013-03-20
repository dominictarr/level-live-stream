var through = require('through')

module.exports = function (db, opts) {

  opts = opts || {}

  if(opts.tail === false) {
    return db.createReadStream(opts)
  }

  var ts = through()

  ts.range = opts

  var removeHook = db.hooks.post(opts, function (ch) {
    ts.queue(ch)
  })

  var rs = db.createReadStream(opts)
  rs.pipe(ts, {end: false})

  rs.once('end', function () {
    ts.emit('sync')
  })

  ts.once('close', function () {
    removeHook()
    rs.destroy()
  })

  return ts
}
