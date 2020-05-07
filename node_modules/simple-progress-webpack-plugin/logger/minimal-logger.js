'use strict';

const path = require( 'path' );

const chalk = require( 'chalk' );
const log = require( 'log-update' );

const ProgressPlugin = require( 'webpack/lib/ProgressPlugin' );

/**
 * Minimal Logger
 */
module.exports = function MinimalLogger( options ) {

	// Configure color
	chalk.enabled = options.color;

	const absoluteProjectPath = `${ path.resolve( '.' ).toString() }`;

	// Variables for the process, reset after each run
	let startTime;
	let previousStep = 0;

	// Initial log
	let logLine = 'Webpack: Starting ...';
	log( logLine );

	/**
	 * Use the webpack-internal progress plugin as the base of the logger
	 */
	return new ProgressPlugin( ( progress, message, moduleProgress, activeModules, moduleName ) => {

		// Progress
		logLine = chalk.yellow( `[${ Math.round( progress * 100 ) }%] ` );

		// Reset process variables for this run
		if ( previousStep === 0 ) {
			startTime = new Date().getTime();
		}

		// STEP 1: COMPILATION
		if ( progress >= 0 && progress < 0.1 ) {

			// Skip if we jumped back a step, else update the step counter
			if ( previousStep > 1 ) {
				return;
			}
			previousStep = 1;

			logLine += chalk.white( 'Compile modules ...' );

		}

		// STEP 2: BUILDING
		if ( progress >= 0.1 && progress <= 0.7 ) {

			// Skip if we jumped back a step, else update the step counter
			if ( previousStep > 2 ) {
				return;
			}
			previousStep = 2;

			// Log progress line
			logLine += chalk.white( 'Build modules ...' );

			// Log additional information (if possible)
			if ( moduleName !== undefined ) {

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

				logLine += chalk.grey( ` (${ moduleDetails })` );

			}

		}

		// STEP 3: OPTIMIZATION
		if ( progress > 0.7 && progress < 0.95 ) {

			// Skip if we jumped back a step, else update the step counter
			if ( previousStep > 3 ) {
				return;
			}
			previousStep = 3;

			// Log progress line (with sub-progress indicator)
			logLine += chalk.white( 'Optimize modules ...' );
			const formattedMessageExtra = progress === 0.91 ? ' -- may take a while' : ''; // Add some extra info (calming devs down)

			logLine += chalk.grey( ` (${ message }${ formattedMessageExtra })` );

		}

		// STEP 4: EMIT
		if ( progress >= 0.95 && progress < 1 ) {

			// Skip if we jumped back a step, else update the step counter
			if ( previousStep > 4 ) {
				return;
			}
			previousStep = 4;

			logLine += chalk.white( 'Emit files ...' );

		}

		// STEP 5: FOOTER
		if ( progress === 1 ) {

			// Calculate process time
			previousStep = 0;
			const finishTime = new Date().getTime();
			const processTime = ( ( finishTime - startTime ) / 1000 ).toFixed( 3 );

			logLine = chalk.white( `Webpack: Finished after ${ processTime } seconds.\n` ); // Overwrite

		}

		// Finally, let's bring those logs to da screen
		log( logLine );
		if ( progress === 1 ) {
			log.done();
		}

	} );

};
