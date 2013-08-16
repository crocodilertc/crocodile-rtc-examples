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
			js: {
				src: [
					'src/libs/jquery-1.10.js',
					'src/libs/crocodile-rtc.js',
					'src/localisations.js',
					'src/example.js'
				],
				dest: 'dist/example.js'
			},
			css: {
				src: [
					'src/example.css'
				],
				dest: 'dist/example.css'
			}
		},
		uglify: {
			dist: {
				src: '<%= concat.js.dest %>',
				dest: 'dist/example.js'
			},
		},
		cssmin: {
			minify: {
				expand: true,
				cwd: 'dist/',
				src: ['*.css'],
				dest: 'dist/',
				ext: '.css'
			},
		},
		copy: {
			main: {
				files: [
					{expand: true, cwd: 'src/', src: ['images/*'], dest: 'dist/', filter: 'isFile'},
					{expand: true, cwd: 'src/', src: ['index.html'], dest: 'dist/', filter: 'isFile'}
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

	// Default task.
	grunt.registerTask('default', [
		'clean',
		'concat',
		'uglify',
		'cssmin',
		'copy',
	]);

	grunt.registerTask('build', [
		'clean',
		'concat',
		'copy'
	]);

};
