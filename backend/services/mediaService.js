const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const sharp = require('sharp');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

// Set ffmpeg path for Lambda environment
ffmpeg.setFfmpegPath(ffmpegStatic);

class MediaService {
  constructor() {
    this.s3Client = new S3Client({ region: process.env.AWS_REGION || 'us-east-1' });
    this.bucketName = process.env.MEDIA_BUCKET;
  }

  async uploadImage(imageData, projectId, imageIndex) {
    try {
      // Convert base64 to buffer
      const buffer = Buffer.from(imageData.base64, 'base64');
      
      // Process with Sharp for optimization
      const processedBuffer = await sharp(buffer)
        .jpeg({ quality: 90 })
        .resize(1024, 1024, { fit: 'cover' })
        .toBuffer();

      const key = `projects/${projectId}/images/image_${imageIndex}.jpg`;
      
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: processedBuffer,
        ContentType: 'image/jpeg',
        ACL: 'public-read'
      });

      await this.s3Client.send(command);
      
      return {
        url: `https://${this.bucketName}.s3.amazonaws.com/${key}`,
        key: key,
        size: processedBuffer.length
      };
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  async uploadMultipleImages(imagesData, projectId) {
    const uploadPromises = imagesData.map((imageData, index) => 
      this.uploadImage(imageData, projectId, index)
    );
    
    return Promise.all(uploadPromises);
  }

  async createVideoSlideshow(imageUrls, projectId, duration = 2) {
    return new Promise(async (resolve, reject) => {
      try {
        const tempDir = `/tmp/${projectId}`;
        const outputPath = `/tmp/${projectId}/slideshow.mp4`;
        
        // Create temp directory
        if (!fs.existsSync(tempDir)) {
          fs.mkdirSync(tempDir, { recursive: true });
        }

        // Download images to temp directory
        const imagePaths = [];
        for (let i = 0; i < imageUrls.length; i++) {
          const imagePath = path.join(tempDir, `image_${i}.jpg`);
          
          // Download image from S3
          const response = await fetch(imageUrls[i]);
          const buffer = await response.arrayBuffer();
          fs.writeFileSync(imagePath, Buffer.from(buffer));
          
          imagePaths.push(imagePath);
        }

        // Create video slideshow
        const command = ffmpeg();
        
        // Add images with duration
        imagePaths.forEach((imagePath, index) => {
          command.input(imagePath).loop(duration * 25); // 25 fps
        });

        command
          .inputOptions([
            '-framerate 25',
            `-t ${duration * imageUrls.length}`
          ])
          .outputOptions([
            '-c:v libx264',
            '-pix_fmt yuv420p',
            '-crf 23',
            '-preset medium'
          ])
          .output(outputPath)
          .on('end', async () => {
            try {
              // Upload video to S3
              const videoBuffer = fs.readFileSync(outputPath);
              const videoKey = `projects/${projectId}/video/slideshow.mp4`;
              
              const uploadCommand = new PutObjectCommand({
                Bucket: this.bucketName,
                Key: videoKey,
                Body: videoBuffer,
                ContentType: 'video/mp4',
                ACL: 'public-read'
              });

              await this.s3Client.send(uploadCommand);
              
              // Clean up temp files
              this.cleanupTempFiles(tempDir);
              
              resolve({
                url: `https://${this.bucketName}.s3.amazonaws.com/${videoKey}`,
                key: videoKey,
                size: videoBuffer.length
              });
            } catch (error) {
              reject(error);
            }
          })
          .on('error', (error) => {
            this.cleanupTempFiles(tempDir);
            reject(error);
          })
          .run();

      } catch (error) {
        reject(error);
      }
    });
  }

  cleanupTempFiles(tempDir) {
    try {
      if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    } catch (error) {
      console.error('Error cleaning up temp files:', error);
    }
  }

  async generateThumbnail(imageUrl) {
    try {
      const response = await fetch(imageUrl);
      const buffer = await response.arrayBuffer();
      
      const thumbnailBuffer = await sharp(Buffer.from(buffer))
        .resize(400, 400, { fit: 'cover' })
        .jpeg({ quality: 80 })
        .toBuffer();

      return thumbnailBuffer.toString('base64');
    } catch (error) {
      console.error('Error generating thumbnail:', error);
      throw error;
    }
  }
}

module.exports = MediaService;