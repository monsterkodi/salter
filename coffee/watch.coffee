###
000   000   0000000   000000000   0000000  000   000
000 0 000  000   000     000     000       000   000
000000000  000000000     000     000       000000000
000   000  000   000     000     000       000   000
00     00  000   000     000      0000000  000   000
###

chokidar = require 'chokidar'
path     = require 'path'

watch = (opt, cb) ->

    dir = opt.dir ? '.'

    ignore = [
        /node_modules/
        /\/\..+$/
        /\.git$/
        /\.app$/
        /gulpfile.coffee/
        /Gruntfile.coffee/
    ]
    
    pass = (p) -> if path.extname(p).substr(1) in opt.ext then true
    
    watcher = chokidar.watch dir, ignored: ignore
    watcher
        # .on 'add',    (p) -> if pass p then console.log '| ' + p #else console.log '- ' + p
        .on 'change', (p) -> if pass p then cb p
        
module.exports = watch
