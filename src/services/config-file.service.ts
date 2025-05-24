import * as path from 'node:path';
import * as fs from 'node:fs';
import { Config } from '../types/config/config.dto';
import { z, ZodError } from 'zod';
import { Logger } from '@nestjs/common';

const DEFAULT_CONFIG: Config = [];

export class ConfigFileService {
  private static logger = new Logger(ConfigFileService.name);

  /**
   * The path to the config files folder.
   */
  public static get configDir(): string {
    return path.resolve(process.cwd(), 'config');
  }
  /**
   * The path to the config file.
   */
  public static get filePath(): string {
    return path.resolve(ConfigFileService.configDir, 'folders.json');
  }

  /**
   * Creates the config files folder if it doesn't exist.
   */
  private static async createConfigFolder() {
    if (!fs.existsSync(ConfigFileService.configDir)) {
      await fs.promises.mkdir(ConfigFileService.configDir, { recursive: true });
      ConfigFileService.logger.log(`Config folder created at '${ConfigFileService.configDir}'`);
    }
  }

  /**
   * Load the config file from the file system.
   * @returns {ConfigDto} The loaded config.
   */
  public static async load(): Promise<Config> {
    // create config file if it does not exist yet
    if (!fs.existsSync(this.filePath)) {
      this.save(DEFAULT_CONFIG);
      ConfigFileService.logger.log(`Empty config file created at '${this.filePath}'`);
    }

    try {
      const file = await fs.readFileSync(this.filePath, 'utf-8');
      const json = JSON.parse(file);
      ConfigFileService.logger.log(`Config file loaded from '${this.filePath}'`);

      const config = Config.parse(json);
      return config;
    } catch (err) {
      if (err instanceof ZodError) {
        ConfigFileService.logger.error('Invalid config file format.');
        ConfigFileService.logger.error(err.issues);
      } else {
        throw err;
      }
    }
  }

  /**
   * Save the config file to the file system
   * @param {ConfigDto} config The config to save
   * @returns {ConfigDto} The saved config
   */
  public static async save(config: Config): Promise<Config> {
    await this.createConfigFolder();

    try {
      const data = Config.parse(config);
      const json = JSON.stringify(data, null);

      fs.writeFileSync(this.filePath, json, 'utf-8');

      return this.load();
    } catch (err) {
      if (err instanceof ZodError) {
        ConfigFileService.logger.error('Invalid config file format.');
        ConfigFileService.logger.error(err.issues);
      }
    }
  }
}
