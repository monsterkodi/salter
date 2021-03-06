
# 0000000   0000000   000      000000000  00000000  00000000 
#000       000   000  000         000     000       000   000
#0000000   000000000  000         000     0000000   0000000  
#     000  000   000  000         000     000       000   000
#0000000   000   000  0000000     000     00000000  000   000

fs     = require 'fs'
path   = require 'path'
noon   = require 'noon'
colors = require 'colors'
write  = require 'write-file-atomic'
choki  = require 'chokidar'
path   = require 'path'
_      = require 'lodash'
font   = require '../font.json'
log    = console.log

args = require('karg') """

salter
    directory  . ? the directory to watch . * . = .
    verbose    . ? log more                   . = false
    quiet      . ? log nothing                . = false
    time       . ? log with time              . = true
    
version    #{require("#{__dirname}/../package.json").version}
"""

#00000000   00000000   0000000   0000000   000      000   000  00000000
#000   000  000       000       000   000  000      000   000  000     
#0000000    0000000   0000000   000   000  000       000 000   0000000 
#000   000  000            000  000   000  000         000     000     
#000   000  00000000  0000000    0000000   0000000      0      00000000

resolve = (unresolved) ->
    p = unresolved.replace /\~/, process.env.HOME
    p = path.resolve p
    p = path.normalize p
    p

#00000000   00000000   00000000  000000000  000000000  000   000
#000   000  000   000  000          000        000      000 000 
#00000000   0000000    0000000      000        000       00000  
#000        000   000  000          000        000        000   
#000        000   000  00000000     000        000        000   

prettyPath = (p, c=colors.white) ->
    p.split(path.sep).map((n) -> c(n).bold).join c(path.sep).dim

prettyTime = () ->
    if args.time
        d = new Date()
        ["#{_.padStart(String(d.getHours()),   2, '0').gray}#{':'.dim.gray}"
         "#{_.padStart(String(d.getMinutes()), 2, '0').gray}#{':'.dim.gray}"
         "#{_.padStart(String(d.getSeconds()), 2, '0').gray}"].join('')
    else
        ''

# 0000000   0000000   000   000  00000000  000   0000000 
#000       000   000  0000  000  000       000  000      
#000       000   000  000 0 000  000000    000  000  0000
#000       000   000  000  0000  000       000  000   000
# 0000000   0000000   000   000  000       000   0000000 

config = (defaults) ->
    merge = (f) -> defaults = _.defaultsDeep noon.load(f), defaults
    for f in [
        resolve '~/.salter.noon'
        resolve '~/.salter.json'
        resolve path.join args.directory, '.salter.noon'
        resolve path.join args.directory, '.salter.json'
        ]
        if fs.existsSync f
            merge resolve f
    if args.verbose then log noon.stringify defaults, colors:true
    defaults

#00000000  000   000  000000000
#000        000 000      000   
#0000000     00000       000   
#000        000 000      000   
#00000000  000   000     000   

hash = 
        marker: '#>'
        prefix:  '###'
        postfix: '###'

hashfill = 
        marker: '#>'
        prefix:  null
        fill:    '# '
        postfix: null

slash =
        marker:  '//>'
        prefix:  '/*'
        postfix: '*/'

slashfill =
        marker:  '//>'
        prefix:  null
        fill:    '// '
        postfix: null

ext = config   
    coffee: hashfill
    js:     slashfill
    ts:     slash
    h:      slashfill
    cpp:    slashfill
    py:     hashfill     
    noon:   hashfill
    styl:   slashfill
    jade:
        marker:  '//>'
        prefix:  null
        fill:    '//- '
        postfix: null

opt = 
    dir: args.directory
    ext: Object.keys ext

#000   000   0000000   000000000   0000000  000   000
#000 0 000  000   000     000     000       000   000
#000000000  000000000     000     000       000000000
#000   000  000   000     000     000       000   000
#00     00  000   000     000      0000000  000   000

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
    
    watcher = choki.watch dir, 
        ignored: ignore
        ignoreInitial: true
    watcher
        .on 'add',    (p) -> if pass p then cb p
        .on 'change', (p) -> if pass p then cb p
            
watch opt, (f) ->
    fs.readFile f, 'utf8', (err, data) -> 
        if err 
            log "can't read #{f.bold.yellow}".bold.red
            return

        salted = salt data, ext[path.extname(f).substr 1]
        if salted != data
            log prettyTime(), '☛'.gray, prettyPath(f) if not args.quiet
            write f, salted, (err) ->
                log "can't write #{f.bold.yellow}".bold.red if err

# 0000000    0000000   0000000  000  000
#000   000  000       000       000  000
#000000000  0000000   000       000  000
#000   000       000  000       000  000
#000   000  0000000    0000000  000  000

asciiLines = (s, options) ->
    
        s = s.toLowerCase().trim()
        
        cs = []
        for c in s
            if font[c]?
                cs.push font[c]

        zs = _.zip.apply(null, cs)
        rs = _.map(zs, (j) -> j.join('  '))
        if options.character? and options.character.length == 1
            rs = _.map(rs, (l) -> l.replace(/0/g, options.character))
        rs
    
asciiJoin = (l) -> "\n"+l.join('\n')+"\n"

salt = (s, options) ->

    lines = s.split '\n'
    salted = []
    r = new RegExp('^(\\s*)(' + options.marker + ")", 'i')
    for li in [0...lines.length]
        if m = lines[li].match(r)
            lns = asciiLines(lines[li].slice(m[1].length+options.marker.length), options)
            if options.verbose
                log asciiJoin(lns)
            salted.push m[1] + options.prefix if options.prefix?
            for l in lns
                salted.push m[1] + (options.fill? and options.fill or '') + l
            salted.push m[1] + options.postfix if options.postfix?
        else
            salted.push lines[li]
        
    salted.join '\n'
