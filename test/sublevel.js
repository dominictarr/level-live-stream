var memdb = require('memdb')
var SubLevel   = require('level-sublevel')
var LiveStream = require('../')
var leveltestdb = SubLevel(require('level-test')()('test-level-live-stream'))
var memtestdb = SubLevel(memdb())
var assert = require('assert')

var i = 5
var j = 5
var k = 1
var l = 1

//test with level-test
var db = leveltestdb
LiveStream.install(db)
db.test = db.sublevel('test')
LiveStream.install(db.test)

db.test.createLiveStream().on('data',function (data) {
  assert.equal(data.key, l--)
})                                       
db.test.put(l+'',new Date(), function(err) {
  assert(err == undefined)
})

//test with memdb
db = memtestdb

LiveStream.install(db)

db.test1 = db.sublevel('test1')
db.test2 = db.sublevel('test2')
LiveStream.install(db.test1)
LiveStream.install(db.test2)


db.test1.createLiveStream().on('data',function (data) {
  assert.equal(data.key, j--)
})                                       

var int = setInterval(function () {
  db.test1.put(i+'',new Date(), function(err) {
    assert(err == undefined)
  })
  if(--i) return
  clearInterval(int)
}, 100)

//second test with memdb
db.test2.createLiveStream().on('data',function (data) {
  assert.equal(data.key, k--)
})                                       
db.test2.put(k+'',new Date(), function(err) {
  assert(err == undefined)
})
