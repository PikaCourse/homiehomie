module.exports = {
    module:{
        rules:[
            {
                test: /\.js$|tsx/,
                exclude:/node_modules/,
                use:{
                    loader:"babel-loader"
                }
            },
            {
                test: /\.css$/i,
                use: ["css-loader"],
            },
            {
                test: /\.(scss)$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],

              },
        ]
    }
}