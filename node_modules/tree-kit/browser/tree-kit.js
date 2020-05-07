(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.treeKit = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/*
	Tree Kit

	Copyright (c) 2014 - 2019 Cédric Ronvel

	The MIT License (MIT)

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.
*/

"use strict" ;



// Browser only get the essential of tree-kit, not the unfinished parts of it

var tree = {} ;
module.exports = tree ;


tree.extend = require( './extend.js' ) ;
tree.clone = require( './clone.js' ) ;
tree.path = require( './path.js' ) ;

},{"./clone.js":2,"./extend.js":3,"./path.js":4}],2:[function(require,module,exports){
/*
	Tree Kit

	Copyright (c) 2014 - 2019 Cédric Ronvel

	The MIT License (MIT)

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.
*/

"use strict" ;



/*
	Stand-alone fork of extend.js, without options.
*/

function clone( originalObject , circular ) {
	// First create an empty object with
	// same prototype of our original source

	var originalProto = Object.getPrototypeOf( originalObject ) ;

	// Opaque objects, like Date
	if ( clone.opaque.has( originalProto ) ) { return clone.opaque.get( originalProto )( originalObject ) ; }

	var propertyIndex , descriptor , keys , current , nextSource , proto ,
		copies = [ {
			source: originalObject ,
			target: Array.isArray( originalObject ) ? [] : Object.create( originalProto )
		} ] ,
		cloneObject = copies[ 0 ].target ,
		refMap = new Map() ;

	refMap.set( originalObject , cloneObject ) ;


	// First in, first out
	while ( ( current = copies.shift() ) ) {
		keys = Object.getOwnPropertyNames( current.source ) ;

		for ( propertyIndex = 0 ; propertyIndex < keys.length ; propertyIndex ++ ) {
			// Save the source's descriptor
			descriptor = Object.getOwnPropertyDescriptor( current.source , keys[ propertyIndex ] ) ;


			if ( ! descriptor.value || typeof descriptor.value !== 'object' ) {
				Object.defineProperty( current.target , keys[ propertyIndex ] , descriptor ) ;
				continue ;
			}

			nextSource = descriptor.value ;

			if ( circular ) {
				if ( refMap.has( nextSource ) ) {
					// The source is already referenced, just assign reference
					descriptor.value = refMap.get( nextSource ) ;
					Object.defineProperty( current.target , keys[ propertyIndex ] , descriptor ) ;
					continue ;
				}
			}

			proto = Object.getPrototypeOf( descriptor.value ) ;

			// Opaque objects, like Date, not recursivity for them
			if ( clone.opaque.has( proto ) ) {
				descriptor.value = clone.opaque.get( proto )( descriptor.value ) ;
				Object.defineProperty( current.target , keys[ propertyIndex ] , descriptor ) ;
				continue ;
			}

			descriptor.value = Array.isArray( nextSource ) ? [] : Object.create( proto ) ;

			if ( circular ) { refMap.set( nextSource , descriptor.value ) ; }

			Object.defineProperty( current.target , keys[ propertyIndex ] , descriptor ) ;
			copies.push( { source: nextSource , target: descriptor.value } ) ;
		}
	}

	return cloneObject ;
}

module.exports = clone ;



clone.opaque = new Map() ;
clone.opaque.set( Date.prototype , src => new Date( src ) ) ;


},{}],3:[function(require,module,exports){
/*
	Tree Kit

	Copyright (c) 2014 - 2019 Cédric Ronvel

	The MIT License (MIT)

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.
*/

"use strict" ;



/*
	== Extend function ==
*/

/*
	options:
		* own: only copy own properties that are enumerable
		* nonEnum: copy non-enumerable properties as well, works only with own:true
		* descriptor: preserve property's descriptor
		* deep: boolean/Array/Set, if true perform a deep (recursive) extend, if it is an Array/Set of prototypes, only deep-copy
			objects of those prototypes
			(it is a replacement for deepFilter.whitelist which was removed in Tree Kit 0.6).
		* immutables: an Array/Set of immutable object's prototypes that are filtered out for deep-copy
			(it is a replacement for deepFilter.blacklist which was removed in Tree Kit 0.6).
		* maxDepth: used in conjunction with deep, when max depth is reached an exception is raised, default to 100 when
			the 'circular' option is off, or default to null if 'circular' is on
		* circular: circular references reconnection
		* move: move properties to target (delete properties from the sources)
		* preserve: existing properties in the target object are not overwritten
		* nofunc: skip functions
		* deepFunc: in conjunction with 'deep', this will process sources functions like objects rather than
			copying/referencing them directly into the source, thus, the result will not be a function, it forces 'deep'
		* proto: try to clone objects with the right prototype, using Object.create() or mutating it with Object.setPrototypeOf(),
			it forces option 'own'.
		* inherit: rather than mutating target prototype for source prototype like the 'proto' option does, here it is
			the source itself that IS the prototype for the target. Force option 'own' and disable 'proto'.
		* skipRoot: the prototype of the target root object is NOT mutated only if this option is set.
		* flat: extend into the target top-level only, compose name with the path of the source, force 'deep',
			disable 'unflat', 'proto', 'inherit'
		* unflat: assume sources are in the 'flat' format, expand all properties deeply into the target, disable 'flat'
*/
function extend( options , target , ... sources ) {
	//console.log( "\nextend():\n" , arguments ) ;
	var i , source , newTarget = false , length = sources.length ;

	if ( ! length ) { return target ; }

	if ( ! options || typeof options !== 'object' ) { options = {} ; }

	var runtime = { depth: 0 , prefix: '' } ;

	if ( options.deep ) {
		if ( Array.isArray( options.deep ) ) { options.deep = new Set( options.deep ) ; }
		else if ( ! ( options.deep instanceof Set ) ) { options.deep = true ; }
	}

	if ( options.immutables ) {
		if ( Array.isArray( options.immutables ) ) { options.immutables = new Set( options.immutables ) ; }
		else if ( ! ( options.immutables instanceof Set ) ) { delete options.immutables ; }
	}

	if ( ! options.maxDepth && options.deep && ! options.circular ) { options.maxDepth = 100 ; }

	if ( options.deepFunc ) { options.deep = true ; }

	// 'flat' option force 'deep'
	if ( options.flat ) {
		options.deep = true ;
		options.proto = false ;
		options.inherit = false ;
		options.unflat = false ;
		if ( typeof options.flat !== 'string' ) { options.flat = '.' ; }
	}

	if ( options.unflat ) {
		options.deep = false ;
		options.proto = false ;
		options.inherit = false ;
		options.flat = false ;
		if ( typeof options.unflat !== 'string' ) { options.unflat = '.' ; }
	}

	// If the prototype is applied, only owned properties should be copied
	if ( options.inherit ) { options.own = true ; options.proto = false ; }
	else if ( options.proto ) { options.own = true ; }

	if ( ! target || ( typeof target !== 'object' && typeof target !== 'function' ) ) {
		newTarget = true ;
	}

	if ( ! options.skipRoot && ( options.inherit || options.proto ) ) {
		for ( i = length - 1 ; i >= 0 ; i -- ) {
			source = sources[ i ] ;
			if ( source && ( typeof source === 'object' || typeof source === 'function' ) ) {
				if ( options.inherit ) {
					if ( newTarget ) { target = Object.create( source ) ; }
					else { Object.setPrototypeOf( target , source ) ; }
				}
				else if ( options.proto ) {
					if ( newTarget ) { target = Object.create( Object.getPrototypeOf( source ) ) ; }
					else { Object.setPrototypeOf( target , Object.getPrototypeOf( source ) ) ; }
				}

				break ;
			}
		}
	}
	else if ( newTarget ) {
		target = {} ;
	}

	runtime.references = { sources: [] , targets: [] } ;

	for ( i = 0 ; i < length ; i ++ ) {
		source = sources[ i ] ;
		if ( ! source || ( typeof source !== 'object' && typeof source !== 'function' ) ) { continue ; }
		extendOne( runtime , options , target , source ) ;
	}

	return target ;
}

module.exports = extend ;



function extendOne( runtime , options , target , source ) {
	//console.log( "\nextendOne():\n" , arguments ) ;
	//process.exit() ;

	var j , jmax , sourceKeys , sourceKey , sourceValue , sourceValueProto ,
		value , sourceDescriptor , targetKey , targetPointer , path ,
		indexOfSource = -1 ;

	// Max depth check
	if ( options.maxDepth && runtime.depth > options.maxDepth ) {
		throw new Error( '[tree] extend(): max depth reached(' + options.maxDepth + ')' ) ;
	}


	if ( options.circular ) {
		runtime.references.sources.push( source ) ;
		runtime.references.targets.push( target ) ;
	}

	if ( options.own ) {
		if ( options.nonEnum ) { sourceKeys = Object.getOwnPropertyNames( source ) ; }
		else { sourceKeys = Object.keys( source ) ; }
	}
	else { sourceKeys = source ; }

	for ( sourceKey in sourceKeys ) {
		if ( options.own ) { sourceKey = sourceKeys[ sourceKey ] ; }

		// OMG, this DEPRECATED __proto__ shit is still alive and can be used to hack anything ><
		if ( sourceKey === '__proto__' ) { continue ; }

		// If descriptor is on, get it now
		if ( options.descriptor ) {
			sourceDescriptor = Object.getOwnPropertyDescriptor( source , sourceKey ) ;
			sourceValue = sourceDescriptor.value ;
		}
		else {
			// We have to trigger an eventual getter only once
			sourceValue = source[ sourceKey ] ;
		}

		targetPointer = target ;
		targetKey = runtime.prefix + sourceKey ;

		// Do not copy if property is a function and we don't want them
		if ( options.nofunc && typeof sourceValue === 'function' ) { continue ; }

		// 'unflat' mode computing
		if ( options.unflat && runtime.depth === 0 ) {
			path = sourceKey.split( options.unflat ) ;
			jmax = path.length - 1 ;

			if ( jmax ) {
				for ( j = 0 ; j < jmax ; j ++ ) {
					if ( ! targetPointer[ path[ j ] ] ||
						( typeof targetPointer[ path[ j ] ] !== 'object' &&
							typeof targetPointer[ path[ j ] ] !== 'function' ) ) {
						targetPointer[ path[ j ] ] = {} ;
					}

					targetPointer = targetPointer[ path[ j ] ] ;
				}

				targetKey = runtime.prefix + path[ jmax ] ;
			}
		}


		if ( options.deep	// eslint-disable-line no-constant-condition
			&& sourceValue
			&& ( typeof sourceValue === 'object' || ( options.deepFunc && typeof sourceValue === 'function' ) )
			&& ( ! options.descriptor || ! sourceDescriptor.get )
			// not a condition we just cache sourceValueProto now... ok it's trashy ><
			&& ( ( sourceValueProto = Object.getPrototypeOf( sourceValue ) ) || true )
			&& ( ! ( options.deep instanceof Set ) || options.deep.has( sourceValueProto ) )
			&& ( ! options.immutables || ! options.immutables.has( sourceValueProto ) )
		) {
			if ( options.circular ) {
				indexOfSource = runtime.references.sources.indexOf( sourceValue ) ;
			}

			if ( options.flat ) {
				// No circular references reconnection when in 'flat' mode
				if ( indexOfSource >= 0 ) { continue ; }

				extendOne(
					{ depth: runtime.depth + 1 , prefix: runtime.prefix + sourceKey + options.flat , references: runtime.references } ,
					options , targetPointer , sourceValue
				) ;
			}
			else {
				if ( indexOfSource >= 0 ) {
					// Circular references reconnection...
					if ( options.descriptor ) {
						Object.defineProperty( targetPointer , targetKey , {
							value: runtime.references.targets[ indexOfSource ] ,
							enumerable: sourceDescriptor.enumerable ,
							writable: sourceDescriptor.writable ,
							configurable: sourceDescriptor.configurable
						} ) ;
					}
					else {
						targetPointer[ targetKey ] = runtime.references.targets[ indexOfSource ] ;
					}

					continue ;
				}

				if ( ! targetPointer[ targetKey ] || ! Object.prototype.hasOwnProperty.call( targetPointer , targetKey ) || ( typeof targetPointer[ targetKey ] !== 'object' && typeof targetPointer[ targetKey ] !== 'function' ) ) {
					if ( Array.isArray( sourceValue ) ) { value = [] ; }
					else if ( options.proto ) { value = Object.create( sourceValueProto ) ; }	// jshint ignore:line
					else if ( options.inherit ) { value = Object.create( sourceValue ) ; }
					else { value = {} ; }

					if ( options.descriptor ) {
						Object.defineProperty( targetPointer , targetKey , {
							value: value ,
							enumerable: sourceDescriptor.enumerable ,
							writable: sourceDescriptor.writable ,
							configurable: sourceDescriptor.configurable
						} ) ;
					}
					else {
						targetPointer[ targetKey ] = value ;
					}
				}
				else if ( options.proto && Object.getPrototypeOf( targetPointer[ targetKey ] ) !== sourceValueProto ) {
					Object.setPrototypeOf( targetPointer[ targetKey ] , sourceValueProto ) ;
				}
				else if ( options.inherit && Object.getPrototypeOf( targetPointer[ targetKey ] ) !== sourceValue ) {
					Object.setPrototypeOf( targetPointer[ targetKey ] , sourceValue ) ;
				}

				if ( options.circular ) {
					runtime.references.sources.push( sourceValue ) ;
					runtime.references.targets.push( targetPointer[ targetKey ] ) ;
				}

				// Recursively extends sub-object
				extendOne(
					{ depth: runtime.depth + 1 , prefix: '' , references: runtime.references } ,
					options , targetPointer[ targetKey ] , sourceValue
				) ;
			}
		}
		else if ( options.preserve && targetPointer[ targetKey ] !== undefined ) {
			// Do not overwrite, and so do not delete source's properties that were not moved
			continue ;
		}
		else if ( ! options.inherit ) {
			if ( options.descriptor ) { Object.defineProperty( targetPointer , targetKey , sourceDescriptor ) ; }
			else { targetPointer[ targetKey ] = sourceValue ; }
		}

		// Delete owned property of the source object
		if ( options.move ) { delete source[ sourceKey ] ; }
	}
}


},{}],4:[function(require,module,exports){
/*
	Tree Kit

	Copyright (c) 2014 - 2019 Cédric Ronvel

	The MIT License (MIT)

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.
*/

"use strict" ;



var treePath = {} ;
module.exports = treePath ;



treePath.op = function op( type , object , path , value ) {
	var i , parts , last , pointer , key , isArray = false , pathArrayMode = false , isGenericSet , canBeEmpty = true ;

	if ( ! object || ( typeof object !== 'object' && typeof object !== 'function' ) ) {
		return ;
	}

	if ( typeof path === 'string' ) {
		// Split the path into parts
		if ( path ) { parts = path.match( /([.#[\]]|[^.#[\]]+)/g ) ; }
		else { parts = [ '' ] ; }

		if ( parts[ 0 ] === '.' ) { parts.unshift( '' ) ; }
		if ( parts[ parts.length - 1 ] === '.' ) { parts.push( '' ) ; }
	}
	else if ( Array.isArray( path ) ) {
		parts = path ;
		pathArrayMode = true ;
	}
	else {
		throw new TypeError( '[tree.path] .' + type + '(): the path argument should be a string or an array' ) ;
	}

	switch ( type ) {
		case 'get' :
		case 'delete' :
			isGenericSet = false ;
			break ;
		case 'set' :
		case 'define' :
		case 'inc' :
		case 'dec' :
		case 'append' :
		case 'prepend' :
		case 'concat' :
		case 'insert' :
		case 'autoPush' :
			isGenericSet = true ;
			break ;
		default :
			throw new TypeError( "[tree.path] .op(): wrong type of operation '" + type + "'" ) ;
	}

	//console.log( parts ) ;
	// The pointer start at the object's root
	pointer = object ;

	last = parts.length - 1 ;

	for ( i = 0 ; i <= last ; i ++ ) {
		if ( pathArrayMode ) {
			if ( key === undefined ) {
				key = parts[ i ] ;
				continue ;
			}

			if ( ! pointer[ key ] || ( typeof pointer[ key ] !== 'object' && typeof pointer[ key ] !== 'function' ) ) {
				if ( ! isGenericSet ) { return undefined ; }
				pointer[ key ] = {} ;
			}

			pointer = pointer[ key ] ;
			key = parts[ i ] ;

			continue ;
		}
		else if ( parts[ i ] === '.' ) {
			isArray = false ;

			if ( key === undefined ) {
				if ( ! canBeEmpty ) {
					canBeEmpty = true ;
					continue ;
				}

				key = '' ;
			}

			if ( ! pointer[ key ] || ( typeof pointer[ key ] !== 'object' && typeof pointer[ key ] !== 'function' ) ) {
				if ( ! isGenericSet ) { return undefined ; }
				pointer[ key ] = {} ;
			}

			pointer = pointer[ key ] ;
			canBeEmpty = true ;

			continue ;
		}
		else if ( parts[ i ] === '#' || parts[ i ] === '[' ) {
			isArray = true ;
			canBeEmpty = false ;

			if ( key === undefined ) {
				// The root element cannot be altered, we are in trouble if an array is expected but we have only a regular object.
				if ( ! Array.isArray( pointer ) ) { return undefined ; }
				continue ;
			}

			if ( ! pointer[ key ] || ! Array.isArray( pointer[ key ] ) ) {
				if ( ! isGenericSet ) { return undefined ; }
				pointer[ key ] = [] ;
			}

			pointer = pointer[ key ] ;

			continue ;
		}
		else if ( parts[ i ] === ']' ) {
			// Closing bracket: do nothing
			canBeEmpty = false ;
			continue ;
		}

		canBeEmpty = false ;

		if ( ! isArray ) { key = parts[ i ] ; continue ; }

		switch ( parts[ i ] ) {
			case 'length' :
				key = parts[ i ] ;
				break ;

			// Pseudo-key
			case 'first' :
				key = 0 ;
				break ;
			case 'last' :
				key = pointer.length - 1 ;
				if ( key < 0 ) { key = 0 ; }
				break ;
			case 'next' :
				if ( ! isGenericSet ) { return undefined ; }
				key = pointer.length ;
				break ;
			case 'insert' :
				if ( ! isGenericSet ) { return undefined ; }
				pointer.unshift( undefined ) ;
				key = 0 ;
				break ;

			// default = number
			default :
				// Convert the string key to a numerical index
				key = parseInt( parts[ i ] , 10 ) ;
		}
	}

	switch ( type ) {
		case 'get' :
			return pointer[ key ] ;
		case 'delete' :
			if ( isArray && typeof key === 'number' ) { pointer.splice( key , 1 ) ; }
			else { delete pointer[ key ] ; }
			return ;
		case 'set' :
			pointer[ key ] = value ;
			return pointer[ key ] ;
		case 'define' :
			// define: set only if it doesn't exist
			if ( ! ( key in pointer ) ) { pointer[ key ] = value ; }
			return pointer[ key ] ;
		case 'inc' :
			if ( typeof pointer[ key ] === 'number' ) { pointer[ key ] ++ ; }
			else if ( ! pointer[ key ] || typeof pointer[ key ] !== 'object' ) { pointer[ key ] = 1 ; }
			return pointer[ key ] ;
		case 'dec' :
			if ( typeof pointer[ key ] === 'number' ) { pointer[ key ] -- ; }
			else if ( ! pointer[ key ] || typeof pointer[ key ] !== 'object' ) { pointer[ key ] = -1 ; }
			return pointer[ key ] ;
		case 'append' :
			if ( ! pointer[ key ] ) { pointer[ key ] = [ value ] ; }
			else if ( Array.isArray( pointer[ key ] ) ) { pointer[ key ].push( value ) ; }
			//else ? do nothing???
			return pointer[ key ] ;
		case 'prepend' :
			if ( ! pointer[ key ] ) { pointer[ key ] = [ value ] ; }
			else if ( Array.isArray( pointer[ key ] ) ) { pointer[ key ].unshift( value ) ; }
			//else ? do nothing???
			return pointer[ key ] ;
		case 'concat' :
			if ( ! pointer[ key ] ) { pointer[ key ] = value ; }
			else if ( Array.isArray( pointer[ key ] ) && Array.isArray( value ) ) {
				pointer[ key ] = pointer[ key ].concat( value ) ;
			}
			//else ? do nothing???
			return pointer[ key ] ;
		case 'insert' :
			if ( ! pointer[ key ] ) { pointer[ key ] = value ; }
			else if ( Array.isArray( pointer[ key ] ) && Array.isArray( value ) ) {
				pointer[ key ] = value.concat( pointer[ key ] ) ;
			}
			//else ? do nothing???
			return pointer[ key ] ;
		case 'autoPush' :
			if ( pointer[ key ] === undefined ) { pointer[ key ] = value ; }
			else if ( Array.isArray( pointer[ key ] ) ) { pointer[ key ].push( value ) ; }
			else { pointer[ key ] = [ pointer[ key ] , value ] ; }
			return pointer[ key ] ;
	}
} ;



// get, set and delete use the same op() function
treePath.get = treePath.op.bind( undefined , 'get' ) ;
treePath.delete = treePath.op.bind( undefined , 'delete' ) ;
treePath.set = treePath.op.bind( undefined , 'set' ) ;
treePath.define = treePath.op.bind( undefined , 'define' ) ;
treePath.inc = treePath.op.bind( undefined , 'inc' ) ;
treePath.dec = treePath.op.bind( undefined , 'dec' ) ;
treePath.append = treePath.op.bind( undefined , 'append' ) ;
treePath.prepend = treePath.op.bind( undefined , 'prepend' ) ;
treePath.concat = treePath.op.bind( undefined , 'concat' ) ;
treePath.insert = treePath.op.bind( undefined , 'insert' ) ;
treePath.autoPush = treePath.op.bind( undefined , 'autoPush' ) ;



// Prototype used for object creation, so they can be created with Object.create( tree.path.prototype )
treePath.prototype = {
	get: function( path ) { return treePath.get( this , path ) ; } ,
	delete: function( path ) { return treePath.delete( this , path ) ; } ,
	set: function( path , value ) { return treePath.set( this , path , value ) ; } ,
	define: function( path , value ) { return treePath.define( this , path , value ) ; } ,
	inc: function( path , value ) { return treePath.inc( this , path , value ) ; } ,
	dec: function( path , value ) { return treePath.dec( this , path , value ) ; } ,
	append: function( path , value ) { return treePath.append( this , path , value ) ; } ,
	prepend: function( path , value ) { return treePath.prepend( this , path , value ) ; } ,
	concat: function( path , value ) { return treePath.concat( this , path , value ) ; } ,
	insert: function( path , value ) { return treePath.insert( this , path , value ) ; } ,
	autoPush: function( path , value ) { return treePath.autoPush( this , path , value ) ; }
} ;



// Upgrade an object so it can support get, set and delete at its root
treePath.upgrade = function upgrade( object ) {
	Object.defineProperties( object , {
		get: { value: treePath.op.bind( undefined , 'get' , object ) } ,
		delete: { value: treePath.op.bind( undefined , 'delete' , object ) } ,
		set: { value: treePath.op.bind( undefined , 'set' , object ) } ,
		define: { value: treePath.op.bind( undefined , 'define' , object ) } ,
		inc: { value: treePath.op.bind( undefined , 'inc' , object ) } ,
		dec: { value: treePath.op.bind( undefined , 'dec' , object ) } ,
		append: { value: treePath.op.bind( undefined , 'append' , object ) } ,
		prepend: { value: treePath.op.bind( undefined , 'prepend' , object ) } ,
		concat: { value: treePath.op.bind( undefined , 'concat' , object ) } ,
		insert: { value: treePath.op.bind( undefined , 'insert' , object ) } ,
		autoPush: { value: treePath.op.bind( undefined , 'autoPush' , object ) }
	} ) ;
} ;


},{}]},{},[1])(1)
});
