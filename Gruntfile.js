/*
 * grunt-dentist
 * https://github.com/julescarbon/grunt-dentist
 *
 * Copyright (c) 2014 Julie Lala
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    // Configuration to be run (and then tested).
    dentist: {
      single: {
        options: {
          include_js: null,
          include_css: null,
          clean_scripts: false,
          clean_stylesheets: false,
          strip_whitespace: false
        },
        files: {
          src: 'test/fixtures/single.html',
          dest_js: 'tmp/single.js',
          dest_css: 'tmp/single.css',
          dest_html: 'tmp/single.html',
        },
      },
      multiple: {
        options: {
          include_js: null,
          include_css: null,
          clean_scripts: false,
          clean_stylesheets: false,
          strip_whitespace: false
        },
        files: {
          src: 'test/fixtures/multiple.html',
          dest_js: 'tmp/multiple.js',
          dest_css: 'tmp/multiple.css',
          dest_html: 'tmp/multiple.html',
        },
      },
      template: {
        options: {
          include_js: null,
          include_css: null,
          clean_scripts: false,
          clean_stylesheets: false,
          strip_whitespace: false
        },
        files: {
          src: 'test/fixtures/template.html',
          dest_js: 'tmp/template.js',
          dest_html: 'tmp/template.html',
        },
      },
      clean_scripts: {
        options: {
          include_js: "app.min.js",
          include_css: "app.css",
          clear_scripts: true,
          clean_stylesheets: true,
          strip_whitespace: true
        },
        files: {
          src: 'test/fixtures/multiple.html',
          dest_js: 'tmp/clear.js',
          dest_css: 'tmp/clear.css',
          dest_html: 'tmp/clear.html',
        },
      },
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'dentist', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
