var path = require('path');

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    config: {
      dev: {
        options: {
          variables: {
            buildDir: "build",
          }
        }
      },
      dist: {
        options: {
          variables: {
            buildDir: "dist",
          }
        }
      }
    },

    clean: ["<%= grunt.config.get('buildDir') %>/**/*"],

    copy: {
      main: {
        files: [
          {
            expand: true,
            src: "**",
            dest: "<%= grunt.config.get('buildDir') %>/",
            cwd: "src/public",
            dot: true
          }
        ]
      }
    },

    sass: {
      dev: {
        options: {
          style: "expanded",
          includePaths: [].concat(require('node-bourbon').includePaths).concat(require('node-neat').includePaths),
          noCache: true,
          sourceMap: false
        },
        files: {
          "<%= grunt.config.get('buildDir') %>/css/application.css": "src/stylesheets/application.sass",
          "<%= grunt.config.get('buildDir') %>/css/panel.css": "src/stylesheets/panel.sass",
          "<%= grunt.config.get('buildDir') %>/css/rules.css": "src/stylesheets/rules.sass",
          "<%= grunt.config.get('buildDir') %>/css/popup.css": "src/stylesheets/popup.sass",
          "<%= grunt.config.get('buildDir') %>/css/content_styles.css": "src/stylesheets/content_styles.sass"
        }
      }
    },

    jade: {
      compile: {
        files: [
          {
            expand: true,
            cwd: "src/views",
            src: "**/*.jade",
            dest: "<%= grunt.config.get('buildDir') %>/",
            ext: ".html"
          }
        ]
      }
    },

    uglify: {
      options: {
        mangle: true
      },
      dist: {
        files: {
          "<%= grunt.config.get('buildDir') %>/js/application.js": ["<%= grunt.config.get('buildDir') %>/js/application.js"],
          "<%= grunt.config.get('buildDir') %>/js/background.js": ["<%= grunt.config.get('buildDir') %>/js/background.js"]
        }
      }
    },

    webpack: {
      someName: {
        entry: {
             background: "./src/javascripts/background.js",
                  panel: "./src/javascripts/panel.js",
                  rules: "./src/javascripts/rules.js",
                  popup: "./src/javascripts/popup.js",
                sandbox: "./src/javascripts/sandbox.js",
         content_script: "./src/javascripts/content_script.js",
           document_end: "./src/javascripts/document_end.js",
          document_idle: "./src/javascripts/document_idle.js",
          document_start: "./src/javascripts/document_start.js",
        },
        output: {
          path: path.resolve(__dirname, "./<%= grunt.config.get('buildDir') %>/js"),
          filename: "[name].js",
        },
        resolve: {
          modules: [
            'javascripts/containers',
            'javascripts/components',
            'javascripts/utils',
            'node_modules',
          ],
          extensions: [
            '.js',
            '.jsx',
          ],
        },
        module: {
          loaders: [
            { test: /\.jsx?$/, exclude: /node_modules/, loader: "babel-loader?presets[]=es2015,presets[]=react,presets[]=stage-0" }
          ]
        },
        failOnError: true,
      },
    },

    zip: {
      "using-cwd": {
        cwd: "<%= grunt.config.get('buildDir') %>/",
        src: "<%= grunt.config.get('buildDir') %>/**/*",
        dest: "<%= grunt.config.get('buildDir') %>/export.zip"
      }
    },

    watch: {
      scripts: {
        files: ["src/**"],
        tasks: ["default"],
        options: {
          spawn: false,
          livereload: true
        }
      }
    }
  });

  grunt.registerTask("reloadChrome", "reload extension", function() {
    var exec = require("child_process").exec;
    var done = this.async();
    return exec("chrome-cli list links", function(error, stdout, stderr) {
      var tabId, _ref;

      var openExtensionWindows = stdout.match(/(chrome-extension:\/\/flklgoghmajjcajlpecnkgdheicooaae.+)/g);

      if (tabId = (_ref = stdout.match(/\[(\d+:)?([\d]+)\] chrome:\/\/extensions\/?/)) != null ? _ref[2] : void 0) {
        return exec("chrome-cli reload -t " + tabId, function(error, stdout, stderr) {
          for (var urlIndex in openExtensionWindows) {
            return exec('chrome-cli open ' + openExtensionWindows[urlIndex], function() {
              return done();
            });
          }

          return done();
        });
      } else {
        return exec("chrome-cli open chrome://extensions && chrome-cli reload", function(error, stdout, stderr) {
          for (var urlIndex in openExtensionWindows) {
            return exec('chrome-cli open ' + openExtensionWindows[urlIndex], function() {
              return done();
            });
          }
          return done();
        });
      }
    });
  });

  grunt.loadNpmTasks("grunt-sass");
  grunt.loadNpmTasks("grunt-config");
  grunt.loadNpmTasks("grunt-webpack");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-jade");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-notify");
  grunt.loadNpmTasks("grunt-zip");

  grunt.registerTask("main", ["clean", "webpack", "sass", "jade", "copy"]);

  var defaultTasks = ["config:dev", "main"];
  if (grunt.option('reload-extension')) {
    defaultTasks.push("reloadChrome");
  }

  grunt.registerTask("default", defaultTasks.concat(["watch"]));
  grunt.registerTask("dist", ["config:dist", "main", "uglify", "zip"]);
};
