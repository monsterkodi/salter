
/*
 0000000   0000000   000      000000000  00000000  00000000 
000       000   000  000         000     000       000   000
0000000   000000000  000         000     0000000   0000000  
     000  000   000  000         000     000       000   000
0000000   000   000  0000000     000     00000000  000   000
 */

(function() {
  var _, args, asciiJoin, asciiLines, choki, colors, config, ext, font, fs, hash, hashfill, log, noon, opt, path, prettyPath, prettyTime, resolve, salt, slash, slashfill, watch, write,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  fs = require('fs');

  path = require('path');

  noon = require('noon');

  colors = require('colors');

  write = require('write-file-atomic');

  choki = require('chokidar');

  path = require('path');

  _ = require('lodash');

  font = require('../font.json');

  log = console.log;

  args = require('karg')("\nsalter\n    directory  . ? the directory to watch . * . = .\n    verbose    . ? log more                   . = false\n    quiet      . ? log nothing                . = false\n    time       . ? log with time              . = true\n    \nversion    " + (require(__dirname + "/../package.json").version));


  /*
  00000000   00000000   0000000   0000000   000      000   000  00000000
  000   000  000       000       000   000  000      000   000  000     
  0000000    0000000   0000000   000   000  000       000 000   0000000 
  000   000  000            000  000   000  000         000     000     
  000   000  00000000  0000000    0000000   0000000      0      00000000
   */

  resolve = function(unresolved) {
    var p;
    p = unresolved.replace(/\~/, process.env.HOME);
    p = path.resolve(p);
    p = path.normalize(p);
    return p;
  };


  /*
  00000000   00000000   00000000  000000000  000000000  000   000
  000   000  000   000  000          000        000      000 000 
  00000000   0000000    0000000      000        000       00000  
  000        000   000  000          000        000        000   
  000        000   000  00000000     000        000        000
   */

  prettyPath = function(p, c) {
    if (c == null) {
      c = colors.white;
    }
    return p.split(path.sep).map(function(n) {
      return c(n).bold;
    }).join(c(path.sep).dim);
  };

  prettyTime = function() {
    var d;
    if (args.time) {
      d = new Date();
      return ["" + (_.padStart(String(d.getHours()), 2, '0').gray) + ':'.dim.gray, "" + (_.padStart(String(d.getMinutes()), 2, '0').gray) + ':'.dim.gray, "" + (_.padStart(String(d.getSeconds()), 2, '0').gray)].join('');
    } else {
      return '';
    }
  };


  /*
   0000000   0000000   000   000  00000000  000   0000000 
  000       000   000  0000  000  000       000  000      
  000       000   000  000 0 000  000000    000  000  0000
  000       000   000  000  0000  000       000  000   000
   0000000   0000000   000   000  000       000   0000000
   */

  config = function(defaults) {
    var f, i, len, merge, ref;
    merge = function(f) {
      return defaults = _.defaultsDeep(noon.load(f), defaults);
    };
    ref = [resolve('~/.salter.noon'), resolve('~/.salter.json'), resolve(path.join(args.directory, '.salter.noon')), resolve(path.join(args.directory, '.salter.json'))];
    for (i = 0, len = ref.length; i < len; i++) {
      f = ref[i];
      if (fs.existsSync(f)) {
        merge(resolve(f));
      }
    }
    if (args.verbose) {
      log(noon.stringify(defaults, {
        colors: true
      }));
    }
    return defaults;
  };


  /*
  00000000  000   000  000000000
  000        000 000      000   
  0000000     00000       000   
  000        000 000      000   
  00000000  000   000     000
   */

  hash = {
    marker: '#>',
    prefix: '###',
    postfix: '###'
  };

  hashfill = {
    marker: '#>',
    prefix: null,
    fill: '#  ',
    postfix: null
  };

  slash = {
    marker: '//>',
    prefix: '/*',
    postfix: '*/'
  };

  slashfill = {
    marker: '//>',
    prefix: '/*',
    fill: '*  ',
    postfix: '*/'
  };

  ext = config({
    coffee: hash,
    js: slash,
    ts: slash,
    h: slash,
    cpp: slash,
    py: hashfill,
    noon: hashfill,
    styl: slashfill,
    jade: {
      marker: '//>',
      prefix: null,
      fill: '//- ',
      postfix: null
    }
  });

  opt = {
    dir: args.directory,
    ext: Object.keys(ext)
  };


  /*
  000   000   0000000   000000000   0000000  000   000
  000 0 000  000   000     000     000       000   000
  000000000  000000000     000     000       000000000
  000   000  000   000     000     000       000   000
  00     00  000   000     000      0000000  000   000
   */

  watch = function(opt, cb) {
    var dir, ignore, pass, ref, watcher;
    dir = (ref = opt.dir) != null ? ref : '.';
    ignore = [/node_modules/, /\/\..+$/, /\.git$/, /\.app$/, /gulpfile.coffee/, /Gruntfile.coffee/];
    pass = function(p) {
      var ref1;
      if (ref1 = path.extname(p).substr(1), indexOf.call(opt.ext, ref1) >= 0) {
        return true;
      }
    };
    watcher = choki.watch(dir, {
      ignored: ignore,
      ignoreInitial: true
    });
    return watcher.on('add', function(p) {
      if (pass(p)) {
        return cb(p);
      }
    }).on('change', function(p) {
      if (pass(p)) {
        return cb(p);
      }
    });
  };

  watch(opt, function(f) {
    return fs.readFile(f, 'utf8', function(err, data) {
      var salted;
      if (err) {
        log(("can't read " + f.bold.yellow).bold.red);
        return;
      }
      salted = salt(data, ext[path.extname(f).substr(1)]);
      if (salted !== data) {
        if (!args.quiet) {
          log(prettyTime(), '☛'.gray, prettyPath(f));
        }
        return write(f, salted, function(err) {
          if (err) {
            return log(("can't write " + f.bold.yellow).bold.red);
          }
        });
      }
    });
  });


  /*
   0000000    0000000   0000000  000  000
  000   000  000       000       000  000
  000000000  0000000   000       000  000
  000   000       000  000       000  000
  000   000  0000000    0000000  000  000
   */

  asciiLines = function(s, options) {
    var c, cs, i, len, rs, zs;
    s = s.toLowerCase().trim();
    cs = [];
    for (i = 0, len = s.length; i < len; i++) {
      c = s[i];
      if (font[c] != null) {
        cs.push(font[c]);
      }
    }
    zs = _.zip.apply(null, cs);
    rs = _.map(zs, function(j) {
      return j.join('  ');
    });
    if ((options.character != null) && options.character.length === 1) {
      rs = _.map(rs, function(l) {
        return l.replace(/0/g, options.character);
      });
    }
    return rs;
  };

  asciiJoin = function(l) {
    return "\n" + l.join('\n') + "\n";
  };

  salt = function(s, options) {
    var i, k, l, len, li, lines, lns, m, r, ref, salted;
    lines = s.split('\n');
    salted = [];
    r = new RegExp('^(\\s*)(' + options.marker + ")", 'i');
    for (li = i = 0, ref = lines.length; 0 <= ref ? i < ref : i > ref; li = 0 <= ref ? ++i : --i) {
      if (m = lines[li].match(r)) {
        lns = asciiLines(lines[li].slice(m[1].length + options.marker.length), options);
        if (options.verbose) {
          log(asciiJoin(lns));
        }
        if (options.prefix != null) {
          salted.push(m[1] + options.prefix);
        }
        for (k = 0, len = lns.length; k < len; k++) {
          l = lns[k];
          salted.push(m[1] + ((options.fill != null) && options.fill || '') + l);
        }
        if (options.postfix != null) {
          salted.push(m[1] + options.postfix);
        }
      } else {
        salted.push(lines[li]);
      }
    }
    return salted.join('\n');
  };

}).call(this);
