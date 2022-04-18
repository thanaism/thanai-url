import { BlobServiceClient, BlockBlobUploadOptions } from '@azure/storage-blob';
import { LinkType } from './validators';

const upload = async (url: string, blobName: string, linkType: LinkType): Promise<boolean> => {
  try {
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      process.env.ABS_CONNECTION_STRING!,
    );
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

    await blockBlobClient.upload(data, data.length, uploadOptions);

    return true;
  } catch {
    return false;
  }
};

export default upload;
