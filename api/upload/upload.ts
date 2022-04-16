import { BlobServiceClient, BlockBlobUploadOptions } from '@azure/storage-blob';
import { LinkType } from './utilities';

const upload = async (
  url: string,
  connectionString: string,
  blobName: string,
  linkType: LinkType,
): Promise<string | undefined> => {
  const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
  const containerClient = blobServiceClient.getContainerClient('$web');
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  const uploadOptions: BlockBlobUploadOptions = {
    blobHTTPHeaders: { blobContentType: 'text/html' },
    tags: { LinkType: linkType },
  };
  const data =
    '<!DOCTYPE html><head><title>redirect</title>' +
    '<meta http-equiv="cache-control" content="no-cache" />' +
    '<meta name="robots" content="noindex,nofollow" />' +
    `<meta http-equiv="refresh" content="0; url=${url}">` +
    '</head><body></body></html>\n';
  const uploadBlobResponse = await blockBlobClient.upload(data, data.length, uploadOptions);

  return uploadBlobResponse.requestId;
};

export default upload;
