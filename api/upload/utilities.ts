type AzureFunctionsEnvironment = 'Production' | 'Staging' | 'Development';

const validateConnectionString = (value: string, env: AzureFunctionsEnvironment): boolean => {
  const ok =
    /DefaultEndpointsProtocol=[^;]+;AccountName=[^;]+;AccountKey=[^;]+;EndpointSuffix=.+/.test(
      value,
    );
  switch (env) {
    case 'Production':
    case 'Staging':
      return ok;
    case 'Development':
      return ok || value === 'UseDevelopmentStorage=true';
    default:
      throw Error(`"${env}" isn't AzureFunctionsEnvironment.`);
  }
};

const isUrlString = (value: string): boolean => /https?:\/\/[\w/:%#$&?()~.=+-]+/.test(value);

const linkTypeArray = ['OneDay', 'OneMonth', 'Permanent'] as const;
type LinkType = typeof linkTypeArray[number];
const getLinkType = (value: string) =>
  linkTypeArray.some((v) => v === value) ? (value as LinkType) : 'OneDay';

export { AzureFunctionsEnvironment, validateConnectionString, isUrlString, LinkType, getLinkType };
