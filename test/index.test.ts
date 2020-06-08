import test from 'ava';
import { parse } from '../src';


/**
 *
 */
test('simple formula', (t) => {
  const formula = parse('a + "b"');
  t.truthy(formula);
  t.deepEqual(
    formula.identifiers.sort(),
    ['a'].sort(),
  );
  t.true(formula.evaluate({ a: 'a' }) === 'ab');
});

test('array expression', (t) => {
  const [a, b, c] = [1, 2, 3];
  const arr = [4, 6];
  t.deepEqual(parse('[0, a, b, c]').evaluate({ a, b, c }), [0, a, b, c]);
  t.deepEqual(parse('[2, ...arr]').evaluate({ arr }), [2, ...arr]);
});

test('object expression', (t) => {
  const [a, b, c] = [1, 2, 3];
  t.deepEqual(parse('({ a, b, d: c })').evaluate({ a, b, c }), { a, b, d: c });
  const obj = { c: 4, d: true };
  t.deepEqual(parse('({ a, ...obj })').evaluate({ a, obj }), { a, ...obj });
});

test('unary expression', (t) => {
  const a = -1;
  t.true(parse('-a').evaluate({ a }) === (-a));
  t.true(parse('+a').evaluate({ a }) === (+a));
  t.true(parse('!a').evaluate({ a }) === (!a));
  t.true(parse('~a').evaluate({ a }) === (~a)); // eslint-disable-line no-bitwise
  t.true(parse('typeof a').evaluate({ a }) === (typeof a)); // eslint-disable-line valid-typeof
  t.true(parse('void a').evaluate({ a }) === (void a)); // eslint-disable-line no-void
});

test('binary expression', (t) => {
  const a = -2;
  const b = undefined;
  const o = { a };
  t.true(parse('a === "-1"').evaluate({ a }) === (a === '-1'));
  t.true(parse('a !== "-1"').evaluate({ a }) === (a !== '-1'));
  t.true(parse('b == null').evaluate({ b }) === (b == null));
  t.true(parse('b != null').evaluate({ b }) === (b != null));
  t.true(parse('a < 0').evaluate({ a }) === (a < 0));
  t.true(parse('a <= 0').evaluate({ a }) === (a <= 0));
  t.true(parse('a > 0').evaluate({ a }) === (a > 0));
  t.true(parse('a >= 0').evaluate({ a }) === (a >= 0));
  t.true(parse('a + 2').evaluate({ a }) === (a + 2));
  t.true(parse('a - 1').evaluate({ a }) === (a - 1));
  t.true(parse('a * 4').evaluate({ a }) === (a * 4));
  t.true(parse('a / 6').evaluate({ a }) === (a / 6));
  t.true(parse('a % 7').evaluate({ a }) === (a % 7));
  t.true(parse('a ** 7').evaluate({ a }) === (a ** 7));
  t.true(parse('a << 1').evaluate({ a }) === (a << 1)); // eslint-disable-line no-bitwise
  t.true(parse('a >> 1').evaluate({ a }) === (a >> 1)); // eslint-disable-line no-bitwise
  t.true(parse('a >>> 1').evaluate({ a }) === (a >>> 1)); // eslint-disable-line no-bitwise
  t.true(parse('a | 1').evaluate({ a }) === (a | 1)); // eslint-disable-line no-bitwise
  t.true(parse('a ^ 1').evaluate({ a }) === (a ^ 1)); // eslint-disable-line no-bitwise
  t.true(parse('a & 1').evaluate({ a }) === (a & 1)); // eslint-disable-line no-bitwise
  t.true(parse('"a" in o').evaluate({ o }) === ('a' in o));
  t.true(parse('"a" instanceof String').evaluate({ String }) === ('a' instanceof String));
});

test('logical expression', (t) => {
  const a = 1;
  t.true(parse('a > 0 && a <= 2').evaluate({ a }) === (a > 0 && a <= 2));
  t.true(parse('a === 0 || a === 1').evaluate({ a }) === (a === 0 || a === 1));
});

test('conditional expression', (t) => {
  const a = 1;
  const b = 2;
  const c = 3;
  t.true(parse('a > 0 ? b : c').evaluate({ a, b, c }) === (a > 0 ? b : c));
});

test('member expression', (t) => {
  let formula = parse('a[b]');
  t.truthy(formula);
  t.deepEqual(
    formula.identifiers.sort(),
    ['a', 'b'].sort()
  );
  t.true(formula.evaluate({ a: { foo: 1 }, b: 'foo' }) === 1);

  formula = parse('a.b');
  t.truthy(formula);
  t.deepEqual(
    formula.identifiers,
    ['a']
  );
  t.true(formula.evaluate({ a: { b: 1 } }) === 1);

  formula = parse('a.b["c"]');
  t.truthy(formula);
  t.deepEqual(
    formula.identifiers.sort(),
    ['a']
  );
  t.true(formula.evaluate({ a: { b: { c: 1 } } }) === 1);
});

test('call expression', (t) => {
  const formula = parse('a(b)');
  t.truthy(formula);
  t.deepEqual(
    formula.identifiers.sort(),
    ['a', 'b'].sort()
  );
  const a = x => x * x;
  const b = 2;
  t.true(formula.evaluate({ a, b }) === (a(b)));
});

test('method call expression', (t) => {
  const formula = parse('obj.method(b)');
  t.truthy(formula);
  t.deepEqual(
    formula.identifiers.sort(),
    ['obj', 'b'].sort()
  );
  const obj = {
    method(b) { return this.a * b }, 
    a: 1,
  };
  const b = 2;
  t.true(formula.evaluate({ obj, b }) === (obj.method(b)));
});


test('template literal', (t) => {
  const formula = parse('`template${n}`'); // eslint-disable-line no-template-curly-in-string
  t.truthy(formula);
  t.deepEqual(
    formula.identifiers.sort(),
    ['n']
  );
  const n = 1;
  t.true(formula.evaluate({ n }) === (`template${n}`));
  t.true(parse('`\n`').evaluate({ n }) === (`\n`)); // eslint-disable-line quotes
});

test('parse complex formula', (t) => {
  const formula = parse(`
    call([1, 2, 3], {
      prop1: obj.method("abc", 12),
      prop2: bar.name + obj[foo.name] * 123,
      [baz.id]: arr[2 * i + 3 * (j - 1)],
    }, typeof qux !== 'undefined' && obj.num < .8 ? 'yes' : 'no')
  `);
  t.truthy(formula);
  t.deepEqual(
    formula.identifiers.sort(),
    ['obj', 'arr', 'call', 'foo', 'bar', 'baz', 'qux', 'i', 'j'].sort(),
  );
});

test('should not parse non-expression statement', (t) => {
  try {
    const formula = parse('const a = 1');
    t.fail('should not be parsed if non-expression statement is passed');
    t.falsy(formula);
  } catch (err) {
    t.true(err.name === 'SyntaxError');
  }
});

test('should not parse assignment expression', (t) => {
  try {
    const formula = parse('obj.value = 1');
    t.fail('should not be parsed if expression includes assignment');
    t.falsy(formula);
  } catch (err) {
    t.true(err.name === 'EXPRESSION_NOT_SUPPORTED');
  }
});

test('should avoid prototype access', (t) => {
  const formula = parse('(1).constructor.prototype.toExponential()');
  try {
    formula.evaluate();
    t.fail('should not be evaluated if constructor contains prototype/constructor access');
  } catch (err) {
    t.pass();
  }
});
