module.exports = function(grunt) {
    "use strict";
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jslint: {
            client: {
                src: ["assets/www/scripts/*.js", "assets/www/scripts/**/*.js"],
                exclude: ["assets/www/scripts/Lib/Vendor/*.js",
                          "assets/www/scripts/Lib/Vendor/**/*.js",
                          "assets/www/scripts/test/*.js",
                          "assets/www/scripts/test/**/*.js"],
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
                src: ['README.md', 'assets/www/scripts/*.js',
                        'assets/www/scripts/Core/', 'assets/www/scripts/Data/',
                        'assets/www/scripts/Lib/*.js',
                        'assets/www/scripts/Lib/Local/',
                        'assets/www/scripts/UI/*.js',
                        'assets/www/scripts/UI/Pages/',
                        'assets/www/scripts/UI/Widgets/',
                        'assets/www/scripts/ViewModel/*.js',
                        'assets/www/scripts/ViewModel/Classes/'],
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
                src: ['assets/www/scripts/test/*.js']
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