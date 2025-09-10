import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ENV } from '../../config/env';
import { ConfigFileService } from '../../services/config-file.service';
import { ImmichService } from '../../services/immich-service';
import { SyncResultDto } from '../../types/sync/sync-result.dto';

type AlbumFolderRelation = {
  folder: string;
  albumId: string;
  albumName: string;
};

@Injectable()
export class SyncService {
  public static readonly token = 'SYNC_SERVICE';
  private readonly logger = new Logger(SyncService.name);

  private immichService: ImmichService;
  private isSyncing: boolean = false;

  constructor() {
    this.immichService = new ImmichService();

    if (ENV.SYNC_ON_START) {
      this.syncNow();
    }
  }

  /**
   * Get album folder relations based on the config file.
   * @returns {Set<AlbumFolderRelation>} A set of folder-album relations.
   */
  private async getFolderAlbumRelations(): Promise<Set<AlbumFolderRelation>> {
    // find all folders found by immich
    const folders = await this.immichService.getUniqueOriginalPaths();

    // load config file
    const config = await ConfigFileService.load();

    const res: Set<AlbumFolderRelation> = new Set<AlbumFolderRelation>();
    for (const cfg of config) {
      // check if album exists
      const albumInfo = await this.immichService.getAlbumInfo(cfg.albumId);
      if (!albumInfo) {
        this.logger.warn(`Album '${cfg.albumId}' not found in Immich.`);
        continue;
      }

      if (cfg.recursive) {
        // find subfolders
        const subfolders = [...folders.values()].filter((f) => f.startsWith(cfg.path));
        this.logger.log(`Found ${subfolders.length} folders in '${cfg.path}'`);

        if (subfolders.length === 0) {
          this.logger.warn(`Folder '${cfg.path}' does not exist and has no subfolders.`);
          continue;
        }

        // add all subfolders to the result
        for (const subfolder of subfolders) {
          res.add({ folder: subfolder, albumId: cfg.albumId, albumName: albumInfo.albumName });
        }
      } else {
        // check if folder exists in immich
        if (!folders.has(cfg.path)) {
          this.logger.warn(`Folder '${cfg.path}' does not exist.`);
          continue;
        }

        // add the folder to the result
        res.add({ folder: cfg.path, albumId: cfg.albumId, albumName: albumInfo.albumName });
      }
    }

    return res;
  }

  private async syncAlbumFolderRelation(relation: AlbumFolderRelation) {
    try {
      this.logger.log(`Syncing folder '${relation.folder}' into album '${relation.albumName}'`);

      // load assests from folder
      const assets = await this.immichService.getAssetsByOriginalPath(relation.folder);
      const assetIds = assets.map((asset) => asset.id);
      this.logger.log(`Found ${assets.length} assets in folder '${relation.folder}'`);

      // add assets to album
      await this.immichService.addAssetsToAlbum(relation.albumId, assetIds);
      this.logger.log(`Added ${assets.length} assets to album '${relation.albumName}'`);
    } catch (err) {
      this.logger.error(
        `Failed to sync folder '${relation.folder}' into album '${relation.albumName}'`,
      );
      throw err;
    }
  }

  private async sync(): Promise<SyncResultDto> {
    try {
      this.logger.log('Start syncing...');
      this.isSyncing = true;

      const albumFolderRelations = await this.getFolderAlbumRelations();
      const res = await Promise.allSettled(
        albumFolderRelations.values().map((x) => this.syncAlbumFolderRelation(x)),
      );

      const success = res.filter((x) => x.status === 'fulfilled');
      const failed = res.filter((x) => x.status === 'rejected');

      if (success.length > 0) {
        this.logger.log(`Sucessfully synced ${success.length} folders into albums.`);
      }
      if (failed.length > 0) {
        this.logger.error(`Failed to sync ${failed.length} folders into albums.`);
      }

      return new SyncResultDto({
        success: success.length,
        failed: failed.length,
      });
    } catch (err) {
      this.logger.error('Error while syncing');
      console.error(err);
    } finally {
      this.isSyncing = false;
    }
  }

  @Cron(ENV.SYNC_CRON)
  public async syncNow() {
    if (this.isSyncing) {
      return 'Already syncing...';
    } else {
      return this.sync();
    }
  }
}
