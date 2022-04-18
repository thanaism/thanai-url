export const validateConnectionString = (value: string): boolean =>
  /DefaultEndpointsProtocol=[^;]+;AccountName=[^;]+;AccountKey=[^;]+;EndpointSuffix=.+/.test(
    value,
  ) || value === 'UseDevelopmentStorage=true';

export const validateUrlString = (value: string): boolean =>
  /^https?:\/\/[\w/:%#$&?()~.=+-]+$/.test(value);

const linkTypeArray = ['OneDay', 'OneMonth', 'Permanent'] as const;
export type LinkType = typeof linkTypeArray[number];
export const getLinkType = (value: unknown): LinkType =>
  linkTypeArray.some((v) => v === value) ? (value as LinkType) : 'OneDay';

const blobTypeArray = ['azure', 'aws'] as const;
export type BlobType = typeof blobTypeArray[number];
export const getBlobType = (value: unknown): BlobType =>
  blobTypeArray.some((v) => v === value) ? (value as BlobType) : 'aws';

export const getUrl = (value: unknown): string =>
  typeof value === 'string' && validateUrlString(value) ? value : '';
