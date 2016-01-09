# salter

A command line utility that generates ascii-font headers. 

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

Currently, the following file types are handled:

- coffee
- h, cpp
- py
- styl

This stuff works for me, but I won't guarantee that it works for you as well. 
Use at your own risk!

[npm](https://www.npmjs.com/package/salter)
