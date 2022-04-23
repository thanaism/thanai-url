import { getLinkType, validateUrlString } from '../../upload/validators';

describe('alias unit tests', () => {
  it('should return true', () => {
    const result = validateUrlString('https://example.com');
    expect(result).toBe(true);
  });

  it('should return true', () => {
    const result = validateUrlString('https://example.com/');
    expect(result).toBe(true);
  });

  it('should return false', () => {
    const result = validateUrlString('a'.repeat(5000));
    expect(result).toBe(false);
  });

  it('should return false', () => {
    const result = validateUrlString('htpps://example.com');
    expect(result).toBe(false);
  });

  it('should return false', () => {
    const result = validateUrlString('ihttps://example.com');
    expect(result).toBe(false);
  });

  it('should return false', () => {
    const result = validateUrlString('https://example!com');
    expect(result).toBe(false);
  });

  it('should return false', () => {
    const result = validateUrlString('https:/example.com');
    expect(result).toBe(false);
  });

  it('should return false', () => {
    const result = validateUrlString('https://example.c');
    expect(result).toBe(false);
  });

  it('should return false', () => {
    const result = validateUrlString('https://example');
    expect(result).toBe(false);
  });

  it('should return false', () => {
    const ten = '0123456789';
    const result = validateUrlString(`https://${ten.repeat(6)}1234.com`);
    expect(result).toBe(false);
  });

  it('should return OneDay', () => {
    const result = getLinkType({ value: 'wrong type' });
    expect(result).toBe('OneDay');
  });

  it('should return OneMonth', () => {
    const result = getLinkType('OneMonth');
    expect(result).toBe('OneMonth');
  });

  it('should return Permanent', () => {
    const result = getLinkType('Permanent');
    expect(result).toBe('Permanent');
  });
});
