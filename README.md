# salter

A command line utility that generates ascii-font headers. 

```shell
npm install -g salter
```

It watches for changes to source files in (or below) a given directory.  

When a file change occurs it searches for special comment lines, eg:

```coffee
#!! salt
```
... and replaces them with something like this:

```coffee
###
 0000000   0000000   000      000000000
000       000   000  000         000   
0000000   000000000  000         000   
     000  000   000  000         000   
0000000   000   000  0000000     000   
###
```

### Defaults

Currently, the following file types are handled by default:

- coffee
- js
- ts
- h, cpp
- py
- styl
- jade
- noon

The default marker for coffee, python and noon files is: **#!!**  
For all other file types: **//!**

### Configuration

On startup, salter looks for configuration files in your home directory and/or the target directory: **.salter.noon** or **.salter.json**

For example, a **.salter.noon** file that adds handling of html files could look like this:
```
html
    marker      !!
    prefix      <!--
    postfix     --!>
```

or, if you prefer json:
``` json
{
    "html": {
        "marker": "!!",
        "prefix": "<!--",
        "postfix": "-->"
    }
}
```

This stuff works for me, but I won't guarantee that it works for you as well. 
Use at your own risk!

[npm](https://www.npmjs.com/package/salter)
