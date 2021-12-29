module.exports = (api) => {
  api.cache.never();

  const presets = [
    [
      '@babel/preset-env',
      {
        targets: { node: '12' },
      },
    ],
  ];

  return { presets };
};
