import { validateUrlString } from './validators';

export type EnvironmentVariables = {
  ALIAS_DEFAULT_LENGTH: number;
  CDN_BASE_URL: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  S3_REGION: string;
  S3_BUCKET_NAME: string;
  S3_BASE_URL: string;
};

/* eslint-disable @typescript-eslint/no-non-null-assertion */
export const environmentVariables: EnvironmentVariables = {
  ALIAS_DEFAULT_LENGTH: 4,
  CDN_BASE_URL: process.env.CDN_BASE_URL!,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID!,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY!,
  S3_REGION: process.env.S3_REGION!,
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME!,
  S3_BASE_URL: process.env.S3_BASE_URL!,
};
/* eslint-enable @typescript-eslint/no-non-null-assertion */

export const errorEnviromentVariables: string[] = Object.entries(environmentVariables).flatMap(
  ([key, value]) => {
    if (value == null) return [key];
    if (typeof value === 'string')
      switch (key) {
        case 'CDN_BASE_URL':
        case 'S3_BASE_URL':
          if (!validateUrlString(value)) return [key];
          break;
        case 'ALIAS_DEFAULT_LENGTH':
        case 'AWS_ACCESS_KEY_ID':
        case 'AWS_SECRET_ACCESS_KEY':
        case 'S3_REGION':
        case 'S3_BUCKET_NAME':
        default:
      }

    return [];
  },
);
