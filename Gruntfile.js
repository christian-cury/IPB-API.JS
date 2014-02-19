module.exports = function(grunt) {

// Project configuration.
grunt.initConfig({
  pkg: grunt.file.readJSON('./package.json'),
  jsbeautifier : {
    libs: ["./libs/**/*.js"],
    modules: ["./modules/**/*.js"]
  },
  jshint: {
    libs: ["./libs/**/*.js"],
    modules: ["./modules/**/*.js"]
  },
  nodeunit: {
    all: ['test/*_test.js'],
    options: {
      reporter: 'junit',
      reporterOptions: {
        output: 'outputdir'
      }
    }
  }
});

grunt.loadNpmTasks('grunt-jsbeautifier');
grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-contrib-nodeunit');


grunt.registerTask('default', ['jsbeautifier:libs', 'jshint:libs']);
grunt.registerTask('modules-check', ['jsbeautifier:modules', 'jshint:modules']);
grunt.registerTask('unit-tests', ['nodeunit']);
};