import {
  available,
  validateAlias,
  validateFormat,
  generateAlias,
  getBlobName,
} from '../../upload/alias';

describe('alias unit tests', () => {
  it('should return false for URL ocupied', async () => {
    const result = await available('', 'https://example.com/');
    expect(result).toBe(false);
  });

  it('should return true for URL unused', async () => {
    const result = await available('!!!!', 'https://++++/');
    expect(result).toBe(true);
  });

  it('should return false for short alias', () => {
    const result = validateFormat('123');
    expect(result).toBe(false);
  });

  it('should return false for long alias', () => {
    const result = validateFormat('12345678901');
    expect(result).toBe(false);
  });

  it('should return false for illegal symbols', () => {
    const result = validateFormat('$^&()');
    expect(result).toBe(false);
  });

  it('should return false for unavilable alias', async () => {
    const result = await validateAlias('thanaism', 'https://github.com/');
    expect(result).toBe(false);
  });

  it('should return true for avilable alias', async () => {
    const result = await validateAlias('fine', 'https://++++/');
    expect(result).toBe(true);
  });

  it('should return avilable alias', async () => {
    const result = await generateAlias(4, 'https://++++/');
    expect(result).toMatch(/[-.!\w]{4,10}/);
  });

  it('should return original alias', async () => {
    const result = await getBlobName('hoge', 4, 'https://example.com/');
    expect(result).toBe('hoge');
  });

  it('should return empty string', async () => {
    const result = await getBlobName('thanaism', 4, 'https://github.com/');
    expect(result).toBe('');
  });

  it('should return new alias', async () => {
    const result = await getBlobName('', 4, 'https://example.com/');
    expect(result).toMatch(/[-.!\w]{4,10}/);
  });

  it('should return new alias', async () => {
    const result = await getBlobName(undefined, 4, 'https://example.com/');
    expect(result).toMatch(/[-.!\w]{4,10}/);
  });
});
