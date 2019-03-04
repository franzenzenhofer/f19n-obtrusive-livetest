var sass = require('node-sass');
var path = require('path');
var webpack = require('webpack');

const webpackConfig = ({ mode, buildDir }) => {
  return {
    mode,
    devtool: false,
    entry: {
          background: "./src/javascripts/background.js",
              panel: "./src/javascripts/panel.js",
              rules: "./src/javascripts/rules.js",
              popup: "./src/javascripts/popup.js",
            sandbox: "./src/javascripts/sandbox.js",
          codeview: "./src/javascripts/codeview.js",
      content_script: "./src/javascripts/content_script.js",
        document_end: "./src/javascripts/document_end.js",
      document_idle: "./src/javascripts/document_idle.js",
      document_start: "./src/javascripts/document_start.js",
    },
    output: {
      path: path.resolve(__dirname, `./${buildDir}/js`),
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
      rules: [
        { test: /\.jsx?$/, exclude: /node_modules/, loader: "babel-loader?presets[]=es2015,presets[]=react,presets[]=stage-0" }
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': { NODE_ENV: JSON.stringify(mode || 'development') },
      }),
    ],
    failOnError: true,
  };
};

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    config: {
      dev: {
        options: {
          variables: {
            webpackMode: "development",
            buildDir: "build",
          }
        }
      },
      dist: {
        options: {
          variables: {
            webpackMode: "production",
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
          implementation: sass,
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

    webpack: {
      someName: () => webpackConfig({
        mode: grunt.config.get('webpackMode'),
        buildDir: grunt.config.get('buildDir'),
      }),
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

  grunt.loadNpmTasks("grunt-sass");
  grunt.loadNpmTasks("grunt-config");
  grunt.loadNpmTasks("grunt-webpack");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-notify");
  grunt.loadNpmTasks("grunt-zip");

  grunt.registerTask("main", ["clean", "webpack", "sass", "copy"]);

  var defaultTasks = ["config:dev", "main"];

  grunt.registerTask("default", defaultTasks.concat(["watch"]));
  grunt.registerTask("dist", ["config:dist", "main", "zip"]);
};
