import {
  DeleteObjectCommand,
  ListObjectsV2Command,
  ListObjectsV2CommandOutput,
  PutObjectCommand,
  S3Client,
  PutObjectCommandInput,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
});

export const uploadFile = async (
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<string> => {
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: fileName,
    Body: fileBuffer,
    ContentType: mimeType,
  });

  await s3Client.send(command);
  return `${process.env.R2_PUBLIC_URL}/${fileName}`;
};

export const getPresignedPutUrl = async (fileName: string, mimeType: string): Promise<string> => {
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: fileName,
    ContentType: mimeType,
  } as PutObjectCommandInput);

  const url = await getSignedUrl(s3Client, command, { expiresIn: 60 * 5 });
  return url;
};

export const deleteFile = async (fileName: string): Promise<boolean> => {
  const command = new DeleteObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: fileName,
  });

  await s3Client.send(command);
  return true;
};

export const listFiles = async (): Promise<NonNullable<ListObjectsV2CommandOutput['Contents']>> => {
  const command = new ListObjectsV2Command({
    Bucket: process.env.R2_BUCKET_NAME,
  });

  const response = await s3Client.send(command);
  return response.Contents || [];
};
