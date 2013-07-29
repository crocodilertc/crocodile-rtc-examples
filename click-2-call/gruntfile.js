'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    // Task configuration.
    clean: {
      files: ['dist']
    },
    concat: {
      options: {
        stripBanners: true,
        process: true
      },
      js: {
        src: [
          'libs/jquery-1.10.js',
          'libs/crocodile-rtc.js',
          'scripts/*.js'
        ],
        dest: 'dist/js/<%= pkg.name %>.js'
      },
      css: {
        src: [
          'css/*.css'
        ],
        dest: 'dist/css/<%= pkg.name %>.css'
      },
    },
    uglify: {
      dist: {
        src: '<%= concat.js.dest %>',
        dest: 'dist/js/<%= pkg.name %>.min.js'
      },
    },
    cssmin: {
      minify: {
        expand: true,
        cwd: 'dist/css/',
        src: ['*.css', '!*.min.css'],
        dest: 'dist/css/',
        ext: '.min.css'
      },
    },
    jshint: {
      gruntfile: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: 'gruntfile.js'
      },
      src: {
        options: {
          jshintrc: 'scripts/.jshintrc'
        },
        src: ['scripts/*.js']
      },
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      src: {
        files: '<%= jshint.src.src %>',
        tasks: ['jshint:src']
      },
    },
    copy: {
      main: {
        files: [
          {expand: true, src: ['images/*'], dest: 'dist/', filter: 'isFile'},
          {expand: true, src: ['index.html'], dest: 'dist/', filter: 'isFile'}
        ],
      },
    },
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task.
  grunt.registerTask('default', [
    'jshint',
    'clean',
    'concat',
    'uglify',
    'cssmin',
    'copy',
  ]);

};
