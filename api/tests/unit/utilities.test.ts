import { getLinkType, validateUrlString, validateConnectionString } from '../../upload/validators';

describe('alias unit tests', () => {
  it('should return true', () => {
    const result = validateConnectionString('UseDevelopmentStorage=true');
    expect(result).toBe(true);
  });

  it('should return false', () => {
    const result = validateConnectionString('bad string');
    expect(result).toBe(false);
  });

  it('should return true', () => {
    const result = validateUrlString('https://example.com');
    expect(result).toBe(true);
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

  it('should return OneDay', () => {
    const result = getLinkType({ value: 'wrong type' });
    expect(result).toBe('OneDay');
  });

  it('should return Permanent', () => {
    const result = getLinkType('Permanent');
    expect(result).toBe('Permanent');
  });
});
