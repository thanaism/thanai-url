import { S3Client } from '@aws-sdk/client-s3';

const REGION = process.env.S3_REGION;
const s3Client = new S3Client({ region: REGION });

export default s3Client;
