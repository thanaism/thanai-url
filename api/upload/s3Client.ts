import { S3Client } from '@aws-sdk/client-s3';
import { environmentVariables } from './environmentVariables';

const REGION = environmentVariables.S3_REGION;
const s3Client = new S3Client({ region: REGION });

export default s3Client;
