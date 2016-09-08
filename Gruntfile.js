module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('bower.json'),
    bower_concat: {
	  all: {
	    dest: 'public/js/bower.js'
	  }
	},
	uglify: {
	   bower: {
	    options: {
	      compress: true
	    },
	    files: {
	      'public/js/bower.min.js': 'public/js/bower.js'
	    }
	  }
	}
  });

	grunt.loadNpmTasks('grunt-bower-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.registerTask('default', [
	'bower_concat',
	'uglify:bower'
	]);

};