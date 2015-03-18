var Leaf = require( './leaf' );

function balancePostDelete( node, link ) {
	var worker = node;
	var opposite = link === 'right' ? 'left' : 'right';
	var child = node[ opposite ]();

	if ( child && child.red ) {
		node = singleRotation( node, link );
		child = worker[ opposite ]();
	}
	if ( child && !child.isEmpty() ) {
		var left = child.left();
		var right = child.right();
		if ( ( !left || !left.red ) && ( !right || !right.red ) ) {
			if ( worker.red ) {
				this.done = true;
			}
			worker.red = false;
			child.red = true;
		} else {
			var color = worker.red;
			var newRoot = node.key === worker.key;
			var next = child[ opposite ]();
			if ( next && next.red ) {
				worker = singleRotation( worker, link );
			} else {
				worker = doubleRotation( worker, link );
			}

			worker.red = color;
			left = worker.left();
			right = worker.right();
			if ( left && !left.isEmpty() ) {
				left.red = false;
			}
			if ( right && !right.isEmpty() ) {
				right.red = false;
			}

			if ( newRoot ) {
				node = worker;
			} else {
				node[ link ]( worker );
			}
			this.done = true;
		}
	}
	return node;
}

function balancePostInsert( node, link ) {
	var opposite = link === 'right' ? 'left' : 'right';
	var child = node[ link ]();
	var sibling = node[ opposite ]();
	if ( child && child.red ) {
		if ( sibling && sibling.red ) {
			node.red = true;
			node.left().red = false;
			node.right().red = false;
		} else {
			var grandchild1 = child[ link ]();
			var grandchild2 = child[ opposite ]();
			if ( grandchild1 && grandchild1.red ) {
				node = singleRotation( node, opposite );
			} else if ( grandchild2 && grandchild2.red ) {
				node = doubleRotation( node, opposite );
			}
		}
	}
	return node;
}

function create( leaf, key, value ) {
	return leaf( key, value );
}

function count( node ) {
	return node.getCount();
}

function doubleRotation( node, link ) {
	var opposite = link === 'right' ? 'left' : 'right';
	node[ opposite ]( singleRotation( node[ opposite ](), opposite ) );
	return singleRotation( node, link );
}

function getMaxLeaf( node ) {
	if ( !node ) {
		return undefined;
	}
	while ( node.right() ) {
		node = node.right();
	}
	return node.value;
}

function getNearest( node, key ) {
	var last;
	var root = node;
	while ( node ) {
		if ( node.greater( key ) ) {
			node = node.left();
		} else if ( node.less( key ) ) {
			last = node;
			node = node.right();
		} else {
			return node.value;
		}
	}
	if ( !last || last.isEmpty() ) {
		return getMaxLeaf( root );
	} else {
		return last.value;
	}
}

function getValue( node, key ) {
	if ( node && !node.isEmpty() ) {
		while ( node ) {
			if ( node.greater( key ) ) {
				node = node.left();
			} else if ( node.less( key ) ) {
				node = node.right();
			} else {
				break;
			}
		}
		return node ? node.value : undefined;
	}
}

function insert( node, leaf ) {
	if ( !node || node.isEmpty() ) {
		return leaf;
	} else {
		leaf.parent = node;
		var link = leaf.greater( node ) ? 'right' : 'left';
		node[ link ]( insert( node[ link ](), leaf ) );
		return balancePostInsert( node, link );
	}
}

function remove( node, key ) {
	if ( !node || node.isEmpty() ) {
		this.done = true;
	} else {
		var link, child;
		if ( node.key === key ) {
			var left = node.left();
			var right = node.right();
			link = !left ? 'right' : 'left';
			if ( !left || !right ) {
				var child = node[ link ]();
				if ( node.red ) {
					this.done = true;
				} else if ( child && child.red ) {
					child.red = false;
					this.done = true;
				}
				return child;
			} else {
				var child = left;
				while ( child.right() ) {
					child = child.right();
				}
				node.value = child.value;
				node.key = child.key;
				key = child.key;
			}
		}

		link = node.less( key ) ? 'right' : 'left';
		node[ link ]( remove.bind( this )( node[ link ](), key ) );
		if ( !this.done ) {
			node = balancePostDelete.bind( this )( node, link );
		}
	}
	return node;
}

function singleRotation( node, link ) {
	var opposite = link === 'right' ? 'left' : 'right';
	var child = node ? node[ opposite ]() : undefined;
	var sibling = child ? child[ link ]() : undefined;
	node[ opposite ]( sibling );
	if ( child ) {
		child[ link ]( node );
		child.red = false;
		node.red = true;
	} else {
		node.red = false;
	}
	return child || node;
}

function tree( comparer ) {
	var leaf = Leaf( comparer );
	var state = {
		root: undefined,
	};

	state.add = function( key, value ) {
		var l = create( leaf, key, value );
		state.root = insert( state.root, l );
	};

	state.count = function() {
		return state.root ? count( state.root ) : 0;
	};

	state.getValue = function( key ) {
		return getValue( state.root, key );
	}

	state.nearest = function( key ) {
		return getNearest( state.root, key );
	}

	state.remove = function( key ) {
		state.root = remove.bind( {} )( state.root, key );
	}

	state.validate = function() {
		return validate( state.root );
	};

	return state;
}

function validate( root ) {
	var lh, rh;
	if ( !root ) {
		return 1;
	} else {
		var left = root.left();
		var right = root.right();
		/* Consecutive red links */
		if ( root.red ) {
			if ( ( left && left.red ) || ( right && right.red ) ) {
				// red violation
				console.log( 'red violation' );
				return 0;
			}
		}

		lh = validate( left );
		rh = validate( right );

		/* Invalid binary search tree */
		if ( ( left && left.key >= root.key ) || ( right && right.key <= root.key ) ) {
			// bad/invalid tree
			console.log( 'invalid structure' );
			return 0;
		}

		/* Black height mismatch */
		if ( lh != 0 && rh != 0 && lh != rh ) {
			// black violation
			console.log( 'black violation' );
			return 0;
		}

		/* Only count black links */
		if ( lh != 0 && rh != 0 ) {
			return root.red ? lh : lh + 1;
		} else {
			return 0;
		}
	}
}

module.exports = tree;
