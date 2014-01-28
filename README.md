# grunt-dentist

This plugin will remove inline Javascript from your HTML and dump it to a new file, to be incorporated into your build process.  Additionally, it can replace any script tags pointed at local assets, and replace the lot with a single script tag pointed at your minified file.

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
      include: "/app.min.js",
      clear_scripts: true,
      strip_whitespace: true
    },
    dist: {
      src: 'docs/index.html',
      js: 'docs/js/inline.js',
      html: 'prod/index.html',
    },
  },
});
```

### Options

#### options.include
Type: `String`
Default value: `app.min.js`

The dentist will add a single `script` tag, pointed at your minified file, preferably above the closing `</body>` tag.  Note that this file is not created -- that presumably happens after further concat/minify tasks.

If set to null, the tag is not included.

#### options.clear_scripts
Type: `String`
Default value: `true`

The dentist will remove any local Javascript it finds.

#### options.strip_whitespace
Type: `String`
Default value: `true`

The dentist will elide any extraneous whitespace (_horror vacui_).

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
v0.1.0 - 28 January 2014 - first release.


