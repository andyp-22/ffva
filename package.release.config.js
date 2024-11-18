const common = require('./common.release.config.js');

const config = {
  ...common,
  plugins: [
    ...common.plugins,
    [
      "semantic-release-vsce", {
        "packageVsix": true,
        "publish": false, // Using semantic-release-stop-before-publish
      }
    ],
    "semantic-release-stop-before-publish"
  ]
};

module.exports = config;
