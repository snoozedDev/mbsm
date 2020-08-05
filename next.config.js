const path = require("path");

module.exports = {
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  webpack: (config, { isServer, webpack }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.node = {
        fs: "empty",
      };
    }
    config.plugins.push(
      new webpack.ContextReplacementPlugin(
        /knex\/lib\/dialects/,
        /postgres\/index.js/
      )
    );
    config.plugins.push(new webpack.IgnorePlugin(/^pg-native$/));
    return config;
  },
};
