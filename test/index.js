var LiveStream = require('../')
var db = require('levelup')('/tmp/level-live-stream')


LiveStream(db, {tail: true}).on('data', function (data) {
  db.get(data.key, console.log)
})

LiveStream(db, {old: false}).on('data', function (data) {
  console.log('new:', data.key)
})

setInterval(function () {
  db.put(Math.random().toString(), new Date(), console.log)
}, 1000)
