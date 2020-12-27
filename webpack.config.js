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
                               'btn-primary-bg': '#419EF4',
                               'link-color': '#419EF4',
                               'border-radius-base': '20px',
                             javascriptEnabled: true,
                           },
                         },
                    },
            },
        ]
    }
}