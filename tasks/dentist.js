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

    var src, dest = {}, filepath;
    // Sort out our file declarations --
    //   src = the source HTML file
    //  html = the destination HTML file
    //    js = the destination JS file
    this.files.some(function(f) {
      // grunt 0.4.3 had one file object..
      if (f.dest_js) {
        dest['dest_js'] = f.dest_js;
        dest['dest_html'] = f.dest_html;
        filepath = f.src[0];
        if (!filepath || !grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        }
        src = grunt.file.read(filepath);
        return true;
      }
      // grunt 0.4.2 had multiple.. strange
      else if (f.dest === "src" && f.src) {
        filepath = f.src.length ? f.src[0] : f.src;

        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        }
        src = grunt.file.read(filepath);
        return false;
      }
      else {
        dest[f.dest] = f.orig.src[0];
        return false;
      }
    });

    if (! src || ! dest.dest_js || ! dest.dest_html) {
      grunt.log.warn('Please specify src, dest_js, and dest_html.');
      return false;
    }

    // Use the HTML parser to grab anything inside script tags.
    var scripts = [], html = src, reading = false;
    var parser = new htmlparser.Parser({
      onopentag: function(name, attribs){
        if (name === "script" && ! attribs.src && (attribs.type === "text/javascript" || ! attribs.type)){
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
    if (options.include) {
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
    grunt.file.write(dest.dest_js, scripts.join("\n"));
    grunt.file.write(dest.dest_html, html);

    // Print a success message.
    grunt.log.writeln('Script "' + dest.dest_js + '" extracted.');
  });

};
