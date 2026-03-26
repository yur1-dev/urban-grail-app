module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '@': './src',
            '@screens': './src/screens',
            '@components': './src/components',
            '@store': './src/store',
            '@hooks': './src/hooks',
            '@utils': './src/utils',
            '@types': './src/types',
            '@theme': './src/theme',
            '@navigation': './src/navigation',
            '@api': './src/api',
          },
          extensions: ['.ios.js', '.android.js', '.js', '.jsx', '.ts', '.tsx', '.json'],
        },
      ],
      ['react-native-dotenv'],
    ],
  };
};
