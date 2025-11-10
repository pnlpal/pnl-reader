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

var fileExtensions = ["jpg", "jpeg", "gif", "eot", "otf", "ttf"];

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
    "custom-font": path.join(__dirname, "src", "custom-font", "index.js"),

    // "tts-player-webcomponent": path.join(
    //   __dirname,
    //   "src",
    //   "content",
    //   "ttsPlayer",
    //   "webcomponent.js"
    // ),
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

      // Rule for inline SCSS imports (must come first to catch ?inline query)
      {
        test: /\.scss$/,
        resourceQuery: /inline/,
        use: [
          "raw-loader",
          {
            loader: "sass-loader",
            options: {
              sassOptions: {
                outputStyle: "compressed",
                includePaths: ["node_modules"], // For @picocss imports
              },
            },
          },
        ],
      },

      // Add CSS Modules support for .module.scss files
      {
        test: /\.module\.scss$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: "[name]__[local]___[hash:base64:5]",
                exportLocalsConvention: "camelCase", // This is important!
              },
              esModule: false, // Important for proper export
            },
          },
          "sass-loader",
        ],
      },

      {
        test: /\.scss$/,
        exclude: /\.module\.scss$/, // Exclude module files from this rule
        resourceQuery: { not: [/inline/] }, // Exclude inline queries
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

              // web_accessible_resources in MV2 is an array of strings for Firefox
              json.web_accessible_resources =
                json.web_accessible_resources[0].resources;

              // Firefox Android requires data_collection_permissions and id
              json.browser_specific_settings = {
                gecko: {
                  id: "{8a1b9de7-0601-4ccb-93b8-3f60fa7a5772}",
                  data_collection_permissions: {
                    required: ["authenticationInfo", "websiteActivity"],
                  },
                },
              };
            }

            if (env.NODE_ENV === "development") {
              json.content_scripts[0].matches.push("http://localhost:4567/*");

              if (env.BROWSER === "Firefox") {
                json.web_accessible_resources.push("*.js.map");
              } else {
                json.web_accessible_resources[0].resources.push("*.js.map");
              }
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
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "custom-font", "index.html"),
      filename: "custom-font.html",
      cache: false,
      chunks: ["custom-font"],
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
