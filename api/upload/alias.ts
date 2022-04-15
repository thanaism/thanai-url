import axios from 'axios';

const validateAlias = async (alias: string): Promise<boolean> => {
  if (!/[\w#/+-]{4,10}/.test(alias)) return false;
  return available(alias);
};

const available = async (alias: string): Promise<boolean> => {
  if (alias == null) return false;
  return axios
    .get(`${process.env.BlobStaticWebSiteBaseUrl}/${alias}`)
    .then((_) => false)
    .catch((_) => true);
};

const pickAlias = async (len: number): Promise<string> => {
  const alphabets = [...Array(26).keys()].map((i) => String.fromCharCode('A'.charCodeAt(0) + i));
  const numbers = [...Array(10).keys()];
  const symbols = [...'#+-_/'];
  const usableChars = [...alphabets, ...numbers, ...symbols];
  const n = usableChars.length;
  const recursiveAliasing = async (m = len): Promise<string> => {
    const alias = [...Array(m).keys()].map((_) => usableChars[(Math.random() * n) | 0]).join('');
    return (await available(alias)) ? alias : recursiveAliasing(m + 1);
  };
  return recursiveAliasing();
};

export { validateAlias, pickAlias };
