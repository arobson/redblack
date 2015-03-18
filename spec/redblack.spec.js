var should = require( 'chai' ).should();
var rb = require( '../src/index' );

describe( 'Red-Black Tree', function() {

	describe( 'when adding nodes', function() {
		var tree;
		before( function() {
			tree = rb();
			tree.add( 1, 'one' );
			tree.add( 2, 'two' );
			tree.add( 3, 'three' );
			tree.add( 4, 'four' );
			tree.add( 5, 'five' );
			tree.add( 6, 'six' );
			tree.add( 7, 'seven' );
			tree.add( 8, 'eight' );
			tree.add( 9, 'nine' );
			tree.add( 10, 'ten' );
			tree.add( 20, 'twenty' );
		} );

		it( 'should balance tree correctly', function() {
			tree.root.key.should.equal( 4 );
			tree.root.value.should.equal( 'four' );
		} );

		it( 'should get by key', function() {
			tree.getValue( 1 ).should.equal( 'one' );
			tree.getValue( 2 ).should.equal( 'two' );
			tree.getValue( 3 ).should.equal( 'three' );
		} );

		it( 'should generate a valid tree', function() {
			tree.validate().should.not.equal( 0 );
		} );

		it( 'should return nearest lower value if in range', function() {
			tree.nearest( 15 ).should.equal( 'ten' );
		} )

		it( 'should give the max node if out of range', function() {
			tree.nearest( 25 ).should.equal( 'twenty' );
		} );

		it( 'should count nodes correctly', function() {
			tree.count().should.equal( 11 );
		} );

		describe( 'when removing nodes', function() {
			before( function() {
				tree.remove( 2 );
				tree.remove( 3 );
				tree.remove( 4 );
				tree.remove( 6 );
				tree.remove( 7 );
				tree.remove( 8 );
				tree.remove( 9 );
			} );

			it( 'should count nodes correctly', function() {
				tree.count().should.equal( 4 );
			} );

			it( 'should not invalidate tree', function() {
				tree.validate().should.not.equal( 0 );
			} );

			it( 'should return nearest lower value if in range', function() {
				tree.nearest( 15 ).should.equal( 'ten' );
			} )

			it( 'should give the max node if out of range', function() {
				tree.nearest( 25 ).should.equal( 'twenty' );
			} );
		} );
	} );
} );
