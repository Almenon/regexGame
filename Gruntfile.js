module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('bower.json'),
    bower_concat: {
	  all: {
	    dest: 'js/bower.js'
	  }
	},
	uglify: {
	   bower: {
	    options: {
	      compress: true
	    },
	    files: {
	      'js/bower.min.js': 'js/bower.js'
	    }
	  }
	}
  });

	grunt.loadNpmTasks('grunt-bower-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.registerTask('default', [
	'bower_concat',
	'uglify:bower'
	]);

};