//Configuration Object
//jsConcatFiles => list of javascript files (in order) to concatenate
// buildFilesFoldersRemove => list of files to remove when running final build
var config = {
	jsConcatFiles: [
		'./app/js/module1.js', 
		'./app/js/main.js'
	], 
	buildFilesFoldersRemove:[
		'build/scss/', 
		'build/js/!(*.min.js)',
		'build/bower.json',
		'build/bower_components/',
		'build/maps/'
	]
};

//////////////////////////////////////////////
//	Requiring Dependencies
/////////////////////////////////////////////

var gulp = require('gulp'),
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	uglify = require('gulp-uglify'),
	browserSync = require('browser-sync'),
	reload = browserSync.reload,
	rename = require('gulp-rename'),
	concat = require('gulp-concat'),
	autoprefixer = require('gulp-autoprefixer'),
	del = require('del');


function errorlog(err){
	console.error(err.message);
	this.emit('end');
}


//////////////////////////////////////////////
//	Scripts Task
/////////////////////////////////////////////
gulp.task('scripts', function() {
	return gulp.src(config.jsConcatFiles)
	.pipe(sourcemaps.init())
		.pipe(concat('temp.js'))
		.pipe(uglify())
		.on('error', errorlog)
		.pipe(rename('app.min.js'))		
    .pipe(sourcemaps.write('../maps'))
    .pipe(gulp.dest('./app/js/'))

    .pipe(reload({stream:true}));
});

//////////////////////////////////////////////
//	Compass / Sass Tasks
/////////////////////////////////////////////
gulp.task('compass', function() {
	gulp.src('app/scss/style.scss')
		.pipe(sourcemaps.init())
			.pipe(sass({outputStyle: 'compressed'}))
			.on('error', errorlog)
			.pipe(autoprefixer({
	            browsers: ['last 3 versions'],
	            cascade: false
	        }))	
		.pipe(sourcemaps.write('../maps'))
		.pipe(gulp.dest('app/css'))
		.pipe(reload({stream:true}));
});

//////////////////////////////////////////////
//	HTML Task
/////////////////////////////////////////////
gulp.task('html', function() {
	gulp.src('app/**/*.html')
	.pipe(reload({stream:true}));
});

//////////////////////////////////////////////
//	Build Task
/////////////////////////////////////////////

//clear out all files and folders from build folder
gulp.task('build:cleanfolder', function (cb) {
	return del([
		'build/**'
	], cb);
});

// task to create build directory of all files
gulp.task('build:copy', ['build:cleanfolder'], function(){
    return gulp.src('app/**/*/')
    .pipe(gulp.dest('build/'));
});

// task to removed unwanted build files
// list all files and directories here that you don't want included
gulp.task('build:remove', ['build:copy'], function (cb) {
	del(config.buildFilesFoldersRemove, cb);
});

//same like th defualt task
gulp.task('build', ['build:copy', 'build:remove']);

//////////////////////////////////////////////
//	Browser-Sync Task
/////////////////////////////////////////////
gulp.task('browser-sync', function() {
	browserSync({
		server:{
			baseDir: "./app/"
		}
	})
});

//browsing the build directory task
gulp.task('build:serve', function() {
	browserSync({
		server:{
			baseDir: "./build/"
		}
	})
});

//////////////////////////////////////////////
//	Watch Task
/////////////////////////////////////////////
gulp.task('watch', function() {
	gulp.watch('app/js/**/*.js', ['scripts']);
	gulp.watch('app/scss/**/*.scss', ['compass']);
	gulp.watch('app/**/*.html', ['html']);
});

//////////////////////////////////////////////
//	Defualt Task
/////////////////////////////////////////////
gulp.task('default', ['scripts', 'compass', 'html', 'browser-sync', 'watch']);
