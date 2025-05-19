# Immich Album-Folder Sync

This script helps keeping your Immich Albums in sync with your folders from external libraries.

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

## Deployment
### Extending your Immich stack
```yaml
# compose.yaml
name: immich
services:
  # ... (db, immich server, redis)

  immich-album-folder-sync:
    container_name: immich-album-folder-sync
    image: ghcr.io/tobiaswaelde/immich-album-folder-sync
    volumes:
      ./data/config:/app/config/folders.json
    environment:
      LOG_LEVEL: info
      SYNC_INTERVAL: 3600 # Sync interval in seconds
      IMMICH_API_URL: https://immich.domain.com
      IMMICH_API_KEY: your-immich-api-key

```