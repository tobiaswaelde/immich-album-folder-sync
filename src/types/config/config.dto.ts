import { z } from 'zod';
import { AlbumFolderPair } from './album-folder-pair';

// export class ConfigDto {
//   @ValidateNested({ each: true })
//   @Type(() => AlbumFolderPairDto)
//   folders: AlbumFolderPairDto[];
// }

export const Config = z.array(AlbumFolderPair).default([]);

export type Config = z.infer<typeof Config>;
