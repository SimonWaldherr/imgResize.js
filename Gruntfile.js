module.exports = function(grunt) {
  gzip = require("gzip-js");
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    compare_size: {
      files: [ "imgresize.js", "imgresize.build.js" ],
      options: {
        compress: {
          gz: function( contents ) {
            return gzip.zip( contents, {} ).length;
          }
        },
        cache: ".sizecache.json"
      }
    },
    uglify: {
      options: {
        banner: '/*\n' +
                ' * imgResize.js\n' +
                ' *\n' +
                ' * Copyright 2013, Simon Waldherr - http://simon.waldherr.eu/\n' +
                ' * Released under the MIT Licence\n' +
                ' * http://opensource.org/licenses/MIT\n' +
                ' *\n' +
                ' * Github:  https://github.com/SimonWaldherr/imgResize.js\n' +
                ' * Version: 0.1.2\n' +
                ' */\n' +
                ' \n' +
                '/*jslint browser: true, plusplus: true, bitwise: true, indent: 2*/\n' +
                '/*global Image,ArrayBuffer,Uint8ClampedArray,Uint32Array*/\n' +
                '/*exported imgSmartResize*/\n'
      },
      dist: {
        files: {
          './imgresize.build.js': ['./imgresize.js']
        }
      }
    },
    compress: {
      main: {
        options: {
          mode: 'gzip'
        },
        files: [
          {expand: true, src: 'imgresize.build.js', dest: '/', ext: '.gz.js'}
        ]
      }
    }
  });
  grunt.loadNpmTasks("grunt-compare-size");
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.registerTask('default', ['uglify', 'compare_size']);
};
