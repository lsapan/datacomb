# datacomb
Decompiled datacomb from http://www.bytemuse.com/post/data-comb-visualization/

I manually decompiled the data-comb.js bundle used on the Demo page http://www.bytemuse.com/dc-demo/.

As such, the code is rather cryptic. The author has said they will be putting the source on GitHub, so this is really just meant to be used in the interim.

### Usage
Using browserify, you can do something like this:

```
var DataComb = require('./datacomb');
var myComb = new DataComb({
    el: document.querySelector('#data-comb'),
    data: {
        labelAccessor: 'xxx',
        labelWidth: '16%',
        colDefs: cols,
        dataset: data
    }
});
