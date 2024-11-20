const common  = require('./common.release.config.js');

const config = {
  ...common,
  plugins: [
    // Add the common plugins first, so the changelog plugin is called before the npm and git plugins.
    ...common.plugins,
    [
      // The npm plugin must be called after the changelog plugin, and before the git plugin.
      "@semantic-release/npm", {
        npmPublish: false
      }
    ],
    [
      // The git plugin must be called after the changelog and npm plugins (in that order).
      "@semantic-release/git", {
        message: "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"
      }
    ],
    [
      // Publish the extension to the Visual Studio Code marketplace.
      "semantic-release-vsce", {
        packageVsix: false,
        publish: true,
        publishPackagePath: "*.vsix"
      }
    ],
    [
      // Publish the new release in GitHub, and attach the vsix file as a release asset.
      "@semantic-release/github", {
        assets: "*.vsix",
        addReleases: "bottom"
      }
    ]
  ]
};

module.exports = config;
