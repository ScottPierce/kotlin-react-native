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

