export const validateUrlString = (value: string): boolean =>
  value.length <= 4096 &&
  /^https?:\/\/[-0-9a-zA-Z.]{4,255}(\/[\w/:%#$&?()~.=+-]*)?$/.test(value) &&
  /^https?:\/\/([-0-9a-zA-Z]{1,63}\.)+[a-z]{2,}(\/[\w/:%#$&?()~.=+-]*)?$/.test(value);

const linkTypeArray = ['OneDay', 'OneMonth', 'Permanent'] as const;
export type LinkType = typeof linkTypeArray[number];
export const getLinkType = (value: unknown): LinkType =>
  linkTypeArray.some((v) => v === value) ? (value as LinkType) : 'OneDay';

export const getUrl = (value: unknown): string =>
  typeof value === 'string' && validateUrlString(value) ? value : '';
