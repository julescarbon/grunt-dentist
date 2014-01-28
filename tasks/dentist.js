/*
 * grunt-dentist
 * https://github.com/julescarbon/grunt-dentist
 *
 * Copyright (c) 2014 Julie Lala
 * Licensed under the MIT license.
 */

'use strict';

var htmlparser = require('htmlparser2');

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('dentist', 'Wisdom extraction from script tags', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      include: "app.min.js",
      clear_scripts: true,
      strip_whitespace: true
    });

    var src, dest = {};

    // Sort out our file declarations --
    //   src = the source HTML file
    //  html = the destination HTML file
    //    js = the destination JS file
    this.files.forEach(function(f) {
      if (f.dest === "src") {
        var filepath = f.src;
        filepath = filepath.shift();
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        }
        src = grunt.file.read(filepath);
      }
      else {
        console.log(f.orig);
        dest[f.dest] = f.orig.src[0];
      }
    });

    // Use the HTML parser to grab anything inside script tags.
    var scripts = [], html = src, reading = false;
    var parser = new htmlparser.Parser({
      onopentag: function(name, attribs){
        if (name === "script" && (attribs.type === "text/javascript" && ! attribs.src) || ! attribs.type){
          reading = true;
        }
      },
      ontext: function(text){
        if (reading) {
          scripts.push(text);
        }
      },
      onclosetag: function(tagname){
        if (tagname === "script"){
          reading = false;
        }
      }
    });
    parser.write(src);
    parser.end();

		// Replace any non-trivial scripts
    for (var i = 0; i < scripts.length; i++) {
      if (scripts[i].length && scripts[i] !== "\n") {
        html = html.replace(scripts[i], "");
      }
    }

    // Avoid wiping external dependencies and non-JS content inside script tags
    html = html.replace(/<script[^>]*>.*<\/script>/g, function(str){
      if (str.match(/ type=/) && ! str.match(/text\/javascript/)) { return str; }
      else if (str.match(/src=['"](https?)/)) { return str; }
      else if (str.match(/src=['"]\/\//)) { return str; }
      else if (! options.clear_scripts && str.match(/src=['"]/)) { return ""; }
      else { return ""; }
    });

    // Inject a script tag pointed at the minified file.
    if (options.include.length) {
      // Attempt to insert the shim after the closing body tag.
      var script_tag = '<script type="text/javascript" src="' + options.include + '"></script>';
      var added = ["</body>", "</html>", "</head>"].some(function(shim){
        var i = html.lastIndexOf(shim);
        if (i !== -1) {
          html = html.substr(0, i) + script_tag + html.substr(i);
          return true;
        }
        return false;
      });
      // Failing that, just append it.
      if (! added) {
        html += script_tag;
      }
    }

    // Strip excess whitespace (anything more than two newlines) and leftover indentation.
    if (options.strip_whitespace) {
      html = html.replace(/\s*\n/g,"\n").replace(/\r?\n\r?\n+/g,"\n\n");
    }
    
    // Write the destination file.
    grunt.file.write(dest.js, scripts.join("\n"));
    grunt.file.write(dest.html, html);

    // Print a success message.
    grunt.log.writeln('Script "' + dest.js + '" extracted.');
  });

};
