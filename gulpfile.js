// --------------------------------
// Gulp Plugins
// --------------------------------

// Gulp - Duh
const gulp 			= require('gulp');

// CSS
const sass 			= require('gulp-sass');
const postcss 		= require('gulp-postcss');
const bulkSass 		= require('gulp-sass-glob-import');
const autoprefixer 	= require('autoprefixer');

// JavaScript
const uglify 		= require('gulp-uglify');
const babelify 		= require('babelify');
const browserify 	= require('browserify');

// SVG
const svgo 			= require('gulp-svgo');
const svgmin 		= require('gulp-svgmin');
const svgstore 		= require('gulp-svgstore');
const inlineSvg 	= require('gulp-inline-svg');

// Other
const fs 			= require('fs');
const del 			= require('del');
const zip 			= require('gulp-zip');
const path 			= require('path');
const source 		= require('vinyl-source-stream');
const buffer 		= require('vinyl-buffer');
const notify 		= require('gulp-notify');
const plumber 		= require('gulp-plumber');
const cheerio 		= require('gulp-cheerio');
const sourcemaps 	= require('gulp-sourcemaps');
const browserSync 	= require('browser-sync').create();


// --------------------------------
// Globals
// --------------------------------

/**
 * Let's us access the contents of package.json as an object.
 * @type {Object}
 */
const packagejson = JSON.parse(fs.readFileSync('./package.json'));

/**
 * The host you'd like to use while working locally.
 * @type {String}
 */
const host = "mashkey.com";

/**
 * Paths to files in /src directory.
 * @type {Object}
 */
const src = {
	root: './src',
};

src.sass = `${src.root}/sass`;
src.js = `${src.root}/js`;
src.svg = `${src.root}/svg`;
src.icons = `${src.svg}/icons`;

/**
 * Paths to files in /build directory.
 * @type {Object}
 */
const build = {
	root: './build',
};

build.css = `${build.root}/css`;
build.js = `${build.root}/js`;
build.svg = `${build.root}/svg`;
build.icons = `${build.svg}/icons`;

/**
 * Reusable file matching globs.
 * @type {Object}
 */
const globs = {
	src: {
		js: [
			`${src.js}/**/*.js`
		],
		sass: [
			`${src.sass}/**/*.scss`
		],
		svg: [
			`${src.svg}/**/*.svg`
		],
		icons: [
			`${src.icons}/**/*.svg`
		],
		other: [
			`${src.root}/**/*`,
		  	`!${src.sass}{,/**}`,
		  	`!${src.js}{,/**}`,
			`!${src.svg}{,/**}`,
		],
	},
	build: {
		js: [
			`${build.js}/**/*.js`
		],
		css: [
			`${build.css}/**/*.css`
		],
		svg: [
			`${build.svg}/**/*.svg`
		],
		icons: [
			`${build.icons}/**/*.svg`
		],
		other: [
			`${build.root}/**/*`,
		  	`!${build.css}{,/**}`,
		  	`!${build.js}{,/**}`,
			`!${build.svg}{,/**}`,
			`!${build.root}/maps{,/**}`,
		],
	}
};

/**
 * Gulp Error Handling
 */
const plumberErrorHandler = {
	errorHandler: notify.onError({
		title: 'Gulp - Error',
		message: 'Error: <%= error.message %>'
	})
};

/**
 * Delete all files, except js, css, and svg, from build directory.
 */
gulp.task('clean', function() {
	return del(globs.build.other);
});

/**
 * Move Files into Build Folder
 */
gulp.task('copy', function() {
	console.log('## Move all files (except .scss, .js, and .svg) into the build directory ##');
	return gulp.src(globs.src.other)
		.pipe(gulp.dest(build.root));
});

/**
 * Compress Build Files into Zip
 * Dependent on the build task completing
 *
 * @link https://www.npmjs.com/package/gulp-zip
 */
gulp.task('zip', function() {
	console.log('## Pack up our files into a zip into the dist directory ##');
	return gulp.src(`${build.root}/**`)
    	.pipe(zip(`${packagejson.name}.zip`))
    	.pipe(gulp.dest('dist'));
});

gulp.task('dist', gulp.series('clean', 'copy', 'zip'));

/**
 * Clean out build/css directory.
 */
gulp.task('css:clean', function() {
	return del(globs.build.js)
});

/**
 * Compile SASS, while adding sourcemaps and browser prefixes.
 */
 gulp.task('css:process', function() {
 	// Post CSS Processors
 	const processors = [
 		autoprefixer({
 			browsers: ['last 3 versions', 'ie >= 11', 'iOS >= 8']
 		})
 	];

 	return gulp.src(globs.src.sass)
 		.pipe(plumber(plumberErrorHandler))
		.pipe(sourcemaps.init())
 		.pipe(bulkSass())
 		.pipe(sass({
 			outputStyle: 'compressed'
 		})
		.on('error', sass.logError))
 		.pipe(postcss(processors))
		.pipe(sourcemaps.write('../maps'))
 		.pipe(gulp.dest(build.css))
		.pipe(browserSync.stream({match: '**/*.css'}));
});

gulp.task('css', gulp.series('css:clean', 'css:process', 'zip'));

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
		.pipe(gulp.dest(build.js));
}

gulp.task('js:clean', function() {
	return del(globs.build.js)
});

gulp.task('js:process', gulp.series(
	function() {
		return bundleScripts(`${src.js}/head.js`, 'head.js');
	},
	function() {
		return bundleScripts(`${src.js}/main.js`, 'main.js');
	},
	function() {
		return bundleScripts(`${src.js}/admin.js`, 'admin.js');
	},
	function() {
		return bundleScripts(`${src.js}/customizer.js`, 'customizer.js');
	}
));

gulp.task('js', gulp.series('js:clean', 'js:process', 'zip'));

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
    return gulp.src(globs.src.svg)
        .pipe(svgo())
        .pipe(inlineSvg())
        .pipe(gulp.dest(`${src.scss}/config/variables`));
});

//---
// SVG SPRITE TASK
//---
gulp.task('svg:sprite', function () {
	return gulp.src(globs.src.icons)
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
		.pipe(gulp.dest(build.icons))
});

gulp.task('svg:clean', function() {
	return del(globs.build.svg)
});

gulp.task('svg', gulp.series('svg:clean', 'svg:sass-partial', 'svg:sprite', 'zip'));

// --------------------------------
// Server Tasks
// --------------------------------

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
	// General Watcher
	gulp.watch(globs.src.other, gulp.series('dist'));

	// Sass Watcher
	gulp.watch(globs.src.sass, gulp.series('css'));

	// JavaScript Watcher
	gulp.watch(globs.src.js, gulp.series('js'));

	// SVG Watcher
	gulp.watch(globs.src.svgs, gulp.series('svg'));

	done();
});


// --------------------------------
// Default Task
// --------------------------------

gulp.task('default', gulp.series(
	'css',
	'js',
	'svg',
	'dist',
	'serve',
	'watch',
	function(done) {
		done();
    }
));
