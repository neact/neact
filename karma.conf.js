// Karma configuration
// Generated on Mon Sep 12 2016 19:21:06 GMT+0800 (中国标准时间)

module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: ['mocha', 'chai-sinon'],
        files: [
            'test/**/*.js'
        ],
        exclude: [],
        preprocessors: {
            'test/**/*.js': ['webpack']
        },
        reporters: ['progress', 'coverage', 'mocha'],
        coverageReporter: {
            type: 'html',
            dir: 'coverage/'
        },
        mochaReporter: {
			showDiff: true
		},
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        _tt : "PhantomJS",
        browsers: ['PhantomJS'],
        singleRun: false,
        concurrency: Infinity,
        webpack: {
            module: {
                loaders: [{
                    test: /\.js$/,
                    loader: 'babel',
                    exclude: /node_modules/,
                    query: {
                        presets: [['es2015', { loose :true }], 'react'],
                        plugins: ['istanbul', "transform-object-rest-spread"]
                    }
                }]
            }
        }
    })
}