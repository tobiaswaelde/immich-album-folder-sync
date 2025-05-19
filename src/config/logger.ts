import { Signale, SignaleOptions } from 'signale';
import { ENV } from './env';

export const logger = new Signale({
	logLevel: ENV.LOG_LEVEL,
	disabled: false,
	interactive: false,
	config: {
		displayDate: false,
		displayTimestamp: true,
		displayFilename: false,
		displayLabel: true,
		displayBadge: true,
		displayScope: true,
		uppercaseLabel: true,
	},
});
