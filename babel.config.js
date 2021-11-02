module.exports = {
  presets: [['module:metro-react-native-babel-preset'],
  ['@babel/preset-env', {targets: {node: 'current'}}],
  ["@babel/plugin-proposal-private-property-in-object", { "loose": true }],
  '@babel/preset-typescript',
  ]
};