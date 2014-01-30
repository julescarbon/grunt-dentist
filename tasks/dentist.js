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

  grunt.registerMultiTask('dentist', 'Wisdom extraction from documents', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      include_js: "app.min.js",
      include_css: "app.css",
      clear_scripts: true,
      strip_whitespace: true
    });

		var self = this;
    var src, dest = {}, filepath;
    var scripts = [], styles = [], html;

		function run_dentist() {
			if (load_files() && parse_html()) {
				if (dest.dest_html) {
					if (dest.dest_js) {
						remove_inline_scripts();
						remove_script_tags();
						inject_script_shim();
					}
					if (dest.dest_css) {
						remove_inline_stylesheets();
						remove_stylesheet_tags();
						inject_stylesheet_shim();
					}
				}

				write_js();
				write_css();
				write_html();
				return true;
			}
			else {
				return false;
			}
		}

		// Sort out our file declarations --
    function load_files(){
			var reading_js = false, reading_css = false;
			//        src = the source HTML file
			//  dest_html = the destination HTML file
			//   dest_css = the destination JS file
			//    dest_js = the destination JS file
			self.files.some(function(f) {
				// grunt 0.4.3 had one file object..
				if (f.dest_js) {
					dest['dest_js'] = f.dest_js;
					dest['dest_css'] = f.dest_css;
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
			if (! src || (! dest.dest_js && ! dest.dest_css && ! dest.dest_html)) {
				grunt.log.warn('Please specify src, and dest_js, dest_css, or dest_html.');
				return false;
			}
			html = src;
			return true;
		}

    // Use the HTML parser to grab anything inside script tags.
		function parse_html() {
			var reading_js = false, reading_css = false;
			var parser = new htmlparser.Parser({
				onopentag: function(name, attribs){
					if (name === "script" && ! attribs.src && (attribs.type === "text/javascript" || ! attribs.type)){
						reading_js = true;
					}
					else if (name === "style") {
						reading_css = true;
					}
				},
				ontext: function(text){
					if (reading_js) {
						scripts.push(text);
					}
					if (reading_css) {
						styles.push(text);
					}
				},
				onclosetag: function(tagname){
					if (tagname === "script"){
						reading_js = false;
					}
					else if (tagname === "style"){
						reading_css = false;
					}
				}
			});
			parser.write(src);
			parser.end();

			return true;
		}


		// Remove inlined scripts from HTML
		function remove_inline_scripts(){
			// Replace any non-trivial scripts
			for (var i = 0; i < scripts.length; i++) {
				if (scripts[i].length && scripts[i] !== "\n") {
					html = html.replace(scripts[i], "");
				}
			}
		}

		// Remove inlined stylesheets from HTML
		function remove_inline_stylesheets(){
			for (var i = 0; i < styles.length; i++) {
				if (styles[i].length && styles[i] !== "\n") {
					html = html.replace(styles[i], "");
				}
			}
		}

		// Remove script tags pointing at local assets.
		function remove_script_tags(){
			// Avoid wiping external dependencies and non-JS content inside script tags
			html = html.replace(/<script[^>]*>.*<\/script>/g, function(str){
				if (str.match(/ type=/) && ! str.match(/text\/javascript/)) { return str; }
				else if (str.match(/src=['"]?(https?)/)) { return str; }
				else if (str.match(/src=['"]?\/\//)) { return str; }
				else if (! options.clear_scripts && str.match(/src=['"]/)) { return ""; }
				else { return ""; }
			});
		}

		// Remove style and link tags pointing at local stylesheets
		function remove_stylesheet_tags() {
			// We can remove the style tag with impunity, it is always inlining.
			html = html.replace(/<style>.*<\/style>/g, "");

			// External style resources use the link tag, check again for externals.
			if (! options.clear_styles) {
				html = html.replace(/<link.*>/g, function(str){
					if (! str.match(/ rel=['"]?stylesheet/) && ! str.match(/text\/css/)) { return str; }
					else if (str.match(/href=['"]?(https?)/)) { return str; }
					else if (str.match(/href=['"]?\/\//)) { return str; }
					else { return ""; }
				});
			}
		}

		// Inject a script tag pointed at the minified JS.
		function inject_script_shim () {
			if (options.include_js) {
				// Attempt to insert the shim after the closing body tag.
				var script_tag = '<script type="text/javascript" src="' + options.include_js + '"></script>';
				var shims = ["</body>", "</html>", "</head>"];
				inject(script_tag, shims);
			}
		}
		
		// Inject a style tag pointed at the minified CSS.
		function inject_stylesheet_shim () {
			if (options.include_css) {
				// Attempt to insert the shim after the closing body tag.
				var style_tag = '<link rel="stylesheet" type="text/css" href="' + options.include_css + '">';
				var shims = ["</head>", "<body>", "</html>"];
				inject(style_tag, shims);
			}
		}

		// Inject some text before a specified tag
		function inject (tag, shims){
      var added = shims.some(function(shim){
        var i = html.lastIndexOf(shim);
        if (i !== -1) {
          html = html.substr(0, i) + tag + html.substr(i);
          return true;
        }
        return false;
      });
      // Failing that, just append it.
      if (! added) {
        html += tag;
      }
    }

		// Strip excess whitespace (anything more than two newlines) and leftover indentation.
		function strip_whitespace (s) {
			if (options.strip_whitespace) {
				return s.replace(/\s*\n/g,"\n").replace(/(\r?\n){2,}/g,"\n\n");
			}
			return s;
		}
    
    // Write the CSS
		function write_css () {
			if (dest.dest_css) {
				grunt.file.write(dest.dest_css, strip_whitespace(styles.join("\n")));
				grunt.log.writeln('Stylesheet ' + dest.dest_css + '" extracted.');
			}    
		}

    // Write the JS
		function write_js () {
			if (dest.dest_js) {
				grunt.file.write(dest.dest_js, strip_whitespace(scripts.join(";\n")));
				grunt.log.writeln('Script "' + dest.dest_js + '" extracted.');
			}
		}

    // Write the HTML
		function write_html () {
			if (dest.dest_html) {
				grunt.file.write(dest.dest_html, strip_whitespace(html));
				grunt.log.writeln('Document "' + dest.dest_html + '" extracted.');
			}
		}

		var error_status = run_dentist();
		return error_status;
		
  });

};
