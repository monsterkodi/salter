del  = require 'del'
path = require 'path'
gulp = require 'gulp'
p    = require('gulp-load-plugins') lazy:false
(eval "#{k} = p.#{k}" for k,v of p)
 
onError = (err) -> util.log err

gulp.task 'coffee', ->
    gulp.src ['coffee/**/*.coffee'], base: './coffee'
        .pipe plumber()
        .pipe debug title: 'coffee'
        .pipe coffee(bare: true).on 'error', onError
        .pipe gulp.dest 'js/'
                    
gulp.task 'bump', ->
    gulp.src './package.json'
        .pipe bump()
        .pipe gulp.dest '.'

gulp.task 'clean', (cb) ->
    del.sync [ 'js' ]
    cb()
    
gulp.task 'release', ['clean', 'salt', 'coffee']

gulp.task 'default', ->
                
    gulp.watch 'coffee/**/*.coffee', ['coffee']
