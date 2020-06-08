function getPresetEnvOptions() {
  if (process.env.BUILD_TARGET === 'module') {
    return {
      modules: false,
      targets: { esmodules: true },
    };
  } else {
    return {};
  }
}

module.exports = {
  presets: [
    ['@babel/env', getPresetEnvOptions()],
    '@babel/typescript',
  ],
  sourceMap: true,
};
