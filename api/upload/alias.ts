import axios from 'axios';

const available = async (alias: string, baseUrl: string): Promise<boolean> => {
  if (alias == null) return false;

  return axios
    .get(`${baseUrl}/${alias}`)
    .then((_) => false)
    .catch((_) => true);
};

const validateAlias = async (alias: string, baseUrl: string): Promise<boolean> => {
  if (!/[\w#/+-]{4,10}/.test(alias)) return false;

  return available(alias, baseUrl);
};

const pickAlias = async (len: number, baseUrl: string): Promise<string> => {
  const alphabets = [...Array(26).keys()].map((i) => String.fromCharCode('A'.charCodeAt(0) + i));
  const numbers = [...Array(10).keys()];
  const symbols = [...'#+-_/'];
  const usableChars = [...alphabets, ...numbers, ...symbols];
  const n = usableChars.length;
  const recursiveAliasing = async (m = len): Promise<string> => {
    // eslint-disable-next-line no-bitwise
    const alias = [...Array(m).keys()].map((_) => usableChars[(Math.random() * n) | 0]).join('');

    return (await available(alias, baseUrl)) ? alias : recursiveAliasing(m + 1);
  };

  return recursiveAliasing();
};

export { validateAlias, pickAlias };
