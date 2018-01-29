import clone from './clone';

describe('clone', function () {
  it('should handle all js primitives', function () {
    const source = {
      a: 'a',
      b: 2,
      e: true,
      f: null,
      g: void 0
    };
    const result = clone(source);
    debugger
    expect(result).to.not.equal(source);
    expect(result).to.eql(source);
  });

  it('should recurse', function () {
    const source = {
      a: {
        b: {
          c: 3
        }
      }
    };
    const result = clone(source);
    source.a.b.c = 5;

    expect(result.a.b.c).to.eql(3);
    expect(source.a.b.c).to.eql(5);
  });

  it('should handle arrays', function () {
    const source = {
      a: [1, 2]
    };
    const result = clone(source);

    expect(source.a).to.not.equal(result.a);
    expect(source).to.eql(result);
  });
});
