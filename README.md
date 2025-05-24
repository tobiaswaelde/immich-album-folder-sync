# Immich Album-Folder Sync

![Docker Build](https://github.com/tobiaswaelde/immich-album-folder-sync/actions/workflows/test-build.yml/badge.svg)
![Docker Deploy](https://github.com/tobiaswaelde/immich-album-folder-sync/actions/workflows/deploy.yml/badge.svg)
![Version](https://img.shields.io/github/v/tag/tobiaswaelde/immich-album-folder-sync?label=version)

This script helps keeping your [Immich](https://immich.app/) Albums in sync with your folders from external libraries.

If you are missing a feature or having trouble setting it up, feel free to create an issue.


## 📚 Table Of Contents <!-- omit in toc -->
- [✨ Features](#-features)
- [⚙️ Configuration](#️-configuration)
  - [🌍 Environment Variables](#-environment-variables)
  - [🛠️ Config File](#️-config-file)
- [🚀 Deployment](#-deployment)
  - [🐋 Extending Immich Stack](#-extending-immich-stack)
- [📡 API](#-api)
- [📦 Changelog](#-changelog)


## ✨ Features

- 🗂️ Automatically syncs folders with Immich albums
- 🔁 Recursive sync support
- ⏱️ Cron-based sync scheduling
- 🧪 Dockerized for easy deployment


## ⚙️ Configuration

### 🌍 Environment Variables
| Variable       | Type   | Required | Default Value | Description                                                                                  |
| -------------- | ------ | -------- | ------------- | -------------------------------------------------------------------------------------------- |
| PORT           | number | no       | `3001`        | The port where the webserver runs on.                                                        |
| IMMICH_API_URL | string | yes      |               | Base URL to your Immich server (e.g. `'https://immich.domain.com'`)                          |
| IMMICH_API_KEY | string | yes      |               | Immich [API Key](https://immich.app/docs/features/command-line-interface#obtain-the-api-key) |
| SYNC_CRON      | string | no       | `'0 * * * *'` | Cron expression to sync (Default: every hour)                                                |


### 🛠️ Config File
In the config file (`/app/config/folders.json`) you can define multiple album-folder pairs.

```jsonc
[
  {
    "path": "path/to/your/folder", // omit trailing '/'
    "albumId": "00000000-0000-0000-0000-000000000000",
    "recursive": true // if true, include subfolders
  },
  // ... (more albums-folder pairs)
]
```

| Property    | Required | Description                                                                                                 |
| ----------- | -------- | ----------------------------------------------------------------------------------------------------------- |
| `path`      | yes      | Absolute path to a [folder](https://immich.app/docs/features/folder-view/). Should not contain leading `/`. |
| `albumId`   | yes      | The UUID in the URL when you open an album .                                                                |
| `recursive` | no       | If set to `true`, all contents (including subfolders) of the given path will be added to the album.         |

> [!TIP]
> If an album is not found, a warning will get logged to the console and the sync continues with the next folder pair.

> [!TIP]
> If a folder does not exist, a warning will get logged to the console and the sync continues with the next folder pair.


## 🚀 Deployment

### 🐋 Extending Immich Stack
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
      IMMICH_API_URL: https://immich.domain.com
      IMMICH_API_KEY: your-immich-api-key
      SYNC_CRON: '0 * * * *'

```


## 📡 API

You can access the API documentation after deployment at [`http://localhost:3001/api`](http://localhost:3001/api).


## 📦 Changelog

See the [CHANGELOG.md](./CHANGELOG.md) for details on what’s new in recent versions.