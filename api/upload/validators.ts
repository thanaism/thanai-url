export const validateUrlString = (value: string): boolean =>
  /^https?:\/\/[\w/:%#$&?()~.=+-]+$/.test(value);

const linkTypeArray = ['OneDay', 'OneMonth', 'Permanent'] as const;
export type LinkType = typeof linkTypeArray[number];
export const getLinkType = (value: unknown): LinkType =>
  linkTypeArray.some((v) => v === value) ? (value as LinkType) : 'OneDay';

export const getUrl = (value: unknown): string =>
  typeof value === 'string' && validateUrlString(value) ? value : '';
