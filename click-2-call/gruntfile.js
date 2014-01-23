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
      audiojs: {
        src: [
          'libs/jquery-1.10.js',
          'libs/crocodile-rtc.js',
          'scripts/widget_audio.js',
          'scripts/localisations.js',
          'scripts/ringtone.js',
          'scripts/audio.js',
          'scripts/click2call.js',
        ],
        dest: 'dist/js/<%= pkg.name %>.js'
      },
      videojs: {
        src: [
          'libs/jquery-1.10.js',
          'libs/crocodile-rtc.js',
          'scripts/widget_video.js',
          'scripts/localisations.js',
          'scripts/ringtone.js',
          'scripts/video.js',
          'scripts/click2call.js',
        ],
        dest: 'dist/js/<%= pkg.name %>.js'
      },
      css: {
        src: [
          'css/*.css'
        ],
        dest: 'dist/css/<%= pkg.name %>.css'
      },
      audiocss: {
        src: [
          'css/generic.css',
          'css/ui_keypad.css',
          'css/ui_popout.css',
          'css/ui_widget.css',
          'css/widget_audiocall.css'
        ],
        dest: 'dist/css/<%= pkg.name %>.css'
      },
      videocss: {
        src: [
          'css/generic.css',
          'css/ui_keypad.css',
          'css/ui_popout.css',
          'css/ui_widget.css',
          'css/widget_videocall.css'
        ],
        dest: 'dist/css/<%= pkg.name %>.css'
      },
    },
    uglify: {
      dist: {
        src: '<%= concat.js.dest %>',
        dest: 'dist/js/<%= pkg.name %>.min.js'
      },
      audiodist: {
        src: '<%= concat.audiojs.dest %>',
        dest: 'dist/js/<%= pkg.name %>.min.js'
      },
      videodist: {
        src: '<%= concat.videojs.dest %>',
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
      audio: {
        options: {
          jshintrc: 'scripts/.jshintrc'
        },
        src: ['scripts/click2call.js', 'scripts/audio.js', 'scripts/ringtone.js', 'scripts/localisations.js', 'scripts/widget_audio.js']
      },
      video: {
        options: {
          jshintrc: 'scripts/.jshintrc'
        },
        src: ['scripts/click2call.js', 'scripts/video.js', 'scripts/ringtone.js', 'scripts/localisations.js', 'scripts/widget_video.js']
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
      audio: {
        files: '<%= jshint.audio.src %>',
        tasks: ['jshint:audio']
      },
      video: {
        files: '<%= jshint.video.src %>',
        tasks: ['jshint:video']
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

  // Default Build.
  grunt.registerTask('default', [
    'jshint:gruntfile',
    'jshint:src',
    'clean',
    'concat:js',
    'concat:css',
    'uglify:dist',
    'cssmin',
    'copy',
  ]);
  
  // Build Audio only.
  grunt.registerTask('audio', [
    'jshint:audio',
    'clean',
    'concat:audiojs',
    'concat:audiocss',
    'uglify:audiodist',
    'cssmin',
    'copy',
  ]);
  
  // Build Video only.
  grunt.registerTask('video', [
    'jshint:video',
    'clean',
    'concat:videojs',
    'concat:videocss',
    'uglify:videodist',
    'cssmin',
    'copy',
  ]);

};
