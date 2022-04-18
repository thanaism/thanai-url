import { PutObjectCommand, PutObjectCommandInput } from '@aws-sdk/client-s3';
import s3Client from './s3Client';
import { LinkType } from './utilities';

const bucketParams = (
  url: string,
  blobName: string,
  linkType: LinkType,
): PutObjectCommandInput => ({
  Bucket: process.env.S3_BUCKET_NAME,
  Key: blobName,
  Body: undefined,
  WebsiteRedirectLocation: url,
  Tagging: `LinkType=${linkType}`,
});

const uploadToS3 = async (url: string, blobName: string, linkType: LinkType): Promise<boolean> => {
  const params = bucketParams(url, blobName, linkType);
  try {
    await s3Client.send(new PutObjectCommand(params));

    return true;
  } catch {
    return false;
  }
};

export default uploadToS3;
