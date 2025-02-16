import { writeFileSync, existsSync } from 'fs';
import axios from 'axios';

let host = process.env.IMMICH_HOST;
let apiKey = process.env.IMMICH_APIKEY;
let albumId = process.env.ALBUM_ID;
let outputAlbumPath = process.env.ALBUM_OUTPUT_PATH;

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
  url: `${host}/api/albums/${albumId}`,
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
        let imagePath = `/album/${image.originalFileName}`;

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
