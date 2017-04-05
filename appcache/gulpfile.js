/**
 * Created by yy on 2016/5/4.
 */
// 加载插件
var gulp = require('gulp'),
    cleanCSS = require('gulp-clean-css'), //压缩css插件
    uglify = require('gulp-uglify'), //压缩js插件
    imagemin = require('gulp-imagemin'),    //压缩图片插件
    notify = require('gulp-notify'),    //更改提醒插件
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    sass = require('gulp-ruby-sass'),   //编译scss插件
    cssver = require('gulp-make-css-url-version'),//给css文件中引用文件加版本号(md5)
    autoprefixer = require('gulp-autoprefixer'),
//处理后存放的位置
    cssPath = "dist/css",
    jsPath = 'dist/js',
    imagePath = 'dist/images';

// 压缩CSS
gulp.task('css', function () {
    return gulp.src('css/*.css')

        .pipe(cssver()) //给css文件中引用文件加版本号(md5)
        .pipe(cleanCSS({compatibility: 'ie8', debug: true}, function (details) {
            console.log(details.name + 'before:' + details.stats.originalSize); //打印压缩前size
            console.log(details.name + 'after:' + details.stats.minifiedSize); //打印压缩后size
        }))
        .pipe(gulp.dest(cssPath))
        .pipe(notify({message: 'css ok'}));
});

// 压缩js
gulp.task('js', function () {
    return gulp.src('js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest(jsPath))
        .pipe(notify({message: 'js ok'}));
});

// 压缩图片
gulp.task('images', function () {
    return gulp.src('images/*')
        .pipe(cache(imagemin({optimizationLevel: 3, progressive: true, interlaced: true})))
        .pipe(gulp.dest(imagePath))
        //提醒任务完成
        .pipe(notify({message: 'Images ok'}));
});

//编译sass
gulp.task('sass', function () {
    return sass('scss/style.scss')
        .on('error', function (err) {
            console.error('Error!', err.message);
        })
        .pipe(gulp.dest('css'))
        .pipe(notify({message: 'scss ok'}));
})

// 监听所有文件
gulp.task('auto', function () {
// Watch .scss files
    gulp.watch('css/*.css', ['css']);
// Watch .js files
    gulp.watch('js/*.js', ['js']);
// Watch image files
    gulp.watch('images/*', ['images']);
// watch scss files
    gulp.watch('scss/*.scss', ['sass']);
// Watch any files in assets/, reload on change
    gulp.watch(['dist/*']).on('change', livereload.changed);
});

//默认任务
gulp.task('default', function () {
//监听有修改，就自动压缩
    gulp.start(['css', 'auto'], ['js', 'auto'], ['images', 'auto'], ['sass', 'auto']);
});