var LiveStream = require('../')
var SubLevel   = require('level-sublevel')
var db = SubLevel(require('level-test')()('test-level-live-stream'))
var assert = require('assert')

var i = 10
var j = 10
var k = 10
 
LiveStream(db, {tail: true}).on('data', function (data) {
  assert.equal(data.key, j--)
})

LiveStream(db, {old: false}).on('data', function (data) {
  assert.equal(data.key, k--)
})

var int = setInterval(function () {
  db.put(i+'', new Date(), function(err) {
    assert(err == undefined)
  })
  if(--i) return
  clearInterval(int)
}, 100)
