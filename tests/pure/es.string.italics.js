import italics from 'core-js-pure/full/string/italics';

QUnit.test('String#italics', assert => {
  assert.isFunction(italics);
  assert.same(italics('a'), '<i>a</i>', 'lower case');
});
