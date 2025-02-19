# Immich Album Downloader

## Features

- Automatic download of all images from a specified album.
- Scheduled downloads using cron jobs.

## Why This Project Exists

My wife and I use Immich to back up our photos. The setup we use is 3 accounts, separate for my wife, separate for me and a separate admin account. The admin account is built from shared photos and has photo sharing enabled for our accounts. The photos on it come from cameras and are organized on NAS.

From the photos we take with smartphones, I wanted to be able to find those that are worth saving in the home library and take care of preserving them for the future. So when my wife or I add an account to the "Shared photos" album, I wanted these photos to be downloaded to the catalog and displayed in the main timeline on our accounts.

# How to Use

## Running with Docker

To run the Immich Album Downloader using Docker, follow these steps:

### Prerequisites
- Ensure you have [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/install/) installed on your machine.
- Obtain your Immich API key.

## Running the Project

### Using Docker

Build the Docker image:

```bash
docker build -t immich-album-downloader .
```

2. Run the container with necessary environment variables:

```bash
docker run --rm \
    -e IMMICH_HOST='http://127.0.0.1:2283/' \
    -e IMMICH_APIKEY='xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' \
    -e ALBUM_ID='xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' \
    -e ALBUM_OUTPUT_PATH='/album' \
    -e CRON_TIME='0 * * * * *' \
    -e TZ='Europe/Warsaw' \
    -v path/to/local/album:/album:rw \
    immich-album-downloader
```

### Using Docker Compose

1. Ensure you have the `docker-compose.yml` file in your working directory.

2. Start the service:

```bash
docker-compose -f docker-compose_example.yml up
```

This setup will automatically download photos from the specified Immich album at the scheduled times defined by the `CRON_TIME` environment variable.