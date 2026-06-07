const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add polyfill for Node.js core modules
config.resolver.extraNodeModules = {
  punycode: require.resolve('punycode'),
};

module.exports = config;