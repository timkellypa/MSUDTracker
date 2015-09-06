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

        mochaTest: {
            options: {
                timeout: 3000,
                ignoreLeaks: true
            },
            all: {
                src: ['www/scripts/test/*.js']
            }
        }
    });
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-jslint');

    grunt.registerTask('default', ['jslint', 'jsdoc', 'mochaTest']);
    grunt.registerTask('testonly', ['mochaTest']);
    grunt.registerTask('docOnly', ['jsdoc']);
};