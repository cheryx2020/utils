import { getValueObjectByPath } from "../src/data";

describe('getValueObjectByPath', () => {
  const obj = {
    a: {
      b: {
        c: 42,
      },
    },
    x: {
      y: null,
    },
  };

  test('should return the value at the given path', () => {
    expect(getValueObjectByPath(obj, 'a.b.c')).toBe(42);
  });

  test('should return the default value if the path does not exist', () => {
    expect(getValueObjectByPath(obj, 'a.b.d', 'default')).toBe('default');
  });

  test('should return the default value if the path is null', () => {
    expect(getValueObjectByPath(obj, 'x.y.z', 'default')).toBe('default');
  });

  test('should handle array paths', () => {
    expect(getValueObjectByPath(obj, ['a', 'b', 'c'])).toBe(42);
  });

  test('should return the object itself if path is empty', () => {
    expect(getValueObjectByPath(obj, '', 'default')).toBe(obj);
  });

  test('should return the default value if object is null or undefined', () => {
    expect(getValueObjectByPath(null, 'a.b.c', 'default')).toBe('default');
    expect(getValueObjectByPath(undefined, 'a.b.c', 'default')).toBe('default');
  });
});