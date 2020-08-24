# Meteor CPU Profiler

This package makes it easy to create [CPU profiles](https://github.com/node-inspector/v8-profiler) of Meteor's build process.

![example flamechart](https://user-images.githubusercontent.com/247408/60747657-a0bae300-9f3b-11e9-8dc3-b615a2611aca.png)

Compatible with Meteor 1.4 and newer. This package is based on [qualia:profile](https://github.com/qualialabs/profile).

## Installation

```sh
meteor add zodern:build-profiler
```

## Usage

This package records CPU profiles when building an app, and stores them in the app's `.meteor` folder at `.meteor/local/cpu-profiles`.

Three different kinds of profiles will be saved to that folder.

1. `initial-build.cpuprofile` profiles the build process the very first time it is run.
2. `full-rebuild.cpuprofile` profiles the build process when at least one server-side file has changed.
3. `client-rebuild.cpuprofile` profiles the build process when only client-side files have changed. Meteor skips building the server in this situation.

## Reading Profiles

In Chrome:

1. Go to `chrome://inspect` and open the `dedicated DevTools for Node`
2. Switch to the profiler tab and click Load
3. Open a cpu profile stored in at `<app's path>/.meteor/local/cpu-profiles`

For guidance on how to interpret these profiles, [this tutorial](https://developers.google.com/web/tools/chrome-devtools/rendering-tools/js-execution) is a good first step.
