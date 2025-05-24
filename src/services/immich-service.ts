import axios, { AxiosInstance } from 'axios';
import * as qs from 'qs';
import { ENV } from '../config/env';
import { Asset } from '../types/immich/asset';

export class ImmichService {
  private readonly api: AxiosInstance;

  /**
   * Create an instance of the ImmichService.
   *
   * It initializes the axios instance with the base URL and headers.
   */
  constructor() {
    this.api = axios.create({
      baseURL: `${ENV.IMMICH_API_URL}/api`,
      headers: {
        'x-api-key': ENV.IMMICH_API_KEY,
      },
    });
  }

  //#region albums
  public async getAlbumInfo(albumId: string): Promise<any | null> {
    try {
      const res = await this.api.get<any>(`/albums/${albumId}`);
      return res.data;
    } catch (err) {
      return null;
    }
  }

  /**
   * Add assets to an album.
   * @param {string} albumId The ID of the album to add assets to.
   * @param {string[]} assetIds The IDs of the assets to add to the album.
   * @returns
   */
  public async addAssetsToAlbum(albumId: string, assetIds: string[]): Promise<void> {
    const data = {
      ids: assetIds,
    };
    const res = await this.api.put(`/albums/${albumId}/assets`, data);
    return res.data;
  }
  //#endregion

  //#region views
  /**
   * Fetches all assets from a folder.
   * @param {string} path The path of the folder to fetch assets from.
   * @returns {Asset[]} The assets in the folder.
   */
  public async getAssetsByOriginalPath(path: string): Promise<Asset[]> {
    const q = qs.stringify({ path: path }, { encodeValuesOnly: true });
    const res = await this.api.get<Asset[]>(`/view/folder?${q}`);
    return res.data;
  }

  public async getUniqueOriginalPaths(): Promise<Set<string>> {
    const res = await this.api.get<string[]>('/view/folder/unique-paths');
    return new Set(res.data);
  }
  //#endregion
}
