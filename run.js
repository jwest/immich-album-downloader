import env from 'env-var';
import { CronJob } from 'cron';

import ImmichClient from './immich-client.js';
import AlbumFsClient from './album-fs-client.js';

let host = env.get('IMMICH_HOST').required().asUrlString();
let apiKey = env.get('IMMICH_APIKEY').required().asString();
let albumId = env.get('ALBUM_ID').required().asString();
let albumOutputPath = env.get('ALBUM_OUTPUT_PATH').required().asString();
let cronTime = env.get('CRON_TIME').required().default('0 * * * * *').asString();
let timeZone = env.get('TZ').required().default('Europe/London').asString();

const immichClient = new ImmichClient(host, apiKey);
const albumFsClient = new AlbumFsClient(albumOutputPath);

CronJob.from({
	cronTime,
	timeZone,
	onTick: async function () {
		const albumImages = await immichClient.getImages(albumId);
    console.log(`Photos in album count: ${albumImages.assetCount}`);

    albumImages.assets
      .map(async image => {
        let imageName = image.originalFileName;
        if (!await albumFsClient.isImageExists(imageName)) {
          console.log(` - sync photo: ${image.id} - ${image.originalFileName}`);
          let imageData = await immichClient.downloadImage(image.id);
          await albumFsClient.saveImage(imageName, imageData);
        } else {
          console.log(` - sync photo: ${image.id} - ${image.originalFileName} - existed`);
        }
      });
	},
  runOnInit: true,
  waitForCompletion: true,
	start: true,
});