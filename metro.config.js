const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// RN / browser 버전을 우선 사용하게
config.resolver.resolverMainFields = ["react-native", "browser", "main"];

// package exports 때문에 node 버전 잡는 문제 방지
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
