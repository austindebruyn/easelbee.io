import oneOf from 'lib/oneOf';

describe('oneOf', function () {
  it('should return true if value is included', function () {
    const rule = oneOf(['tony stark', 'thor']);

    expect(rule.validator('thor')).to.be.true;
  });

  return it('should return false if value not included', function () {
    const rule = oneOf(['tony stark', 'thor']);

    expect(rule.validator('captain america')).to.be.false;
  });
});
