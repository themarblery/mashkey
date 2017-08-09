// --------------------------------
// Gulp Plugins
// --------------------------------

// Gulp - Duh
var gulp = require('gulp');

// CSS Related
var sass = require('gulp-sass');
var bulkSass = require('gulp-sass-glob-import');
var postcss = require('gulp-postcss');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('autoprefixer');

// JavaScript Related
var uglify = require('gulp-uglify');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

// Tasks
var clean = require('gulp-clean');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var browserSync = require('browser-sync').create();
var fs = require('fs');

var svgo = require('gulp-svgo');
var inlineSvg = require('gulp-inline-svg');
var svgmin = require('gulp-svgmin');
var svgstore = require('gulp-svgstore');
var cheerio = require('gulp-cheerio'); // lets us use a lean library of core jQuery to modify files. https://cheerio.js.org/

// New Sync/Copy task dependencies
var path = require('path');


// --------------------------------
// Globals
// --------------------------------

/**
 * Let's us access the contents of package.json as an object.
 * @type {Object}
 */
var packagejson = JSON.parse(fs.readFileSync('./package.json'));

/**
 * The host you'd like to use while working locally.
 * @type {String}
 */
var host = "mashkey.com";

// Root Paths
var src = {
	root: "./src/",
	theme: {}
};
src.theme.root				= src.root + "theme/";
src.theme.sass 				= src.theme.root + "sass/";
src.theme.sassVarsDir       = src.theme.sass + "00-utilities/vars/";
src.theme.js 				= src.theme.root + "js/";
src.theme.fonts				= src.theme.root + "fonts/";
src.theme.svgs				= src.theme.root + "svgs/";
src.theme.icons				= src.theme.svgs + "icons/";
src.theme.images			= src.theme.root + "images/";

// WordPress Paths
var wp = {
	root: "./",
	theme: {}
};
wp.content 		= "./wp-content/";
wp.themes 		= wp.content + "themes/";
wp.theme.root 	= wp.themes + packagejson.name + "/";
wp.theme.core 	= wp.theme.root + "core/";
wp.theme.css 	= wp.theme.root + "css/";
wp.theme.maps 	= wp.theme.root + "maps/";
wp.theme.js  	= wp.theme.root + "js/";
wp.theme.fonts  = wp.theme.root + "fonts/";
wp.theme.svgs  	= wp.theme.root + "svgs/";
wp.theme.icons  = wp.theme.root + "acf-em-icon-picker/";
wp.theme.images = wp.theme.root + "images/";
wp.theme.acf 	= wp.theme.root + "acf-json/";

/**
 * All theme files excepty js and sass
 */
var themeFiles = [
	src.theme.root + '**/*',
	'!' + src.theme.root + 'sass{,/**}',
	'!' + src.theme.root + 'js{,/**}'
];


/**
 * Gulp Error Handling
 */
var plumberErrorHandler = {
	errorHandler: notify.onError({
		title: 'Gulp - Error',
		message: 'Error: <%= error.message %>'
	})
};

/**
 * Clean out the theme directory in wp-content/themes/{packagejson.name}
 */
gulp.task("clean", function() {
	return gulp.src([wp.theme.root], {read: false})
		.pipe(clean());
});

/**
 * Copy everything but source sass and javascript files over to wp-content/themes/{packagejson.name}
 */
gulp.task("copy", function() {
	return gulp.src(themeFiles, { dot: true })
		.pipe(plumber(plumberErrorHandler))
		.pipe(gulp.dest(wp.theme.root));
});

/**
 * Process CSS
 *
 * Compile SASS, while adding sourcemaps and browser prefixes.
 */
 gulp.task('css', function() {
 	// Post CSS Processors
 	var processors = [
 		autoprefixer({
 			browsers: ['last 4 versions', 'ie >= 9', 'iOS >= 7']
 		})
 	];

 	return gulp.src([src.theme.sass + '**/*.scss'])
 		.pipe(plumber(plumberErrorHandler))
		.pipe(sourcemaps.init())
 		.pipe(bulkSass())
 		.pipe(sass({
 			outputStyle: 'compressed'
 		})
		.on('error', sass.logError))
 		.pipe(postcss(processors))
		.pipe(sourcemaps.write('../maps'))
 		.pipe(gulp.dest(wp.theme.css))
		.pipe(browserSync.stream({match: '**/*.css'}));
});

/**
 * Javascript
 *
 * Module support (Browserify), ES2015 support (Babel), minification, and sourcemaps.
 *
 * @link http://browserify.org/
 * @link https://babeljs.io/
 *
 * @param  {String} entry    Path to JS entry point.
 * @param  {String} filename Name of file, with extension, for compiled JS to be saved to.
 */
function bundleScripts(entry, filename) {
	return browserify({
			entries: entry,
			debug: true
		})
		.transform(babelify, {
			presets: ["es2015"]
		})
		.bundle()
		.on('error', function(err) {
			console.error(err);
			this.emit('end');
		})
		.pipe(source(filename))
		.pipe(buffer())
		.pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .pipe(sourcemaps.write('../maps'))
		.pipe(gulp.dest(wp.theme.js));
}

gulp.task('js:head', function() {
	return bundleScripts(src.theme.js + '/head.js', 'head.js');
});

gulp.task('js:main', function() {
	return bundleScripts(src.theme.js + '/main.js', 'main.js');
});

gulp.task('js:admin', function() {
	return bundleScripts(src.theme.js + '/admin.js', 'admin.js');
});

gulp.task('js:customizer', function() {
	return bundleScripts(src.theme.js + '/customizer.js', 'customizer.js');
});

gulp.task('js', gulp.series('js:head', 'js:main', 'js:admin', 'js:customizer'));

/**
 * SVG Tasks
 *
 * Takes all files from a directory ending in ".svg", and creates a dynamically generated
 * sass partial that converts all sources into optimized Data URIs. This sass partial is then
 * distributed into our theme's sass directory. It also includes mixins for using each
 * icon as a background-image.
 *
 * @ref: https://www.npmjs.com/package/gulp-svgo
 * @ref: https://www.npmjs.com/package/gulp-inline-svg
 */
gulp.task('svg:sass-partial', function() {
    return gulp
        .src([src.theme.svgs + '**/*.svg'])
        .pipe(svgo())
        .pipe(inlineSvg())
        .pipe(gulp.dest(src.theme.sassVarsDir));
});

//---
// SVG SPRITE TASK
//---
gulp.task('svg:sprite', function () {
	return gulp.src([src.theme.icons + '**/*.svg', '!' + src.theme.icons + '**/*-white.svg'])
		.pipe(cheerio({
			run: function ($) {
				$('[stroke]').each(function(){
					$this = $(this);
					if ( $this.attr('stroke') === 'none' ) {

					} else {
						$this.attr('stroke', 'currentColor');
					}
				});
				$('[fill]').each(function(){
					$this = $(this);
					if ( $this.attr('fill') === 'none' ) {

					} else {
						$this.attr('fill', 'currentColor');
					}
				});
			},
			parserOptions: { xmlMode: true }
		}))
		.pipe(svgmin(function (file) {
			var prefix = path.basename(file.relative, path.extname(file.relative));
			return {
				plugins: [{
					cleanupIDs: {
						prefix: prefix + '-',
						minify: false,
						remove: false
					}
		        }]
			};
		}))
		.pipe(svgstore())
		.pipe(gulp.dest(wp.theme.icons))
});

gulp.task('svg', gulp.series('svg:sass-partial', 'svg:sprite'));

gulp.task("build", gulp.series(
	'clean',
	'svg',
	'css',
	'js',
	'copy',
	function(done) {
		done();
    }
));


// --------------------------------
// Server Tasks
// --------------------------------

/**
 * Serves up the site using a proxy server which you need to provide
 */
 gulp.task('serve', function(done) {
	browserSync.init({
		proxy: {
		    target: `https://${host}`,
		}
	},
	function(){
		console.log('SITE WATCHING FOR CHANGES');
		done();
	});
 });

// --------------------------------
// Watch Tasks
// --------------------------------

gulp.task('watch', function(done) {
	// Theme Watcher
	gulp.watch(themeFiles, gulp.series(['copy']));

	// Sass Watcher
	gulp.watch(src.theme.sass + '**/*.scss', gulp.series('css'));

	// SVG Watcher
    gulp.watch(src.theme.svgs + '**/*.svg', gulp.series(['svg:sass-partial', 'svg:sprite']));

	// Scripts Watcher
	gulp.watch(src.theme.js + '**/*.js', gulp.series('js'));

	done();
});


// --------------------------------
// Default Task
// --------------------------------

gulp.task('default', gulp.series(
	'build',
	'serve',
	'watch',
	function(done) {
		done();
    }
));
