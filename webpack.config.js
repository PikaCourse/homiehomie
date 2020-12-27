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
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(scss)$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],

            },
            {
                test: /\.less$/,
                loader: "less-loader", // compiles Less to CSS
                options: {
                           lessOptions: { // If you are using less-loader@5 please spread the lessOptions to options directly
                             modifyVars: {
                               'primary-color': 'rgb(65, 158, 244)',
                               'link-color': 'rgb(65, 158, 244)',
                               'border-radius-base': '2px',
                             javascriptEnabled: true,
                           },
                         },
                    },
            },
        ]
    }
}