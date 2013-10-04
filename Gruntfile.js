module.exports = function(grunt) {
  grunt.option('stack', true);

  var port = process.env.PORT || 8000,
      hostname = 'localhost',
      templates = {},
      paths = {
        'public': 'public',
        output: {
          js: 'public/js',
          css: 'public/css'
        },
        js: 'js',
        css: 'css',
        templates: 'js/templates',
        views: 'js/views',
        models: 'js/models',
        collections: 'js/collections'
      };

  // Register required tasks
  grunt.loadTasks('tasks');
  grunt.loadNpmTasks('thorax-inspector');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  require('matchdep').filterDev('grunt-*').forEach(function(task) {
    if (task !== 'grunt-cli') {
      grunt.loadNpmTasks(task);
    }
  });

  // ******from http://gruntjs.com/configuring-tasks:******
  // All most people need to know is that foo/*.js 
  // will match all files ending with .js in the foo/ subdirectory, 
  // but foo/**/*.js will match all files 
  // ending with .js in the foo/ subdirectory and all of its subdirectories.
  // ******from http://gruntjs.com/configuring-tasks:******



  grunt.config.init({
    pkg: grunt.file.readJSON('package.json'),
    paths: paths,
    clean: {
      output: [           //DELETE EVERYTHING IN THE 
        paths.output.js,  //public/js folder
        paths.output.css  //and the public/css folder
      ]
    },
    copy: {
      html: {
        files: [
        {
          src: 'index.html',
          dest: 'public/index.html'
        }
        ]
      },
      requirejs: {
        files: [
          {
            src: 'bower_components/requirejs/require.js',
            dest: 'public/js/require.js'
          }
        ]
      },
      styles: {
        files: [
          {
            expand: true,
            cwd: paths.css,
            src: '**/*.css',
            dest: paths.output.css
          }
        ]
      }
    },
    less: {
      development: {
        files: [
          {src: ['css/polis_main.less'], dest: 'public/css/lib/polis_main.css'}
        ]
      },
      production: {
        options: {
          yuicompress: true,
          report: 'gzip'
        },
        files: [
          {src: ['css/polis_main.less'], dest: 'public/css/lib/polis_main.css'}
        ]
      }
    },
    connect: {
      development: {
        options: {
          hostname: hostname,
          base: paths.public,
          port: port
        }
      },
      production:  {
        options: {
          hostname: hostname,
          base: paths.public,
          port: port,
          keepalive: true
        }
      }
    },
    thorax: {
      inspector: {
        editor: 'subl',
        background: true,
        paths: {
          views: paths.views,
          models: paths.models,
          collections: paths.collections,
          templates: paths.templates
        }
      }
    },
    requirejs: {
      development: getRequireJSOptions('development'),
      production: getRequireJSOptions('production')
    },
    handlebars: {
      templates: {
        options: {
          namespace: false,
          amd: true
        }
      }
    },
    watch: {
      handlebars: {
        files: [paths.templates + '/**/*.hbs'],
        tasks: ['templates']
      },
      scripts: {
        files: [
          paths.js + '/**/*.js'
        ],
        tasks: ['scripts:development']
      },
      styles: {
        files: [paths.css + '/**/*'],
        tasks: ['copy:styles']
      }
    }
  });

  // for an explanation of the getRequireJSOptions function, see: 
  // https://github.com/jrburke/r.js/blob/master/build/example.build.js

  function getRequireJSOptions(env) {
    var options = {
      appDir: paths.js,
      baseUrl: './',
      dir: paths.output.js,
      modules: [
        {
          name: 'main'
        }
      ],
      paths: {
        'jquery': '../bower_components/jquery/jquery',
        'underscore': '../bower_components/underscore/underscore',
        'originalhandlebars': '../bower_components/handlebars/handlebars.runtime', //original handlebars
        'handlebars': 'templates/helpers/handlebarsWithHelpers', //this one has polis custom template helpers
        'originalbackbone': '../bower_components/backbone/backbone', // backbone before modifications
        'backbone': 'net/backbonePolis', // polis-specific backbone modifications
        'thorax': '../bower_components/thorax/thorax',
        'bootstrap_alert': '../bower_components/bootstrap/js/bootstrap-alert',
        'bootstrap_tab': '../bower_components/bootstrap/js/bootstrap-tab',
        'bootstrap_tooltip': '../bower_components/bootstrap/js/bootstrap-tooltip',
        'bootstrap_button': '../bower_components/bootstrap/js/bootstrap-button',
        'bootstrap_transition': '../bower_components/bootstrap/js/bootstrap-transition',
        // 'flatuicheckbox': '../bower_components/flatui/js/flatui-checkbox',
        // 'flatuiapplication': '../bower_components/flatui/js/application',
        // 'bootstrap_select': '../bower_components/flatui/js/bootstrap-select',
        // 'bootstrap_switch': '../bower_components/flatui/js/bootstrap-switch',
        // 'placeholder': '../bower_components/flatui/js/jquery.placeholder',
        // 'html5shiv': '../bower_components/flatui/js/html5shiv',
        // 'jqueryui': '../bower_components/flatui/js/jquery-ui-1.10.3.custom.min',
        // 'tagsinput': '../bower_components/flatui/js/jquery.tagsinput',
        // 'touchpunch': '../bower_components/flatui/js/jquery.ui.touch-punch.min',
        'd3': '../bower_components/d3/d3',
        'lawnchair': '../bower_components/lawnchair/src/Lawnchair',
        'app': 'lib/App',
        'CommentShower': 'lib/CommentShower',
        'CommentSubmitter': 'lib/CommentSubmitter',
        'FeedbackSubmitter': 'lib/FeedbackSubmitter',
        'keyboard': 'lib/keyboard',
        'konfirm': 'lib/konfirm',
        'LoginView': 'lib/LoginView',
        'p': 'lib/p',
        'polis': 'lib/polis',
        'polisUtils': 'lib/polisUtils',
        'VisView': 'lib/VisView'
      },
      shim: {
        'originalhandlebars': {
          exports: 'Handlebars'
        },
        'originalbackbone': {
          exports: 'Backbone',
          deps: ['jquery', 'underscore']
        },
        'underscore': {
          exports: '_'
        },
        'thorax': {
          exports: 'Thorax',
          deps: ['handlebars', 'backbone']
        },
        'bootstrap_alert': {  //all bootstrap files need to be added to the dependency array of js/main.js
          deps: ['jquery']
        },
        'bootstrap_tab': { 
          deps: ['jquery']
        },
        'bootstrap_tooltip': { 
          deps: ['jquery']
        },
        'bootstrap_button': { 
          deps: ['jquery']
        },
        'bootstrap_transition': { 
          deps: ['jquery']
        },         
        // 'flatuicheckbox': {
        //   deps: ['jquery', 'jqueryui']
        // },
        // 'flatuiapplication': {
        //   deps: ['jquery', 'jqueryui']
        // },
        // 'bootstrap_select': {
        //   deps: ['jquery', 'jqueryui']
        // },
        // 'placeholder': {
        //   deps: ['jquery']
        // },
        // 'bootstrap_switch': {
        //   deps: ['jquery', 'jqueryui']
        // },
        // 'html5shiv': {
        //   deps: ['jquery', 'jqueryui']
        // },
        // 'jqueryui': {
        //   deps: ['jquery']
        // },
        // 'tagsinput': {
        //   deps: ['jquery', 'jqueryui']
        // },
        // 'touchpunch': {
        //   deps: ['jquery', 'jqueryui']
        // },
        'VisView': {
          deps: ['d3']
        }
      }
    };
    if (env === 'production') {
      /*
      TODO
      options.keepBuildDir = true;
      options.optimize = 'uglify';
      */
    }
    if (env === 'development') {
      options.keepBuildDir = true;
      options.optimize = 'none';
      options.uglify2 = {
        compress: {
          dead_code: true,
          unused: true,
        } 
      }
    }
    return {
      options: options
    };
  }

  grunt.registerTask('open-browser', function () {
    var open = require('open');
    open('http://' + hostname + ':' + port);
  });

  grunt.registerTask('html:development', [
    'copy:html',
  ]);

  grunt.registerTask('html:production', [
    'copy:html',
  ]);

  grunt.registerTask('scripts:development', [
    'copy:requirejs',
    'requirejs:development'
  ]);

  grunt.registerTask('scripts:production', [
    'copy:requirejs',
    'requirejs:production'
  ]);

  grunt.registerTask('update-templates-list', function() {
    // Set up the templates object for Handlebars
    grunt.file.glob.sync(paths.templates + '/**/*.{handlebars,hbs}').forEach(function (file) {
      var target = paths.output.js + '/templates' + file.substr(paths.templates.length).replace(/\.(?:handlebars|hbs)$/, '.js');
      templates[target] = file;
    });
    grunt.config.set('handlebars.templates.files', templates);
  });

  grunt.registerTask('create-output-directories', function() {
    grunt.file.mkdir('public/js');
    grunt.file.mkdir('public/css');
    grunt.file.mkdir('public/css/lib') //for the third part libray css builds
  });

  grunt.registerTask('templates', [
    'update-templates-list',
    'handlebars:templates'
  ]);

  grunt.registerTask('styles', [
    'copy:styles',
    'less:development'
  ]);

  grunt.registerTask('default', [
    'ensure-installed',
    'clean:output',
    'create-output-directories',
    'styles',
    'templates',
    'html:development',
    'scripts:development',
    'thorax:inspector',
    'connect:development',
    'open-browser',
    'watch'
  ]);

  grunt.registerTask('production', [
    'clean:output',
    'create-output-directories',
    'styles',
    'templates',
    'html:production',
    'scripts:production',
    'open-browser',
    'connect:production',
  ]);
};
