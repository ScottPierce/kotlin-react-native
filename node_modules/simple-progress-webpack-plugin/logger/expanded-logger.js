'use strict';

const path = require( 'path' );

const chalk = require( 'chalk' );
const figures = require( 'figures' );

const ProgressPlugin = require( 'webpack/lib/ProgressPlugin' );

/**
 * Expanded Logger
 */
module.exports = function ExpandedLogger( options ) {

	// Configure color
	chalk.enabled = options.color;

	const absoluteProjectPath = `${ path.resolve( '.' ).toString() }`;

	// Variables for the process, reset after each run
	let startTime;
	let previousStep = 0;

	// Initial log
	console.log( chalk.white( 'Webpack: Starting ...' ) );

	/**
	 * Use the webpack-internal progress plugin as the base of the logger
	 */
	return new ProgressPlugin( ( progress, message, moduleProgress, activeModules, moduleName ) => {

		// Reset process variables for this run
		if ( previousStep === 0 ) {
			startTime = new Date().getTime();
		}

		// STEP 1: COMPILATION
		if ( progress >= 0 && progress < 0.1 ) {

			// Skip if we jumped back a step, else update the step counter
			if ( previousStep > 1 ) {
				return;
			} else if ( previousStep < 1 ) {
				console.log( chalk.white( `\n  ${ figures.pointer } Compile modules` ) );
			}
			previousStep = 1;

		}

		// STEP 2: BUILDING
		if ( progress >= 0.1 && progress <= 0.7 ) {

			// Skip if we jumped back a step, else update the step counter
			if ( previousStep > 2 ) {
				return;
			} else if ( previousStep < 2 ) {
				console.log( chalk.white( `\n  ${ figures.pointer } Build modules` ) );
			}
			previousStep = 2;

			// Log additional information (if possible)
			if ( moduleName !== undefined ) {

				const roundedSubProgress = Math.round( ( progress - 0.1 ) * 10000 / 60 );
				let betterModuleName = moduleName;

				// Only show the file that is actually being processed (and remove all details about used loaders)
				if ( betterModuleName.indexOf( '!' ) !== -1 ) {
					let splitModuleName = betterModuleName.split( '!' );
					betterModuleName = splitModuleName[ splitModuleName.length - 1 ];
				}

				// Transform absolute paths into relative ones (to shorten the so so incredible long path)
				if ( betterModuleName.indexOf( absoluteProjectPath ) !== -1 ) {
					betterModuleName = betterModuleName
						.split( `${ absoluteProjectPath }` )[ 1 ] // Transform absolute path to relative one
						.substring( 1 ); // Remove leading path slash
				}

				// Improve the path presentation further by enforcing style consistency and removing unnecessary details
				betterModuleName = betterModuleName
					.replace( /\\/g, '/' )
					.replace( './', '' )
					.replace( 'multi ', '' );

				// Add extra details about whether the currently processed module is an internal or external one
				if ( betterModuleName.startsWith( 'node_modules' ) ) {
					betterModuleName = `${ betterModuleName } ~ external`;
				}
				if ( betterModuleName.startsWith( 'src' ) ) {
					betterModuleName = `${ betterModuleName } ~ internal`;
				}

				const [ betterModulesDone, betterAllModules ] = moduleProgress.split( '/' );
				const moduleDetails = `${ betterModulesDone } of ${ betterAllModules } :: ${ betterModuleName }`;
				console.log( chalk.grey( `    ${ figures.arrowRight } [${ roundedSubProgress }%] ${ moduleDetails }` ) );

			}

		}

		// STEP 3: OPTIMIZATION
		if ( progress > 0.7 && progress < 0.95 ) {

			// Skip if we jumped back a step, else update the step counter
			if ( previousStep > 3 ) {
				return;
			} else if ( previousStep < 3 ) {
				console.log( chalk.white( `\n  ${ figures.pointer } Optimize modules` ) );
			}
			previousStep = 3;

			// Log progress line (with sub-progress indicator)
			const subProgress = Math.round( ( progress - 0.71 ) * 10000 / 23 );

			const formattedMessage = `${ message[ 0 ].toUpperCase() }${ message.slice( 1 ) }`;
			const formattedMessageExtra = progress === 0.91 ? ' -- may take a while' : ''; // Add some extra info (calming devs down)

			console.log( chalk.grey( `    ${ figures.arrowRight } [${ subProgress }%] ${ formattedMessage }${ formattedMessageExtra } ...` ) );

		}

		// STEP 4: EMIT
		if ( progress >= 0.95 && progress < 1 ) {

			// Skip if we jumped back a step, else update the step counter
			if ( previousStep > 4 ) {
				return;
			} else if ( previousStep < 4 ) {
				console.log( chalk.white( `\n  ${ figures.pointer } Emit files` ) );
			}
			previousStep = 4;

		}

		// STEP 5: FOOTER
		if ( progress === 1 ) {

			// Calculate process time
			previousStep = 0;
			const finishTime = new Date().getTime();
			const processTime = ( ( finishTime - startTime ) / 1000 ).toFixed( 3 );

			console.log( chalk.white( `\nWebpack: Finished after ${ processTime } seconds.\n` ) );

		}

	} );

};
