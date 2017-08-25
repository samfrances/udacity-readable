const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const PATHS = {
    src: path.join(__dirname, 'src', 'index.tsx'),
    build: path.join(__dirname, 'dist'),
};

const commonConfig = {
    entry: PATHS.src,
    output: {
        filename: "bundle.js",
        path: PATHS.build,
        //libraryTarget: "commonjs",
    },

    devtool: "source-map",

    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"]
    },

    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            { test: /\.tsx?$/, loader: "ts-loader" },

            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },

            // Tslint
            {
                test: /\.tsx?$/,
                enforce: 'pre',
                loader: 'tslint-loader',
                options: {
                    emitWarning: true,
                }
            },

            // CSS
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                }),
            },

            // Images
            {
              test: /\.(jpg|png|svg)$/,
              loader: 'file-loader',
              options: {
                name: './images/[name].[hash].[ext]',
              },
            },

        ]
    },

    plugins: [
        new ExtractTextPlugin({filename: "styles.css"}),
    ]
};

const productionConfig = () => commonConfig;

const developmentConfig = () => {

    const config = {
        devServer: {
            historyApiFallback: true,
            host: process.env.HOST,
            port: process.env.PORT,
        }
    };

    return Object.assign(
        {},
        commonConfig,
        config
    );

};

module.exports = (env) => {
    console.log("env", env);

    if (env === "production") {
        return productionConfig();
    }

    return developmentConfig();
};
