var LiveStream = require('../')
var SubLevel   = require('level-sublevel')
var db = SubLevel(require('level')('/tmp/level-live-stream'))

require('rimraf').sync('/tmp/level-live-stream')

LiveStream(db, {tail: true}).on('data', function (data) {
  db.get(data.key, console.log)
})

LiveStream(db, {old: false}).on('data', function (data) {
  console.log('new:', data.key)
})

var i = 10
var int = setInterval(function () {
  db.put(Math.random().toString(), new Date(), console.log)
  if(--i) return
  clearInterval(int)
}, 100)
