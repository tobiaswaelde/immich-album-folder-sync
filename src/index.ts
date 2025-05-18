import { ENV } from './config/env';
import { logger } from './config/logger';
import { ConfigService } from './services/config';
import { ImmichService } from './services/immich';

const config = new ConfigService();
const immich = new ImmichService();

async function syncFolderToAlbum(albumId: string, folderPath: string) {
	try {
		// get album info
		const albumInfo = await immich.getAlbumInfo(albumId);
		logger.scope('SYNC').info(`Syncing folder '${folderPath}' into album '${albumInfo.albumName}'`);

		// load assets from folder
		const assets = await immich.getAssetsByOriginalPath(folderPath);
		const assetIds = assets.map((asset) => asset.id);
		logger.scope('SYNC').debug(`Found ${assets.length} asset(s) in folder '${folderPath}'`);

		// add assets to album
		logger
			.scope('SYNC')
			.debug(`Adding ${assets.length} asset(s) to album '${albumInfo.albumName}'`);
		await immich.addAssetsToAlbum(albumId, assetIds);
		logger
			.scope('SYNC')
			.success(`Added ${assetIds.length} asset(s) to album '${albumInfo.albumName}'`);
	} catch (err) {
		logger.scope('SYNC').error(`Error syncing album '${albumId}'. Does the album exist?`);
	}
}

async function sync() {
	const folders = await immich.getUniqueOriginalPaths();
	for (const albumFolderRelation of config.albumFolderRelations.values()) {
		try {
			if (albumFolderRelation.recursive) {
				const subfolders = [...folders.values()].filter((x) =>
					x.startsWith(albumFolderRelation.path)
				);
				logger
					.scope('SYNC')
					.debug(`Found ${subfolders.length} subfolder(s) in '${albumFolderRelation.path}'`);
				for (const subfolder of subfolders) {
					await syncFolderToAlbum(albumFolderRelation.albumId, subfolder);
				}
			} else {
				await syncFolderToAlbum(albumFolderRelation.albumId, albumFolderRelation.path);
			}
		} catch (err) {
			logger
				.scope('SYNC')
				.error(`Error syncing album '${albumFolderRelation.albumId}'. Does the album exist?`);
		}
	}

	logger.scope('SYNC').info(`All albums synced. Waiting ${ENV.SYNC_INTERVAL} seconds...`);
	console.log();
}

async function main() {
	await sync();
	setInterval(async () => {
		await sync();
	}, ENV.SYNC_INTERVAL * 1000);
}

main();
