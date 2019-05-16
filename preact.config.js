import preactCliTypeScript from 'preact-cli-plugin-typescript'

export default (config, env, helpers) => {
	let { rule } = helpers.getLoadersByName(config, 'babel-loader')[0];
	preactCliTypeScript(config);
	rule.options.plugins.push('babel-plugin-transform-regenerator');
	rule.options.plugins.push(['babel-plugin-transform-runtime', {
		helpers: false,
		polyfill: false,
		regenerator: true
	}]);
};

