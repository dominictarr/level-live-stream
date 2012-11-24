var through = require('through')

module.exports = function (db) {

  if(db.createLiveStream) return db

  require('level-hooks')()(db)

  db.liveStream = 
  db.createLiveStream = 
  function (opts) {
    opts = opts || {}
    var start = opts.start, end = opts.end
    var ts = through(function (data) {
        this.queue(data)
      }, function() {
        this.queue(null)
      })

    ts.range = opts

    function onPost (ch) {
      var key = ch.key.toString()
      if((!start || start <= key ) && (!end || key <= end))
        ts.queue(ch)
    }

    db.on('hooks:post', onPost)

    var rs = this.readStream(opts)
    rs.pipe(ts, {end: false})

    ts.on('close', function () {
      db.removeListener('hooks:post', onPost)
      rs.destroy()
    })

    return ts
  }
}
