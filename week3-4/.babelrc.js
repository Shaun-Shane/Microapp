module.exports = {
    presets: [
        [
            '@babel/preset-react',
            {
                pragma: 'createElement'
            },
            '@babel/preset-env'
        ]
    ]
}
