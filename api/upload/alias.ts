import axios from 'axios';

export const available = async (alias: string, baseUrl: string): Promise<boolean> =>
  axios
    .get(`${baseUrl}${alias}`)
    .then((_) => false)
    .catch((_) => true);

export const validateFormat = (alias: string): boolean => /^[-.!\w]{4,10}$/.test(alias);

export const validateAlias = async (alias: string, baseUrl: string): Promise<boolean> => {
  if (!validateFormat(alias)) return false;

  return available(alias, baseUrl);
};

export const generateAlias = async (len: number, baseUrl: string): Promise<string> => {
  const alphabets = [...Array(26).keys()].map((i) => String.fromCharCode('A'.charCodeAt(0) + i));
  const numbers = [...Array(10).keys()];
  // safe characters >> https://docs.aws.amazon.com/en_us/AmazonS3/latest/userguide/object-keys.html
  const symbols = [...'-_.!'];
  const usableChars = [...alphabets, ...numbers, ...symbols];
  const n = usableChars.length;
  const recursiveAliasing = async (m = len): Promise<string> => {
    // eslint-disable-next-line no-bitwise
    const alias = [...Array(m).keys()].map((_) => usableChars[(Math.random() * n) | 0]).join('');

    return (await available(alias, baseUrl)) ? alias : recursiveAliasing(m + 1);
  };

  return recursiveAliasing();
};

export const getBlobName = async (
  alias: unknown,
  defaultLength: number,
  baseUrl: string,
): Promise<string> => {
  // user defined alias is not set
  if (alias == null || alias === '') return generateAlias(defaultLength, baseUrl);
  // user defined alias is not string
  if (typeof alias !== 'string') return '';

  // check availability of user defined alias
  return (await validateAlias(alias, baseUrl)) ? alias : '';
};
