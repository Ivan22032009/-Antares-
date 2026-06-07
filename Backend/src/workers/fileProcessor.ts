import { startFileWorker } from '../utils/queue';
import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import sharp from 'sharp';

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
});

async function processJob(job: any) {
  const { filename } = job.data;
  console.log('Worker: processing file', filename);

  // Example: download, (process), reupload thumbnail - placeholder implementation
  try {
    const get = new GetObjectCommand({ Bucket: process.env.R2_BUCKET_NAME, Key: filename });
    const response = await s3.send(get);

    const bodyStream: Readable = response.Body as unknown as Readable;
    const chunks: Buffer[] = [];
    for await (const chunk of bodyStream) {
      chunks.push(Buffer.from(chunk));
    }
    const buf = Buffer.concat(chunks);

    // Real processing: create a thumbnail via sharp and upload
    try {
      const thumbBuf = await sharp(buf).resize({ width: 800 }).jpeg({ quality: 80 }).toBuffer();
      const thumbKey = filename.replace(/(\.[^.]*)?$/, '-thumb.jpg');
      const put = new PutObjectCommand({ Bucket: process.env.R2_BUCKET_NAME, Key: thumbKey, Body: thumbBuf, ContentType: 'image/jpeg' });
      await s3.send(put);
      console.log('Worker: processed and uploaded thumbnail', thumbKey);
    } catch (procErr) {
      console.error('Worker image processing error', procErr);
      // fallback: upload original as thumb key
      const thumbKey = filename.replace(/(\.[^.]*)?$/, '-thumb$1');
      const put = new PutObjectCommand({ Bucket: process.env.R2_BUCKET_NAME, Key: thumbKey, Body: buf });
      await s3.send(put);
    }
  } catch (err) {
    console.error('Worker processing failed', err);
    throw err;
  }
}

// Start worker when this module is imported
startFileWorker(async (job) => {
  await processJob(job);
});
