const sass = require('node-sass');
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const jsonFormat = require('json-format');

const webpackConfig = ({ mode, buildDir }) => {
  return {
    mode,
    devtool: false,
    entry: {
      background: './src/javascripts/background.js',
      panel: './src/javascripts/panel.js',
      rules: './src/javascripts/rules.js',
      popup: './src/javascripts/popup.js',
      sandbox: './src/javascripts/sandbox.js',
      codeview: './src/javascripts/codeview.js',
      content_script: './src/javascripts/content_script.js',
      document_end: './src/javascripts/document_end.js',
      document_idle: './src/javascripts/document_idle.js',
      document_start: './src/javascripts/document_start.js',
    },
    output: {
      path: path.resolve(__dirname, `./${buildDir}/js`),
      filename: '[name].js',
    },
    resolve: {
      modules: [
        'javascripts/containers',
        'javascripts/components',
        'javascripts/utils',
        'node_modules',
      ],
      extensions: ['.js', '.jsx'],
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'babel-loader?presets[]=es2015,presets[]=react,presets[]=stage-0',
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': { NODE_ENV: JSON.stringify(mode || 'development') },
      }),
    ],
    failOnError: true,
  };
};

module.exports = (grunt) => {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    config: {
      dev: {
        options: {
          variables: {
            mode: 'development',
            buildDir: 'build',
            googleAppClientId: '335346275770-p8vif5hh6sj238tq5bh1rmble8r1e9pt.apps.googleusercontent.com',
          },
        },
      },
      dist: {
        options: {
          variables: {
            mode: 'production',
            buildDir: 'dist',
            googleAppClientId: '335346275770-6d6s9ja0h7brn24ghf3vqa9kv7ko5vfv.apps.googleusercontent.com',
          },
        },
      },
    },

    clean: ["<%= grunt.config.get('buildDir') %>/**/*"],

    copy: {
      main: {
        files: [
          {
            expand: true,
            src: '**',
            dest: "<%= grunt.config.get('buildDir') %>/",
            cwd: 'src/public',
            dot: true,
          },
        ],
      },
    },

    sass: {
      dev: {
        options: {
          implementation: sass,
          style: 'expanded',
          includePaths: []
            .concat(require('node-bourbon').includePaths)
            .concat(require('node-neat').includePaths),
          noCache: true,
          sourceMap: false,
        },
        files: {
          "<%= grunt.config.get('buildDir') %>/css/application.css":
            'src/stylesheets/application.sass',
          "<%= grunt.config.get('buildDir') %>/css/panel.css":
            'src/stylesheets/panel.sass',
          "<%= grunt.config.get('buildDir') %>/css/rules.css":
            'src/stylesheets/rules.sass',
          "<%= grunt.config.get('buildDir') %>/css/popup.css":
            'src/stylesheets/popup.sass',
          "<%= grunt.config.get('buildDir') %>/css/content_styles.css":
            'src/stylesheets/content_styles.sass'
        },
      },
    },

    webpack: {
      someName: () =>
        webpackConfig({
          mode: grunt.config.get('mode'),
          buildDir: grunt.config.get('buildDir'),
        }),
    },

    zip: {
      'using-cwd': {
        cwd: "<%= grunt.config.get('buildDir') %>/",
        src: "<%= grunt.config.get('buildDir') %>/**/*",
        dest: "<%= grunt.config.get('buildDir') %>/export.zip",
      },
    },

    watch: {
      scripts: {
        files: ['src/**'],
        tasks: ['default'],
        options: {
          spawn: false,
          livereload: true,
        },
      },
    },
  });

  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-config');
  grunt.loadNpmTasks('grunt-webpack');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-notify');
  grunt.loadNpmTasks('grunt-zip');

  grunt.registerTask('manifest', 'Set manifest keys depending on environment.', function() {
    const done = this.async();
    const buildDir = grunt.config.get('buildDir');
    const manifestFile = path.resolve(__dirname, `./${buildDir}/manifest.json`);

    const manifestContent = fs.readFileSync(manifestFile, 'utf8');
    const manifestJson = JSON.parse(manifestContent);

    // Set google client id for oauth connect
    if (manifestJson.oauth2 && manifestJson.oauth2.client_id) {
      manifestJson.oauth2.client_id = grunt.config.get('googleAppClientId');
    }

    // Remove "key" (public key) which is only set to have consistent extension IDs in development mode
    if (grunt.config.get('mode') !== 'development') {
      delete(manifestJson.key);
    }

    fs.writeFile(manifestFile, jsonFormat(manifestJson, { type: 'space', size: 2 }).normalize(), 'utf8', done);
  });

  grunt.registerTask('main', ['clean', 'webpack', 'sass', 'copy', 'manifest']);

  const defaultTasks = ['config:dev', 'main'];

  grunt.registerTask('default', defaultTasks.concat(['watch']));
  grunt.registerTask('dist', ['config:dist', 'main', 'zip']);
};
