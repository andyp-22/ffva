const common  = require('./common.release.config.js');

const config = {
  ...common,
  plugins: [
    ...common.plugins,
    [
      "semantic-release-vsce", {
        "packageVsix": false,
        "publishPackagePath": "*.vsix"
      }
    ],
    [
      "@semantic-release/git", {
        "message": "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"
      }
    ],
    [
      "@semantic-release/github", {
        "assets": "*.vsix",
        "addReleases": "bottom"
      }
    ]
  ]
};

module.exports = config;
