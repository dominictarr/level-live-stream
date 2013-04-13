var LiveStream = require('../')
var SubLevel   = require('level-sublevel')
var db = SubLevel(require('levelup')('/tmp/level-live-stream'))


LiveStream(db, {tail: true}).on('data', function (data) {
  db.get(data.key, console.log)
})

setInterval(function () {
  db.put(Math.random().toString(), new Date(), console.log)
}, 1000)
