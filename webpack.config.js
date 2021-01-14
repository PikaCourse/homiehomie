const path = require("path");

module.exports = {
  devtool: "eval-source-map",
  module: {
    rules: [
      {
        test: /\.js$|tsx/,
        exclude: /node_modules/,
        use: ["babel-loader", "source-map-loader"],
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(scss)$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader", // translates CSS into CommonJS
          },
          {
            loader: "less-loader", // compiles Less to CSS
            options: {
              lessOptions: {
                // If you are using less-loader@5 please spread the lessOptions to options directly
                modifyVars: {
                  hack: `true; @import "${path.resolve(
                    __dirname,
                    "./frontend/src/",
                    "main.less"
                  )}";`,
                },
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
    ],
  },
};
