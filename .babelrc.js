module.exports = {
    presets: ['@babel/preset-env'],
    "plugins": [["@babel/transform-runtime",
        {
            "absoluteRuntime": false,
            "corejs": false,
            "helpers": true,
            "regenerator": true,
            "useESModules": false,
            "version": "7.0.0-beta.0"
        }]
    ]
}