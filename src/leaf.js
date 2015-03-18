
function defaultComparer( x, y ) {
	if ( x === y ) {
		return 0;
	} else if ( x > y ) {
		return 1;
	} else {
		return -1;
	}
}

function getCount( leaf ) {
	var right = getLeaf( leaf, 1 );
	var left = getLeaf( leaf, 0 );
	return 1 +
			( isEmpty( right ) ? 0 : getCount( right ) ) +
			( isEmpty( left ) ? 0 : getCount( left ) );
}

function greaterThan( leaf, comparer, other ) {
	var compare = other.key ? other.key : other;
	return comparer( leaf.key, compare ) > 0;
}

function lessThan( leaf, comparer, other ) {
	var compare = other.key ? other.key : other;
	return comparer( leaf.key, compare ) < 0;
}

function isEmpty( leaf ) {
	return !leaf || !leaf.key;
}

function isRoot( leaf ) {
	return !leaf.parent;
}

function getLeaf( node, index, val ) {
	if ( 2 in arguments ) {
		node.children[ index ] = val;
	} else {
		return node.children[ index ];
	}
}

function setLeaf( node, index, val ) {
	node.children[ index ] = val;
}

function createNode( comparer, key, value, parent ) {
	comparer = comparer || defaultComparer;
	var node = {
		children: [],
		red: true,
		key: key,
		value: value,
		parent: parent,
	};

	node.isEmpty = isEmpty.bind( undefined, node );
	node.isRoot = isRoot.bind( undefined, node );
	node.getCount = getCount.bind( undefined, node );
	node.left = getLeaf.bind( undefined, node, 0 );
	node.right = getLeaf.bind( undefined, node, 1 );
	node.greater = greaterThan.bind( undefined, node, comparer );
	node.less = lessThan.bind( undefined, node, comparer );
	node.map = function() {
		var left = node.children[ 0 ];
		var right = node.children[ 1 ];
		return {
			key: node.key,
			value: node.value,
			red: node.red,
			left: left ? left.map() : undefined,
			right: right ? right.map() : undefined
		}
	}
	node.log = function() {
		console.log( node.map() );
	}
	return node;
}

module.exports = function( comparer ) {
	return createNode.bind( undefined, comparer );
};
