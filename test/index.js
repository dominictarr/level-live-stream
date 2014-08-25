var LiveStream = require('../')
var SubLevel   = require('level-sublevel')
var db = SubLevel(require('level-test')()('test-level-live-stream'))
var assert = require('assert')

var i = 10
var j = 10
var k = 10

LiveStream(db, {tail: true}).on('data', function (data) {
  console.log(data)
  if(data.type === 'put')
    assert.equal(data.key, j--)
})

LiveStream(db, {old: false}).on('data', function (data) {
  if(data.type === 'put')
    assert.equal(data.key, k--)
})

var a = []
var int = setInterval(function () {
  var key = i + ''

  if(Math.random() < 0.2 && a.length) {
    var r = ~~(Math.random()*a.length)
    key = a[r]
    a.slice(r, 1)
    db.del(key, function (err) {
      assert(err == undefined)
    })
  }
  else {
    a.push(key)
    db.put(key, new Date(), function(err) {
      assert(err == undefined)
    })
    if(--i) return
    clearInterval(int)
  }

}, 100)
