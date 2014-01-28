# grunt-dentist

This plugin will remove inline Javascript from your HTML and dump it to a new file, to be incorporated into your build process.

It will erase any `script` tags pointed at local assets, and replace the lot with a single `script` tag pointed at your minified file.

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
      include: "/app.min.js",
      clear_scripts: true,
      strip_whitespace: true
    },
    dist: {
      src: 'docs/index.html',
      js: 'prod/js/inline.js',
      html: 'prod/index.html',
    },
  },
});
```

The script takes one file -- `src` -- as input, and outputs any inline JS to the file marked `js`, and the cleaned HTML to the file marked `html`.

### Options

#### options.include
Type: `String`
Default value: `app.min.js`

The dentist will insert a single `script` tag into your HTML, preferably above the closing `</body>` tag.  Point this at your minified Javascript file.  Note that this file is not created -- that happens presumably after further concat/minify tasks.

If set to null, the tag is not included.

#### options.clear_scripts
Type: `Boolean`
Default value: `true`

The dentist will remove any local Javascript references it finds.  Any `script` tag not pointed at an external file will be excised.

#### options.strip_whitespace
Type: `Boolean`
Default value: `true`

The dentist will elide any extraneous whitespace (_horror vacui_).

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using the suppiled [Gruntfile](http://gruntjs.com/).

And don't forget to floss!

## Release History
v0.1.0 - 28 January 2014 - first release.


