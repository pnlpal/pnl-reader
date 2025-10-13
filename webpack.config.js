var webpack = require("webpack"),
  path = require("path"),
  fileSystem = require("fs"),
  env = require("./utils/env"),
  { CleanWebpackPlugin } = require("clean-webpack-plugin"),
  CopyWebpackPlugin = require("copy-webpack-plugin"),
  HtmlWebpackPlugin = require("html-webpack-plugin"),
  TerserPlugin = require("terser-webpack-plugin");

// load the secrets
var alias = {};

var secretsPath = path.join(__dirname, "secrets." + env.NODE_ENV + ".js");

var fileExtensions = ["jpg", "jpeg", "gif", "eot", "otf", "svg", "ttf"];

if (fileSystem.existsSync(secretsPath)) {
  alias["secrets"] = secretsPath;
}
alias.utils = path.join(__dirname, "src/utils.js");

var options = {
  mode: process.env.NODE_ENV || "development",
  entry: {
    // popup: path.join(__dirname, "src", "js", "popup.js"),
    inject: path.join(__dirname, "src", "content", "inject.js"),
    "inject-pdf-reader": path.join(
      __dirname,
      "src",
      "content",
      "inject-pdf-reader.js"
    ),
    background: path.join(__dirname, "src", "background", "main.js"),
    "pdf-viewer": path.join(__dirname, "src", "content", "pdf-viewer.js"),
  },
  output: {
    path: path.join(__dirname, "build"),
    filename: "[name].bundle.js",
    clean: true,
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },

      {
        test: /\.scss$/,
        use: [
          {
            loader: "css-loader",
            options: {
              esModule: false, // Disable ES modules to allow CommonJS-style imports
              exportType: "string", // Export CSS as a string
            },
          },
          "sass-loader", // Compiles SCSS to CSS
        ],
      },

      {
        test: /\.less$/,
        use: [
          {
            loader: "style-loader", // creates style nodes from JS strings
          },
          {
            loader: "css-loader", // translates CSS into CommonJS
          },
          {
            loader: "less-loader", // compiles Less to CSS
          },
        ],
      },
      {
        test: /\.(png|woff|woff2)$/,
        type: "asset/inline", // Inline the font files as Base64
      },
      {
        test: new RegExp(".(" + fileExtensions.join("|") + ")$"),
        type: "asset/resource",
        exclude: /node_modules/,
      },
      {
        test: /\.html$/,
        loader: "html-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.mjs$/,
        type: "javascript/auto",
      },
    ],
  },
  resolve: {
    alias: alias,
  },
  plugins: [
    // clean the build folder
    new CleanWebpackPlugin({ verbose: false }),
    new webpack.ProgressPlugin(),
    // expose and write the allowed env vars on the compiled bundle
    new webpack.EnvironmentPlugin(["NODE_ENV"]),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "src/manifest.json",
          to: path.join(__dirname, "build"),
          force: true,
          transform: function (content) {
            // generates the manifest file using the package.json informations
            const json = {
              description: process.env.npm_package_description,
              version: process.env.npm_package_version,
              ...JSON.parse(content.toString()),
            };

            if (env.NODE_ENV === "development") {
              json.content_scripts[0].matches.push("http://localhost:4567/*");
            }

            if (env.BROWSER === "Firefox") {
              json.manifest_version = 2; // Firefox has host permission issue with manifest v3
              json.browser_action = json.action;
              delete json.host_permissions;
              delete json.action;
              delete json.minimum_chrome_version;
              json.background = {
                scripts: ["background.bundle.js"],
              };

              // Firefox requires host permission for all urls to inject script when it's not trigger by user activities
              json.permissions.push("<all_urls>");
            }

            return Buffer.from(JSON.stringify(json));
          },
        },
      ],
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "src/images",
          to: path.join(__dirname, "build/images"),
          force: true,
        },
      ],
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "options.html"),
      filename: "options.html",
      cache: false,
      chunks: ["inject"],
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "pdf-viewer.html"),
      filename: "pdf-viewer.html",
      cache: false,
      chunks: ["pdf-viewer"],
    }),
  ],
  infrastructureLogging: {
    level: "info",
  },
};

if (env.NODE_ENV === "development") {
  console.log("Run in dev");
  options.devtool = "cheap-module-source-map";
} else {
  console.log("Run in prod");
  options.optimization = {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  };
}

module.exports = options;
