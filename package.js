Package.describe({
  name: 'zodern:build-profiler',
  version: '1.1.0',
  summary: 'Profile the Meteor build process',
  git: 'https://github.com/zodern/meteor-build-profiler.git',
  documentation: 'README.md'
});

Package.registerBuildPlugin({
  name: "zodern:build-profiler",
  sources: [
    'profile.js',
    'plugin.js',
  ],
  npmDependencies: {
    'v8-profiler-next': "1.4.2",
  }
});

Package.onUse(function (api) {
});
