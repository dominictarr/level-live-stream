var through = require('through')

module.exports = function (db) {

  if(db.createLiveStream) return db
  require('level-hooks')()(db)

  db.liveStream = 
  db.createLiveStream = 
  function (opts) {
    var start = opts.start, end = opts.end, onPost
    opts = opts || {}

    if(opts.tail === false) {
      return this.readStream(opts)
    }

    var ts = through()

    ts.range = opts

    db.on('hooks:post', onPost = function (ch) {
      var key = ch.key.toString()
      if((!start || start <= key ) && (!end || key <= end))
        ts.queue(ch)
    })

    var rs = this.readStream(opts)
    rs.pipe(ts, {end: false})

    ts.once('close', function () {
      db.removeListener('hooks:post', onPost)
      rs.destroy()
    })

    return ts
  }
}
