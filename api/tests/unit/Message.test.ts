/* eslint-disable */
import { TestContext } from '@anthonychu/azure-functions-test-utils';
import httpTrigger from '../../Message';

describe('Message function unit tests', () => {
  it('should return a greeting with username', async () => {
    const context = new TestContext();
    const name = 'World';
    context.req.query = { name };

    const result = await httpTrigger(context, context.req);
    expect(context.res.body).toEqual({
      text: `Hello, ${name}. This HTTP triggered function executed successfully.`,
    });
  });
  it('should return a recommend', async () => {
    const context = new TestContext();
    context.req.query = {};
    const result = await httpTrigger(context, context.req);
    expect(context.res.body).toEqual({
      text:
        'This HTTP triggered function executed successfully. ' +
        'Pass a name in the query string or in the request body for a personalized response.',
    });
  });
});
