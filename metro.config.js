const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

/**
 * Force Metro to always resolve `expo-crypto` from the root node_modules.
 * This prevents any potential nested versions from being picked up,
 * which causes the "Cannot find native module ExpoCryptoAES" crash.
 * 
 * Note: Root cause handled by npm 'overrides' in package.json.
 */
const rootExpoCrypto = path.resolve(__dirname, 'node_modules/expo-crypto');

config.resolver.extraNodeModules = {
    ...config.resolver.extraNodeModules,
    'expo-crypto': rootExpoCrypto,
};

module.exports = config;
