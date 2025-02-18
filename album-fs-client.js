import fs from 'fs';

export default class AlbumFsClient {
    constructor(albumOutputPath) {
        this.albumOutputPath = albumOutputPath.replace(/\/$/, '');
    }

    async isImageExists(imageName) {
        const imagePath = `${this.albumOutputPath}/${imageName}`;

        try {
            await fs.promises.stat(imagePath);
            return true;
        } catch {
            return false;
        }
    }

    async saveImage(imageName, imageData) {
        const imagePath = `${this.albumOutputPath}/${imageName}`;

        let writer = fs.createWriteStream(imagePath);
        imageData.pipe(writer)
        
        // await fs.promises.writeFile(imagePath, imageData, 'binary');
        return await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    }
}