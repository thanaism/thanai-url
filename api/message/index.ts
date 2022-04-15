// eslint-disable-next-line import/no-unresolved
import { AzureFunction, Context, HttpRequest } from '@azure/functions';

// eslint-disable-next-line @typescript-eslint/require-await
const httpTrigger: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => {
  context.log('HTTP trigger function processed a request.');
  const { name } = req.query;
  const responseMessage = name
    ? `Hello, ${name}. This HTTP triggered function executed successfully.`
    : 'This HTTP triggered function executed successfully. ' +
      'Pass a name in the query string or in the request body for a personalized response.';

  if (context.res != null) context.res.body = { text: responseMessage };
};

export default httpTrigger;
