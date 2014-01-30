# grunt-dentist

This plugin will remove inline Javascript and CSS from your HTML and dump them to a new file, to be incorporated into your build process.

It can erase any `script` tags pointed at local assets, and replace the lot with single `script` tag pointed at a minified file.  Likewise, it can erase any `style` and local `link rel='stylesheet'` tags and replace them with a single `link` tag.

Additionally, it knows to avoid templates and anything else which may be inlined using `script` tags.

## Getting Started
This plugin requires Grunt `~0.4.2`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-dentist --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-dentist');
```

## The "dentist" task

### Overview
In your project's Gruntfile, add a section named `dentist` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  dentist: {
    options: {
      include_js: "/app.min.js",
      include_css: "/app.css",
      clear_scripts: true,
      clear_stylesheets: true,
      clear_comments: true,
      strip_whitespace: true
    },
    dist: {
      src: 'docs/index.html',
      dest_js: 'prod/js/inline.js',
      dest_css: 'prod/css/inline.css',
      dest_html: 'prod/index.html',
    },
  },
});
```

### Options

#### options.include_js
Type: `String`
Default value: `app.min.js`

The dentist will insert a single `script` tag into your HTML, preferably above the closing `</body>` tag.  Point this at your minified Javascript file.  Note that this file is not created by the dentist; it is your job to make sure it exists after further concat/minify tasks.

If set to null, the tag is not included.

#### options.include_css
Type: `String`
Default value: `app.css`

The dentist will insert a single `link` tag into your HTML, preferably above the closing `</head>` tag.  Point this at your minified CSS.  Likewise, the dentist does not necessarily create this file.

If set to null, the tag is not included.

#### options.clear_scripts
Type: `Boolean`
Default value: `true`

The dentist will remove any local Javascript references it finds.  Any `script` tag not pointed at an external file will be excised.

#### options.clear_stylesheets
Type: `Boolean`
Default value: `true`

The dentist will remove any local stylesheet references it finds.  Any `link rel='stylesheet'` tag not pointed at an external file will be excised.

#### options.clear_comments
Type: `Boolean`
Default value: `true`

The dentist will remove any HTML comments it finds.  Legacy IE "conditional" comments will be preserved.

#### options.strip_whitespace
Type: `Boolean`
Default value: `true`

The dentist will elide any extraneous whitespace (_horror vacui_) in the output files.

### Usage

The script takes one `src` HTML file as input, and outputs any inline JS to the file marked `dest_js`, inline CSS to `dest_css`, and the cleaned HTML to `dest_html`.  If any of the destination files are unspecified, they are not processed.  For instance this task extracts inlined scripts only but does not touch HTML or CSS:

```js
grunt.initConfig({
  dentist: {
    extract: {
      files: {
        src: 'docs/index.html',
        dest_js: 'prod/js/app.init.js',
      }
    },
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using the suppiled [Gruntfile](http://gruntjs.com/).

And don't forget to floss!

## Release History
* v0.3.2 - 30 January 2014 - added style tag support, clearing comments
* v0.2.0 - 28 January 2014 - post-publish fixes
* v0.1.0 - 28 January 2014 - first release.


