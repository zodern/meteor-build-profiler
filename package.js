Package.describe({
  name: 'zodern:build-profiler',
  version: '1.0.0',
  summary: 'Profile the Meteor build process',
  git: 'http://github.com/qualialabs/profile',
  documentation: 'README.md'
});

Package.registerBuildPlugin({
  name: "zodern:build-profiler",
  sources: [
    'profile.js',
    'plugin.js',
  ],
  npmDependencies: {
    'v8-profiler-next': "1.2.0",
  }
});

Package.onUse(function (api) {
});
