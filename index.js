var through = require('through')

module.exports = function (db, opts) {

  var start = opts.start, end = opts.end, onPost
  opts = opts || {}

  if(opts.tail === false) {
    return this.readStream(opts)
  }

  var ts = through()

  ts.range = opts

  var removeHook = db.post(opts, function (ch) {
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
