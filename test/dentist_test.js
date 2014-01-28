'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.dentist = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  single: function(test) {
    test.expect(2);

    var actual_html = grunt.file.read('tmp/single.html');
    var expected_html = grunt.file.read('test/expected/single.html');
    test.equal(actual_html, expected_html, 'should output some html.');

    var actual_js = grunt.file.read('tmp/single.js');
    var expected_js = grunt.file.read('test/expected/single.js');
    test.equal(actual_js, expected_js, 'should output some javascript.');

    test.done();
  },
  multiple: function(test) {
    test.expect(2);

    var actual_html = grunt.file.read('tmp/multiple.html');
    var expected_html = grunt.file.read('test/expected/multiple.html');
    test.equal(actual_html, expected_html, 'should output some html sans script tags.');

    var actual_js = grunt.file.read('tmp/multiple.js');
    var expected_js = grunt.file.read('test/expected/multiple.js');
    test.equal(actual_js, expected_js, 'should output javascript catted together.');

    test.done();
  },
  template: function(test) {
    test.expect(2);

    var actual_html = grunt.file.read('tmp/template.html');
    var expected_html = grunt.file.read('test/fixtures/template.html');
    test.equal(actual_html, expected_html, 'should leave non-javascript script tags in html.');

    var actual_js = grunt.file.read('tmp/template.js');
    var expected_js = grunt.file.read('test/expected/empty');
    test.equal(actual_js, expected_js, 'should output no javascript.');

    test.done();
  },

  clear_scripts: function(test) {
    test.expect(4);

    var actual_html = grunt.file.read('tmp/clear.html');
    var expected_html = grunt.file.read('test/expected/clear.html');
    test.equal(actual_html, expected_html, 'should output html.');

    var actual_js = grunt.file.read('tmp/clear.js');
    var expected_js = grunt.file.read('test/expected/clear.js');
    test.equal(actual_js, expected_js, 'should output javascript.');

    test.notEqual(actual_html.indexOf("text/html"), -1, 'should preserve non-script templates.');
    test.notEqual(actual_html.indexOf("app.min.js"), -1, 'should add a single script tag.');

    test.done();
  },
};
