var gulp 					= require('gulp'),
		sass 					= require('gulp-sass'),
		browserSync 	= require('browser-sync'),
		concat				= require('gulp-concat'),
		uglify				= require('gulp-uglifyjs'),
		cssnano				= require('gulp-cssnano'),
		rename				= require('gulp-rename'),
		del						= require('del'),
		imagemin			= require('gulp-imagemin'),
		pngquant			=	require('imagemin-pngquant'),
		cache					=	require('gulp-cache'),
		autoprefixer	=	require('gulp-autoprefixer');

// gulp.task('mytask', function(){
// 	return gulp.src('source-files') //берем файлы
// 	.pipe(plugins()) //выполняем действия с файлами
// 	.pipe(gulp.dest('folder')) //куда выгружаем результат
// 	console.log('Ура, задача запущена :)');
// });

gulp.task('sass', function(){
	return gulp.src('app/sass/**/*.sass') //для подпапок /**/main.sass | для выборки *.sass && *.+(scss|sass)
	.pipe(sass())
	.pipe(autoprefixer(['last 15 version', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
	.pipe(gulp.dest('app/css/'))
	.pipe(browserSync.reload({stream: true}))
});

gulp.task('scripts', function(){
	return gulp.src([
		'app/libs/jquery/dist/jquery.min.js',
		'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js',
		])
	.pipe(concat('libs.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('app/js/'));
});

gulp.task('css-libs', ['sass'], function(){
	return gulp.src('app/css/libs.css')
	.pipe(cssnano())
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest('app/css/'));
});

gulp.task('browser-sync', function(){
	browserSync({
		server:{
			baseDir: 'app'
		},
		browser: 'firefox',
		//host: '192.168.0.126:3000',
		notify: true //уведомления в браузере
	});
});

gulp.task('clean', function(){
	return del.sync('public/');
});

gulp.task('cleanCache', function(){
	return cache.clearAll();
});

gulp.task('img', function(){
	return gulp.src('app/img/*')
	.pipe(cache(imagemin({
		interlaced: true,
		progressive: true,
		svgoPlugins: [{removeViewBox: false}],
		une: [pngquant()]
	})))
	.pipe(gulp.dest('public/img'));
});

gulp.task('watch', ['browser-sync', 'css-libs', 'scripts'], function(){ //[] - эти параметры выполняются до запуска команды watch
	gulp.watch('app/sass/**/*.sass', ['sass']);
	gulp.watch('app/*.html', browserSync.reload);
	gulp.watch('app/js/**/*.js', browserSync.reload);
});

gulp.task('build', ['clean', 'img', 'sass', 'scripts'], function(){
	var buildCss = gulp.src([
			'app/css/main.css',
			'app/css/libs.min.css'
		])
		.pipe(gulp.dest('public/css'));

	var buildFonts = gulp.src('app/fonts/**/*')
		.pipe(gulp.dest('public/fonts'));

	var buildJs = gulp.src('app/js/**/*')
		.pipe(gulp.dest('public/js'));

	var buildHtml = gulp.src('app/*.html')
		.pipe(gulp.dest('public/'));
});