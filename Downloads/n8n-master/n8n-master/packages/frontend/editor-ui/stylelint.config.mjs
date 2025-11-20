import { baseConfig } from '@workflow-automation/stylelint-config/base';

export default {
	...baseConfig,
	rules: {
		...baseConfig.rules,
		'@n8n/css-var-naming': [true, { severity: 'error' }],
	},
};
