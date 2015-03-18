## redblack
A red-black tree that supports value lookups by nearest key.

## Acknowledgement
This implementation is based on (Julienne Walker's C Red Black Tree Tutorial)[http://eternallyconfuzzled.com/tuts/datastructures/jsw_tut_rbtree.aspx]. Huge thanks to her for sharing a detailed explanation and implementation of a pretty complex algorithm.

## Use

```javascript
	var rb = require( 'redblack' );
	var tree = rb();
```

The function to create a tree can take a custom comparator, but the default works fine for numbers and strings which are the only things you should be using for keys in this lib anyway.

## API

### add( key, value )
Adds the key value pair to the tree.

```javascript
	tree.add( 'one', 1 );
```

### count()
Returns the total number of key/value pairs stored in the tree.

```javascript
	tree.count();
```

### getValue( key )
Returns a value for the key if it exists.

```javascript
	tree.getValue( 'one' ); // returns 1
	tree.getValue( 'missing' ); //returns undefined
```

### nearest( key )
Returns either the value for the key or the value for the highest key less than the key provided.

```javascript
	tree.nearest( 'two' ); // returns 1
	tree.add( 'six', 6 );
	tree.nearest( 'seven' ); // returns 1
	tree.nearest( 'yolo' ); // returns 6
```

### remove( key )
Removes they key and corresponding value if found.

```javascript
	tree.remove( 'six' );
```

## Why another red black tree?
This lib really just exists to support a consistent hashing lib I wrote that uses a red black tree to keep nearest lookups O(log n). To do that, leaves needed to store a value in addition to the key to avoid having to perform an additional hash lookup once the nearest key is found.

If you're familiar w/ hash rings, this is probably a good enough explanation for why existing/traditional tree structures that only work with a key don't fit this use case.
