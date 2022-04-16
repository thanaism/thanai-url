// eslint-disable-next-line import/no-unresolved
import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import HTTP_CODES from 'http-status-enum';
import { getBlobName } from './alias';
import { ALIAS_DEFAULT_LENGTH } from './constant';
import upload from './upload';
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
    /* `context.res` is not optional when using HTTP bindings in `function.json`.
        No response code can be set without `res`. */
    context.log.error('context.res does not exist. check local.settings.json.');
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
  if (BSW_BASE_URL == null || !isUrlString(BSW_BASE_URL)) {
    res.status = HTTP_CODES.INTERNAL_SERVER_ERROR;
    context.log.error(
      'Environment variable "BlobStaticWebSiteBaseUrl" isn\'t configured correctly.',
    );

    return;
  }

  // Validate CDN URL
  const CDN_BASE_URL = process?.env?.CdnBaseUrl;
  if (CDN_BASE_URL == null || !isUrlString(CDN_BASE_URL)) {
    res.status = HTTP_CODES.INTERNAL_SERVER_ERROR;
    context.log.error('Environment variable "CdnBaseUrl" isn\'t configured correctly.');

    return;
  }

  // Validate URL to be shortened
  const url: unknown = req.body?.url;
  if (typeof url !== 'string' || !isUrlString(url)) {
    res.body = 'Request parameter "url" isn\'t configured correctly.';
    res.status = HTTP_CODES.BAD_REQUEST;

    return;
  }
  context.log(`Request URL is "${url}"`);

  // Validate user defined alias and get blob name
  const blobName = await getBlobName(req.body?.alias, ALIAS_DEFAULT_LENGTH, BSW_BASE_URL);
  if (blobName === '') {
    res.body = 'Request parameter "alias" isn\'t configured correctly or already in use.';
    res.status = HTTP_CODES.BAD_REQUEST;
    context.log.warn(res.body);

    return;
  }
  context.log('\nUploading to Azure storage as blob:\n\t', blobName);

  // Get link type that determines how long the file will be kept
  const linkType: LinkType = getLinkType(req.body?.type);
  context.log(`Link type is "${linkType}"`);

  const requestId: string | undefined = await upload(url, CONNECTION_STRING, blobName, linkType);
  if (requestId == null) {
    res.status = HTTP_CODES.INTERNAL_SERVER_ERROR;
    context.log.error('!! Upload failed');

    return;
  }
  res.body = `https://hy.gy/${blobName}`;
  context.log('Blob was uploaded successfully. requestId: ', requestId);
};

export default httpTrigger;
