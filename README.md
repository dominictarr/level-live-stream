# level-live-stream

Stream live changes from levelup.

Works just like [LevelUp#readStream](https://github.com/rvagg/node-levelup#readStream)
except it will not emit end when the range has been read from the database,
instead, it will stay open and stream changes to the database as they are inserted!

Just like the couchdb changes feed, but for any arbitary range of keys!

see also, [level-livefeed](https://github.com/Raynos/level-livefeed/) for the same idea, 
but with a [streams2](https://github.com/isaacs/readable-stream) api.

``` js

var levelup = require('levelup')

var levelup('/tmp/level-live-stream', 
  {createIfMissing: true}, function (err, db) {

  require('level-live-stream')(db)

  db.liveStream()
    .on('data', console.log)

  setInterval(function () {
    db.put('time', new Date().toString())

  }, 1000)

})

```

## License

MIT
