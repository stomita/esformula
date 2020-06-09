import assert from "assert";
import { parse } from "../src";

/**
 *
 */
describe("esformula", () => {
  test("simple formula", () => {
    const formula = parse('a + "b"');
    assert.ok(formula != null);
    assert.deepEqual(formula.identifiers.sort(), ["a"].sort());
    assert.ok(formula.evaluate({ a: "a" }) === "ab");
  });

  test("array expression", () => {
    const [a, b, c] = [1, 2, 3];
    const arr = [4, 6];
    assert.deepEqual(parse("[0, a, b, c]").evaluate({ a, b, c }), [0, a, b, c]);
    assert.deepEqual(parse("[2, ...arr]").evaluate({ arr }), [2, ...arr]);
  });

  test("object expression", () => {
    const [a, b, c] = [1, 2, 3];
    assert.deepEqual(parse("({ a, b, d: c })").evaluate({ a, b, c }), {
      a,
      b,
      d: c,
    });
    const obj = { c: 4, d: true };
    assert.deepEqual(parse("({ a, ...obj })").evaluate({ a, obj }), {
      a,
      ...obj,
    });
  });

  test("unary expression", () => {
    const a = -1;
    assert.ok(parse("-a").evaluate({ a }) === -a);
    assert.ok(parse("+a").evaluate({ a }) === +a);
    assert.ok(parse("!a").evaluate({ a }) === !a);
    assert.ok(parse("~a").evaluate({ a }) === ~a); // eslint-disable-line no-bitwise
    assert.ok(parse("typeof a").evaluate({ a }) === typeof a); // eslint-disable-line valid-typeof
    assert.ok(parse("void a").evaluate({ a }) === void a); // eslint-disable-line no-void
  });

  test("binary expression", () => {
    const a: any = -2;
    const b = undefined;
    const o = { a };
    assert.ok(parse('a === "-1"').evaluate({ a }) === (a === "-1"));
    assert.ok(parse('a !== "-1"').evaluate({ a }) === (a !== "-1"));
    assert.ok(parse("b == null").evaluate({ b }) === (b == null));
    assert.ok(parse("b != null").evaluate({ b }) === (b != null));
    assert.ok(parse("a < 0").evaluate({ a }) === a < 0);
    assert.ok(parse("a <= 0").evaluate({ a }) === a <= 0);
    assert.ok(parse("a > 0").evaluate({ a }) === a > 0);
    assert.ok(parse("a >= 0").evaluate({ a }) === a >= 0);
    assert.ok(parse("a + 2").evaluate({ a }) === a + 2);
    assert.ok(parse("a - 1").evaluate({ a }) === a - 1);
    assert.ok(parse("a * 4").evaluate({ a }) === a * 4);
    assert.ok(parse("a / 6").evaluate({ a }) === a / 6);
    assert.ok(parse("a % 7").evaluate({ a }) === a % 7);
    assert.ok(parse("a ** 7").evaluate({ a }) === a ** 7);
    assert.ok(parse("a << 1").evaluate({ a }) === a << 1); // eslint-disable-line no-bitwise
    assert.ok(parse("a >> 1").evaluate({ a }) === a >> 1); // eslint-disable-line no-bitwise
    assert.ok(parse("a >>> 1").evaluate({ a }) === a >>> 1); // eslint-disable-line no-bitwise
    assert.ok(parse("a | 1").evaluate({ a }) === (a | 1)); // eslint-disable-line no-bitwise
    assert.ok(parse("a ^ 1").evaluate({ a }) === (a ^ 1)); // eslint-disable-line no-bitwise
    assert.ok(parse("a & 1").evaluate({ a }) === (a & 1)); // eslint-disable-line no-bitwise
    assert.ok(parse('"a" in o').evaluate({ o }) === "a" in o);
    assert.ok(
      parse('"a" instanceof String').evaluate({ String }) ===
        ("a" as any) instanceof String
    );
  });

  test("logical expression", () => {
    const a: any = 1;
    assert.ok(parse("a > 0 && a <= 2").evaluate({ a }) === (a > 0 && a <= 2));
    assert.ok(
      parse("a === 0 || a === 1").evaluate({ a }) === (a === 0 || a === 1)
    );
  });

  test("conditional expression", () => {
    const a = 1;
    const b = 2;
    const c = 3;
    assert.ok(parse("a > 0 ? b : c").evaluate({ a, b, c }) === (a > 0 ? b : c));
  });

  test("member expression", () => {
    let formula = parse("a[b]");
    assert.ok(formula != null);
    assert.deepEqual(formula.identifiers.sort(), ["a", "b"].sort());
    assert.ok(formula.evaluate({ a: { foo: 1 }, b: "foo" }) === 1);

    formula = parse("a.b");
    assert.ok(formula != null);
    assert.deepEqual(formula.identifiers, ["a"]);
    assert.ok(formula.evaluate({ a: { b: 1 } }) === 1);

    formula = parse('a.b["c"]');
    assert.ok(formula != null);
    assert.deepEqual(formula.identifiers.sort(), ["a"]);
    assert.ok(formula.evaluate({ a: { b: { c: 1 } } }) === 1);
  });

  test("call expression", () => {
    const formula = parse("a(b)");
    assert.ok(formula != null);
    assert.deepEqual(formula.identifiers.sort(), ["a", "b"].sort());
    const a = (x: any) => x * x;
    const b = 2;
    assert.ok(formula.evaluate({ a, b }) === a(b));
  });

  test("method call expression", () => {
    const formula = parse("obj.method(b)");
    assert.ok(formula != null);
    assert.deepEqual(formula.identifiers.sort(), ["obj", "b"].sort());
    const obj = {
      method(b: any) {
        return this.a * b;
      },
      a: 1,
    };
    const b = 2;
    assert.ok(formula.evaluate({ obj, b }) === obj.method(b));
  });

  test("template literal", () => {
    const formula = parse("`template${n}`"); // eslint-disable-line no-template-curly-in-string
    assert.ok(formula != null);
    assert.deepEqual(formula.identifiers.sort(), ["n"]);
    const n = 1;
    assert.ok(formula.evaluate({ n }) === `template${n}`);
    assert.ok(parse("`\n`").evaluate({ n }) === `\n`); // eslint-disable-line quotes
  });

  test("parse complex formula", () => {
    const formula = parse(`
      call([1, 2, 3], {
        prop1: obj.method("abc", 12),
        prop2: bar.name + obj[foo.name] * 123,
        [baz.id]: arr[2 * i + 3 * (j - 1)],
      }, typeof qux !== 'undefined' && obj.num < .8 ? 'yes' : 'no')
    `);
    assert.ok(formula != null);
    assert.deepEqual(
      formula.identifiers.sort(),
      ["obj", "arr", "call", "foo", "bar", "baz", "qux", "i", "j"].sort()
    );
  });

  test("should not parse non-expression statement", () => {
    try {
      const formula = parse("const a = 1"); // eslint-disable-line @typescript-eslint/no-unused-vars
      assert.fail("should not be parsed if non-expression statement is passed");
    } catch (err) {
      assert.ok(err.name === "SyntaxError");
    }
  });

  test("should not parse assignment expression", () => {
    try {
      const formula = parse("obj.value = 1"); // eslint-disable-line @typescript-eslint/no-unused-vars
      assert.fail("should not be parsed if expression includes assignment");
    } catch (err) {
      assert.ok(err.name === "EXPRESSION_NOT_SUPPORTED");
    }
  });

  test("should avoid prototype access", () => {
    const formula = parse("(1).constructor.prototype.toExponential()");
    try {
      formula.evaluate();
      assert.fail(
        "should not be evaluated if constructor contains prototype/constructor access"
      );
    } catch (err) {
      assert.ok(true);
    }
  });
});
