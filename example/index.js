var level = require('level')

level('/tmp/level-live-stream', 
  {createIfMissing: true}, function (err, db) {

  var liveStream = require('..')(db)

  liveStream
    .on('data', console.log)

  setInterval(function () {
    db.put('time', new Date().toString())

  }, 1000)

})