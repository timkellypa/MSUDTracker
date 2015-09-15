module.exports = function(grunt) {
    "use strict";
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jslint: {
            client: {
                src: ["www/scripts/*.js", "www/scripts/**/*.js"],
                exclude: [
                    "www/scripts/Lib/Vendor/*.js",
                    "www/scripts/Lib/Vendor/**/*.js",
                    "www/scripts/test/*.js",
                    "www/scripts/test/**/*.js"
                ],
                directives: {
                    predef: ["require", "module", "define"],
                    nomen: true,
                    white: true,
                    plusplus: true
                }
            }
        },

        jsdoc: {
            dist: {
                src: [
                    'README.md', 'www/scripts/*.js',
                    'www/scripts/Core/', 'www/scripts/Data/',
                    'www/scripts/Lib/*.js',
                    'www/scripts/Lib/Local/',
                    'www/scripts/UI/*.js',
                    'www/scripts/UI/Pages/',
                    'www/scripts/UI/Widgets/',
                    'www/scripts/ViewModel/*.js',
                    'www/scripts/ViewModel/Classes/'
                ],
                options: {
                    recurse: true,
                    destination: 'doc'
                }
            }
        },

        karma: {
            unit: {
                configFile: 'karma.conf.js',
                port: 9999,
                singleRun: true,
                browsers: ['PhantomJS'],
                logLevel: 'ERROR'
            }
        }
    });
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-jslint');

    grunt.registerTask('default', ['jslint', 'jsdoc', 'karma']);
    grunt.registerTask('testonly', ['karma']);
    grunt.registerTask('docOnly', ['jsdoc']);
};