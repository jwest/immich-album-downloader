import env from 'env-var';
import { writeFileSync, existsSync } from 'fs';
import axios from 'axios';

let host = env.get('IMMICH_HOST').required().asUrlString();
let apiKey = env.get('IMMICH_APIKEY').required().asString();
let albumId = env.get('ALBUM_ID').required().asString();
let albumOutputPath = env.get('ALBUM_OUTPUT_PATH').required().asString();

async function download_image(id) {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${host}/api/assets/${id}/original`,
    headers: { 
      'Accept': 'application/octet-stream',
      'x-api-key': apiKey,
    }
  };
  
  return await axios.request(config)
    .catch((error) => {
      console.log(error);
    });
}

let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: `${host}api/albums/${albumId}`,
  headers: { 
    'Accept': 'application/json',
    'x-api-key': apiKey,
  }
};

axios.request(config)
  .then((response) => {
    console.log(`Photos in album count: ${response.data.assetCount}`);

    return response.data.assets
      .map(async image => {
        let outputPath = albumOutputPath.replace(/\/$/, '');
        let imagePath = `${outputPath}/${image.originalFileName}`;

        if (!existsSync(imagePath)) {
          console.log(` - sync photo: ${image.id} - ${image.originalFileName}`);
          let imageData = await download_image(image.id);
          writeFileSync(imagePath, imageData.data);
        } else {
          console.log(` - sync photo: ${image.id} - ${image.originalFileName} - existed`);
        }

        return {
          id: image.id,
          originalFileName: image.originalFileName,
        }
      });
  })
  .catch((error) => {
    console.log(error);
  });
