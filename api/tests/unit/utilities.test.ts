import { getLinkType, isUrlString, validateConnectionString } from '../../Upload/utilities';

describe('alias unit tests', () => {
  it('should return true', () => {
    const result = validateConnectionString('UseDevelopmentStorage=true', 'Development');
    expect(result).toBe(true);
  });

  it('should return false', () => {
    const result = validateConnectionString('bad string', 'Production');
    expect(result).toBe(false);
  });

  it('should return true', () => {
    const result = isUrlString('https://example.com');
    expect(result).toBe(true);
  });

  it('should return false', () => {
    const result = isUrlString('htpps://example.com');
    expect(result).toBe(false);
  });

  it('should return false', () => {
    const result = isUrlString('ihttps://example.com');
    expect(result).toBe(false);
  });

  it('should return false', () => {
    const result = isUrlString('https://example!com');
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
