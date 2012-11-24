var levelup = require('levelup')

levelup('/tmp/level-live-stream', {createIfMissing: true}, function (err, db) {

  require('..')(db)

  db.liveStream()
    .on('data', function (data) {
      console.log(data.type, ''+data.key, ''+data.value)
    })

  setInterval(function () {
    db.put('time', new Date().toString())
  }, 1000)

})

