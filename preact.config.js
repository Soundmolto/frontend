export default (config, env, helpers) => {
    let { rule } = helpers.getLoadersByName(config, 'babel-loader')[0];
    rule.options.plugins.push('transform-regenerator');
    rule.options.plugins.push(["transform-runtime", {
      "helpers": false,
      "polyfill": false,
      "regenerator": true
    }]);
  };
  