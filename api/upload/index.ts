import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { BlobServiceClient, BlockBlobUploadOptions } from '@azure/storage-blob';
import HTTP_CODES from 'http-status-enum';
import { pickAlias, validateAlias } from './alias';
import { ALIAS_DEFAULT_LENGTH } from './constant';
import {
  AzureFunctionsEnvironment,
  validateConnectionString,
  isUrlString,
  LinkType,
  getLinkType,
} from './utilities';

const httpTrigger: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => {
  context.log('upload HTTP trigger function processed a request.');

  const { res } = context;
  if (res == null) {
    // `context.res` is not optional when using HTTP bindings in `function.json`.
    context.log.error('context.res does not exist. check local.settings.json.');
    // No response code can be set without `res`,
    // so there is no way to notify the caller other than an error.
    throw Error('context.res does not exist.');
  }

  const CONNECTION_STRING = process?.env?.AzureWebJobsStorage;
  const ENVIRONMENT = process?.env?.AZURE_FUNCTIONS_ENVIRONMENT as AzureFunctionsEnvironment;

  if (CONNECTION_STRING == null || !validateConnectionString(CONNECTION_STRING, ENVIRONMENT)) {
    res.status = HTTP_CODES.INTERNAL_SERVER_ERROR;
    context.log.error('Environment variable "AzureWebJobsStorage" isn\'t configured correctly.');

    return;
  }

  const BSW_BASE_URL = process?.env?.BlobStaticWebSiteBaseUrl;
  const CDN_BASE_URL = process?.env?.CdnBaseUrl;
  if (
    BSW_BASE_URL == null ||
    !isUrlString(BSW_BASE_URL) ||
    CDN_BASE_URL == null ||
    !isUrlString(CDN_BASE_URL)
  ) {
    res.status = HTTP_CODES.INTERNAL_SERVER_ERROR;
    context.log.error('Environment variable "*BaseUrl" isn\'t configured correctly.');

    return;
  }

  const blobServiceClient = BlobServiceClient.fromConnectionString(CONNECTION_STRING);
  const containerClient = blobServiceClient.getContainerClient('$web');

  const longUrl = req.body?.url;
  if (longUrl == null || !isUrlString(longUrl)) {
    res.body = {
      message: 'Query parameter "url" isn\'t configured correctly.',
    };
    res.status = HTTP_CODES.BAD_REQUEST;
    context.log.warn(res.body.message);

    return;
  }
  context.log(`Request URL is "${longUrl}"`);

  const userDefinedAlias = req.body?.alias;
  if (userDefinedAlias != null && !(await validateAlias(userDefinedAlias))) {
    res.body = {
      message: 'This "alias" is already in use or in the wrong format.',
    };
    res.status = HTTP_CODES.BAD_REQUEST;
    context.log.warn(res.body.message);

    return;
  }

  const blobName: string =
    userDefinedAlias != null ? userDefinedAlias : await pickAlias(ALIAS_DEFAULT_LENGTH);
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  context.log('\nUploading to Azure storage as blob:\n\t', blobName);

  try {
    const data =
      '<!DOCTYPE html><head><title>redirect</title>' +
      '<meta http-equiv="cache-control" content="no-cache" />' +
      '<meta name="robots" content="noindex,nofollow" />' +
      `<meta http-equiv="refresh" content="0; url=${longUrl}">` +
      '</head><body></body></html>\n';

    const linkType: LinkType = getLinkType(req.body?.type);
    context.log(`Link type is "${linkType}"`);

    const uploadOptions: BlockBlobUploadOptions = {
      blobHTTPHeaders: { blobContentType: 'text/html' },
      tags: { LinkType: linkType },
    };
    const uploadBlobResponse = await blockBlobClient.upload(data, data.length, uploadOptions);
    context.res!.body = `https://hy.gy/${blobName}`;

    context.log('Blob was uploaded successfully. requestId: ', uploadBlobResponse.requestId);
  } catch (err: unknown) {
    if (err instanceof Error) {
      context.log.error(err.message);
      context.res!.body = `${err.message}`;
      context.res!.status = HTTP_CODES.INTERNAL_SERVER_ERROR;
    }
  }
};

export default httpTrigger;
