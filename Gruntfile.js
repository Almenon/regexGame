module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jade: {
      options: {
        pretty: true,
        files: {
          "*": ["**/*.jade", "!layouts/*.jade"]
        }
      },
      debug: {
        options: {
          locals: {
            livereload: true
          }
        }
      },
      publish: {
        options: {
          locals: {
            livereload: false
          }
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-jade-tasks');

  grunt.registerTask('default', 'jade:debug');
  grunt.registerTask('publish', ['jade:publish']);

};