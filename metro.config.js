// Metro settings for the bill PDF code.
// pdf-lib and fontkit load "tslib". On web, Metro can pick tslib's ES module wrapper (tslib/modules/index.js),
// which fails with "Cannot destructure property '__extends' of 'tslib.default'". Every tslib import is pointed
// at the plain CommonJS file instead, whichever way it was asked for.
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
const tslibFile = require.resolve('tslib');
const wrapperPattern = /[\\/]tslib[\\/](modules[\\/]index\.js|tslib\.es6\.js)$/;

const defaultResolve = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'tslib' || moduleName.startsWith('tslib/')) {
    return { type: 'sourceFile', filePath: tslibFile };
  }
  const resolution = defaultResolve
    ? defaultResolve(context, moduleName, platform)
    : context.resolveRequest(context, moduleName, platform);
  if (resolution && resolution.type === 'sourceFile' && wrapperPattern.test(resolution.filePath)) {
    return { type: 'sourceFile', filePath: tslibFile };
  }
  return resolution;
};

console.log('[metro.config] tslib fix is active:', tslibFile);

module.exports = config;
