export default (config, env, helpers) => {
    let { rule } = helpers.getLoadersByName(config, 'babel-loader')[0];
    rule.options.plugins.push('babel-plugin-transform-regenerator');
    rule.options.plugins.push(["babel-plugin-transform-runtime", {
      "helpers": false,
      "polyfill": false,
      "regenerator": true
	}]);
	
	helpers.getPlugins(config).push([
		new helpers.webpack.ProvidePlugin({
		  WaveSurfer: 'wavesurfer.js'
		})
	])
  };
  
