'use strict';

// Disable the deprecation warning, popping up in the middle of the process
process.noDeprecation = true;

const CompactLogger = require( './logger/compact-logger' );
const MinimalLogger = require( './logger/minimal-logger' );
const VerboseLogger = require( './logger/verbose-logger' );
const ExpandedLogger = require( './logger/expanded-logger' );

function getOption( options, key, value ) {
	return ( options && options.hasOwnProperty( key ) ) ? options[ key ] : value;
}

/**
 * Simple Progress Plugin for Webpack
 *
 * @param options - Custom options
 */
module.exports = function SimpleProgressWebpackPlugin( options ) {

	const internalOptions = {
		format: getOption( options, 'format', 'compact' ),
		color: getOption( options, 'color', true )
	};

	// Return the correct progress plugin
	switch ( internalOptions.format ) {
		case 'minimal':
			return MinimalLogger( internalOptions );
		case 'expanded':
		case 'extended':
			return ExpandedLogger( internalOptions );
		case 'verbose':
		case 'debug':
			return VerboseLogger( internalOptions );
		case 'compact':
		default:
			return CompactLogger( internalOptions );
	}

};
