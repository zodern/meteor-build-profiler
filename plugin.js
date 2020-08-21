var fs = Npm.require('fs');
var path = Npm.require('path');
var meteorLocalPath = path.resolve(process.cwd(), '.meteor/local');
var profilesPath = path.resolve(meteorLocalPath, 'cpu-profiles');

// There are some situations where the package could be loaded outside of a Meteor app,
// such as when running `meteor test-packages`
var inApp = fs.existsSync(meteorLocalPath);

var patchedSymbol = Symbol('build-profile-patch');

if (inApp) {
  try {
    fs.mkdirSync(profilesPath);
  } catch (e) {
    if (e.code !== 'EEXIST') {
      console.log(e);
    }
  }
  
  var mainModule = global.process.mainModule;
  var absPath = mainModule.filename.split(path.sep).slice(0, -1).join(path.sep);

  var require = function (filePath) {
    return mainModule.require(path.resolve(absPath, filePath));
  };

  var AppRunner = require('./runners/run-app.js').AppRunner;
  var v8Profiler = Npm.require('v8-profiler-next');
  var Profiler = getProfiler(v8Profiler, fs);

  if (!AppRunner[patchedSymbol]) {
    AppRunner[patchedSymbol] = true;

    var oldMakePromise = AppRunner.prototype._makePromise;
    AppRunner.prototype._makePromise = function (name) {
      if (name === 'run') {
        Profiler.stopProfile('client-rebuild');
      }
      return oldMakePromise.apply(this, arguments);
    };

    var oldResolvePromise = AppRunner.prototype._resolvePromise;
    AppRunner.prototype._resolvePromise = function (name, value) {
      var outcome = value ? value.outcome : '';

      if (name === 'run' && outcome === 'changed') {
        Profiler.startProfile('full-rebuild', {
          exportPath: path.join(profilesPath, 'full-rebuild.cpuprofile'),
        });
      }
      if (name === 'run' && outcome === 'changed-refreshable') {
        Profiler.startProfile('client-rebuild', {
          exportPath: path.join(profilesPath, 'client-rebuild.cpuprofile'),
        });
      }
      else if (name === 'start') {
        Profiler.stopProfile('initial-build');
        Profiler.stopProfile('full-rebuild');
      }

      return oldResolvePromise.apply(this, arguments);
    };

    Profiler.startProfile('initial-build', {
      exportPath: path.join(profilesPath, 'initial-build.cpuprofile'),
    });
  }
}
