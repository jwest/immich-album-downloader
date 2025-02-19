import axios from 'axios';

export default class ImmichClient {
    constructor(host, apiKey) {
        this.host = host;
        this.apiKey = apiKey;
    }

    async getImages(albumId) {
        const config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${this.host}api/albums/${albumId}`,
            headers: { 
              'Accept': 'application/json',
              'x-api-key': this.apiKey,
            }
          };
        
        const response = await axios.request(config);

        return response.data;
    }

    async downloadImage(id) {
        const config = {
          method: 'get',
          maxBodyLength: Infinity,
          url: `${this.host}api/assets/${id}/original`,
          responseType: 'stream',
          headers: { 
            'Accept': 'application/octet-stream',
            'x-api-key': this.apiKey,
          }
        };
        
        const response = await axios.request(config);
        
        return response.data;
      }
}