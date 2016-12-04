// I've switched to gulp due to error when using bower_concat with socket.io-client
//  (bower_concat merges socket gulpfile into bower.js for some reason)
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
	pkg: grunt.file.readJSON('bower.json'),
	bower_concat: {
	  all: {
          dest: 'public/js/bower.js',
          exclude: ['jquery','jquery-ui'] //http://stackoverflow.com/questions/2180391
	  }
	},
	uglify: {
	   bower: {
		options: {
			compress: true,
			sourceMap: true
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
	grunt.registerTask('concat', 'bower_concat');

};