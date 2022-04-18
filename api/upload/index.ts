// eslint-disable-next-line import/no-unresolved
import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import HTTP_CODES from 'http-status-enum';
import { getBlobName } from './alias';
import { ALIAS_DEFAULT_LENGTH } from './constant';
import { environmentVariables, errorEnviromentVariables } from './environmentVariables';
import uploadToS3 from './s3Upload';
import upload from './upload';
import { getLinkType, getUrl, getBlobType } from './validators';

const httpTrigger: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => {
  context.log('upload HTTP trigger function processed a request.');

  // validate local.settings.json
  const { res } = context;
  if (res == null) {
    context.log.error('context.res does not exist. check local.settings.json.');
    throw Error;
  }

  // validate environment variables
  const logEnvironmentVariablesError = (variables: string[]): void =>
    variables.forEach((varName) =>
      context.log.error(`Environment Variable ${varName} isn't configured correctly.`),
    );

  logEnvironmentVariablesError(errorEnviromentVariables);
  if (errorEnviromentVariables.length > 0) {
    res.body = 'Something went wrong with environment varialbles';
    res.status = HTTP_CODES.INTERNAL_SERVER_ERROR;

    return;
  }
  const ENVS = environmentVariables;

  // Validate URL to be shortened
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const url = getUrl(req.body?.url);
  if (url === '') {
    res.body = 'Request parameter "url" isn\'t configured correctly.';
    res.status = HTTP_CODES.BAD_REQUEST;
    context.log.warn(res.body);

    return;
  }
  context.log(`URL: "${url}"`);

  // Get blob type that determines which cloud service is used
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const blobType = getBlobType(req.body?.blobType);

  // Validate user defined alias and get blob name
  const blobName = await getBlobName(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    req.body?.alias,
    ALIAS_DEFAULT_LENGTH,
    blobType === 'aws' ? ENVS.S3_BASE_URL : ENVS.ABS_BASE_URL,
  );
  if (blobName === '') {
    res.body = 'Request parameter "alias" isn\'t configured correctly or already in use.';
    res.status = HTTP_CODES.BAD_REQUEST;
    context.log.warn(res.body);

    return;
  }
  context.log(`Alias: "${blobName}"`);

  // Get link type that determines how long the file will be kept
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const linkType = getLinkType(req.body?.linkType);
  context.log(`Link type: "${linkType}"`);

  const uploadResult =
    blobType === 'aws'
      ? await uploadToS3(url, blobName, linkType)
      : await upload(url, blobName, linkType);

  if (!uploadResult) {
    res.status = HTTP_CODES.INTERNAL_SERVER_ERROR;
    res.body = 'Something went wrong with blob upload';
    context.log.error(res.body);

    return;
  }

  res.body = `${ENVS.CDN_BASE_URL}${blobName}\n`;
};

export default httpTrigger;
