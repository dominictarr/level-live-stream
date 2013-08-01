# level-live-stream

Stream live changes from levelup.

[![Build Status](https://travis-ci.org/dominictarr/level-live-stream.png?branch=master)](https://travis-ci.org/dominictarr/level-live-stream)

Works just like [LevelUp#readStream](https://github.com/rvagg/node-levelup#readStream)
except instead of ending, it will stay open and stream changes to the database as they are inserted!

Just like the couchdb changes feed, but for any arbitrary range of keys!

see also, [level-livefeed](https://github.com/Raynos/level-livefeed/) for the same idea, 
but with a [streams2](https://github.com/isaacs/readable-stream) api.

``` js

var level = require('level')

level('/tmp/level-live-stream', 
  {createIfMissing: true}, function (err, db) {

  var liveStream = require('level-live-stream')(db)

  liveStream
    .on('data', console.log)

  setInterval(function () {
    db.put('time', new Date().toString())

  }, 1000)

})

```

You can also attach `liveStream` as a method to the db like below.
This will allow [multilevel](https://github.com/juliangruber/multilevel)
clients to use `db.liveStream()`.

```js
var LiveStream = require('level-live-stream');

// attach the `liveStream` method using `install`
LiveStream.install(db);

// then invoke the method using the `db` instance
db.liveStream()
  .on('data', console.dir);
```

## options

``` js
LiveStream(db, {
  tail: true,   //follow
  old : true,   //get old records from data base
                //if old=false you will only get live updates
  min : loKey,  //lowest key in range
  max : hiKey,  //highest key in range
  reverse: true //stream in reverse (only applies to old records)
})
```

## License

MIT
