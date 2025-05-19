# Immich Album-Folder Sync

This script helps keeping your [Immich](https://immich.app/) Albums in sync with your folders from external libraries.

## Config file
```jsonc
[
  {
    "path": "path/to/your/folder",
    "albumId": "00000000-0000-0000-0000-000000000000",
    "recursive": true // if true, include subfolders
  }
]
```
In the config file you can define multiple albul-folder pairs. Each pair needs an absolute `path` to a [folder](https://immich.app/docs/features/folder-view/), an `albumId` (the UUID in the URL when you open an album) and a `recursive` flag. If the flag is set to `true`, all contents (including subfolders) of the given path will get added to the album.

If an album is not found. an error will get logged to the console. If a folder does not exist, nothing happens.

## Environment Variables
| Variable       | Type   | Required | Default Value | Description                                                                                  |
| -------------- | ------ | -------- | ------------- | -------------------------------------------------------------------------------------------- |
| LOG_LEVEL      | string | ❌        | `'info'`      |                                                                                              |
| SYNC_INTERVAL  | number | ❌        | `3600`        | Sync interval  in seconds                                                                    |
| IMMICH_API_URL | string | ✅        |               | Base URl to your Immich server (e.g. `'https://immich.domain.com'`)                          |
| IMMICH_API_KEY | string | ✅        |               | Immich [API Key](https://immich.app/docs/features/command-line-interface#obtain-the-api-key) |

## Deployment
### Extending your Immich stack
The easiest way to deploy the tool is to extend your existing Immich `compose.yaml`.
```yaml
services:
  # ... (db, immich server, redis)

  immich-album-folder-sync:
    container_name: immich-album-folder-sync
    image: ghcr.io/tobiaswaelde/immich-album-folder-sync
    restart: always
    depends_on:
      - server
    volumes:
      ./data/config:/app/config
    environment:
      LOG_LEVEL: info
      SYNC_INTERVAL: 3600 # Sync interval in seconds
      IMMICH_API_URL: https://immich.domain.com
      IMMICH_API_KEY: your-immich-api-key

```