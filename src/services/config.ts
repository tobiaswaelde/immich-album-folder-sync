import * as path from 'node:path';
import * as fs from 'node:fs';
import { logger } from '../config/logger';
import { AlbumFolderRelation } from '../types/config';

/**
 * ConfigService is a service that loads and manages the configuration for the application.
 */
export class ConfigService {
	/** The config file path */
	private configFilePath: string;

	private _albumFolderRelations: Set<AlbumFolderRelation> = new Set();

	/** The album-folder relations */
	public get albumFolderRelations(): Set<AlbumFolderRelation> {
		return this._albumFolderRelations;
	}

	/**
	 * Create an instance of the ConfigService.
	 *
	 * It initializes the config file path and loads the configuration.
	 */
	constructor() {
		this.configFilePath = path.resolve(process.cwd(), 'config', 'folders.json');
		this.loadConfig();
	}

	/**
	 * Load configuration from the config file.
	 */
	private loadConfig() {
		// create file if it doesn't exist
		if (!fs.existsSync(this.configFilePath)) {
			logger
				.scope('CONFIG')
				.warn(`Config file not found at ${this.configFilePath}. Creating a new one.`);
			fs.mkdirSync(path.dirname(this.configFilePath), { recursive: true });
			fs.writeFileSync(this.configFilePath, JSON.stringify({}));
			logger.scope('CONFIG').info(`Config file created at ${this.configFilePath}.`);
		}

		// load file
		const json = fs.readFileSync(this.configFilePath, 'utf-8');
		const entries = JSON.parse(json) as AlbumFolderRelation[];
		this._albumFolderRelations = new Set<AlbumFolderRelation>();
		for (const entry of entries) {
			this._albumFolderRelations.add(entry);
		}

		logger
			.scope('CONFIG')
			.info(
				`Loaded ${this._albumFolderRelations.size} album-folder relations from ${this.configFilePath}.`
			);
	}
}
