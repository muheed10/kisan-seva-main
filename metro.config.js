const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

/**
 * Force Metro to always resolve `expo-crypto` from the root node_modules.
 * This prevents the nested version inside `expo-auth-session/node_modules/expo-crypto`
 * (v55.x) from being picked up, which causes the "Cannot find native module ExpoCryptoAES" crash.
 *
 * NOTE: We use extraNodeModules here. For complete override at all nesting levels,
 * the app also uses npm overrides in package.json (see overrides field).
 */
const rootExpoCrypto = path.resolve(__dirname, 'node_modules/expo-crypto');

config.resolver.extraNodeModules = {
    ...config.resolver.extraNodeModules,
    'expo-crypto': rootExpoCrypto,
};

module.exports = config;
