'use strict';

/*global module:false*/
module.exports = function(grunt) {
  var timestamp = grunt.template.today('yymmddHHMMss');
  
  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> v<%= pkg.version %> \n'+
     ' * Copyright <%= pkg.author %> Build: <%= grunt.template.today("yyyy-mm-dd") %>\n'+
     ' */\n',
    timestamp : timestamp,
    cdn : '',
    
    // Task configuration.
    clean: ['tmp/', 'dist/'],
    copy: {
      images : {
        files : [
          {expand: true, cwd : 'src/', src: ['images/**'], dest: 'dist/'},
        ]
      }
    },
    concat: {
      styles: {
        src: ['src/styles/reset.css', 'src/styles/style.css'],
        dest: 'tmp/<%= pkg.name %>.css'
      },
      scripts: {
        src: ['src/scripts/share-wx.js', 'src/scripts/ajax.js', 'src/scripts/app.js'],
        dest: 'tmp/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner : '<%= banner %>'
      },
      scripts: {
        files:{
          'dist/scripts/<%= pkg.name %>-<%= timestamp %>.min.js' : 'tmp/<%= pkg.name %>.js'
        }
      }
    },
    cssmin: {
      options: {
        banner : '<%= banner %>',
        keepSpecialComments : 0
      },
      styles: {
        files: {
          'dist/styles/<%= pkg.name %>-<%= timestamp %>.min.css' : 'tmp/<%= pkg.name %>.css'
        }
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      src: {
        src : ['src/**/*.js']
      }
    },
    processhtml: {
      production: {
        options: {
          process : true,
          data : {
            'script' : '<%= cdn %>/scripts/<%= pkg.name %>-<%= timestamp %>.min.js',
            'style' : '<%= cdn %>/styles/<%= pkg.name %>-<%= timestamp %>.min.css'
          }
        },
        files: {
          'dist/index.html' : 'src/index.html'
        }
      },
      development: {
        options: {
          process : true,
          data : {
            'script' : 'scripts/<%= pkg.name %>-<%= timestamp %>.min.js',
            'style' : 'styles/<%= pkg.name %>-<%= timestamp %>.min.css'
          }
        },
        files: {
          'dist/index.html' : 'src/index.html'
        }
      }
    },
    watch: {
      livereload: {
        options: {livereload: true},
        files: ['src/**/*.js', 'src/index.html', 'src/**/*.less'],
        tasks: ['less:development', 'jshint']
      }
    },
    connect: {
      server:{
        options : {
          hostname : '*',
          port : 1377,
          debug : true,
          livereload : true,
          base : './src'
        }
      }
    },
    less: {
      development: {
        path : 'src/styles/',
        compress : true,
        files : {
          'src/styles/style.css' : 'src/styles/style.less'
        }
      }
    },
    imagemin: {
      images : {
        files : [
          {
            expand : true,
            cwd : 'src/',
            src: ['images/**/*.{png,jpg,gif}'],
            dest: 'dist/'
          }
        ]
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-processhtml');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-imagemin');

  // Default task.
  grunt.registerTask('default', ['jshint']);
  grunt.registerTask('dev', ['connect', 'watch']);

  grunt.registerTask('build', ['clean', 'less', 'concat', 'uglify', 'cssmin', 'imagemin', 'processhtml:development']);
  grunt.registerTask('build-pro', ['clean', 'less', 'concat', 'uglify', 'cssmin', 'imagemin', 'processhtml:production']);

};