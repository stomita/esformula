import * as acorn from "acorn";
import type {
  BaseNodeWithoutComments,
  BaseNode,
  Node,
  Comment,
  SourceLocation,
  Position,
  Program,
  Directive,
  BaseFunction,
  Function,
  Statement,
  BaseStatement,
  EmptyStatement,
  BlockStatement,
  ExpressionStatement,
  IfStatement,
  LabeledStatement,
  BreakStatement,
  ContinueStatement,
  WithStatement,
  SwitchStatement,
  ReturnStatement,
  ThrowStatement,
  TryStatement,
  WhileStatement,
  DoWhileStatement,
  ForStatement,
  BaseForXStatement,
  ForInStatement,
  DebuggerStatement,
  Declaration,
  BaseDeclaration,
  FunctionDeclaration,
  VariableDeclaration,
  VariableDeclarator,
  Expression,
  BaseExpression,
  ChainElement,
  ChainExpression,
  ThisExpression,
  ArrayExpression,
  ObjectExpression,
  PrivateIdentifier,
  Property,
  PropertyDefinition,
  FunctionExpression,
  SequenceExpression,
  UnaryExpression,
  BinaryExpression,
  AssignmentExpression,
  UpdateExpression,
  LogicalExpression,
  ConditionalExpression,
  BaseCallExpression,
  CallExpression,
  SimpleCallExpression,
  NewExpression,
  MemberExpression,
  Pattern,
  BasePattern,
  SwitchCase,
  CatchClause,
  Identifier,
  Literal,
  SimpleLiteral,
  RegExpLiteral,
  BigIntLiteral,
  UnaryOperator,
  BinaryOperator,
  LogicalOperator,
  AssignmentOperator,
  UpdateOperator,
  ForOfStatement,
  Super,
  SpreadElement,
  ArrowFunctionExpression,
  YieldExpression,
  TemplateLiteral,
  TaggedTemplateExpression,
  TemplateElement,
  AssignmentProperty,
  ObjectPattern,
  ArrayPattern,
  RestElement,
  AssignmentPattern,
  Class,
  BaseClass,
  ClassBody,
  MethodDefinition,
  ClassDeclaration,
  ClassExpression,
  MetaProperty,
  ModuleDeclaration,
  BaseModuleDeclaration,
  ModuleSpecifier,
  BaseModuleSpecifier,
  ImportDeclaration,
  ImportSpecifier,
  ImportExpression,
  ImportDefaultSpecifier,
  ImportNamespaceSpecifier,
  ExportNamedDeclaration,
  ExportSpecifier,
  ExportDefaultDeclaration,
  ExportAllDeclaration,
  AwaitExpression,
} from "estree";

interface ExpressionHandleParams<E extends Expression, R, C> {
  expression: E;
  context: C;
  callback(expression: Expression, context: C): R;
}

interface ExpressionHandler<R, C> {
  onArrayExpression(params: ExpressionHandleParams<ArrayExpression, R, C>): R;
  onObjectExpression(params: ExpressionHandleParams<ObjectExpression, R, C>): R;
  onUnaryExpression(params: ExpressionHandleParams<UnaryExpression, R, C>): R;
  onBinaryExpression(params: ExpressionHandleParams<BinaryExpression, R, C>): R;
  onLogicalExpression(
    params: ExpressionHandleParams<LogicalExpression, R, C>
  ): R;
  onConditionalExpression(
    params: ExpressionHandleParams<ConditionalExpression, R, C>
  ): R;
  onMemberExpression(params: ExpressionHandleParams<MemberExpression, R, C>): R;
  onCallExpression(params: ExpressionHandleParams<SimpleCallExpression, R, C>): R;
  onTemplateLiteral(params: ExpressionHandleParams<TemplateLiteral, R, C>): R;
  onIdentifier(params: ExpressionHandleParams<Identifier, R, C>): R;
  onLiteral(params: ExpressionHandleParams<Literal, R, C>): R;
  onOtherExpression(params: ExpressionHandleParams<Expression, R, C>): R;
}

type SupportedExpression = Extract<
  Expression,
  {
    type:
      | "ArrayExpression"
      | "ObjectExpression"
      | "UnaryExpression"
      | "BinaryExpression"
      | "LogicalExpression"
      | "ConditionalExpression"
      | "MemberExpression"
      | "CallExpression"
      | "TemplateLiteral"
      | "Identifier"
      | "Literal";
  }
>;

/**
 *
 */
function newError(code: string, message: string) {
  const err = new Error(message);
  err.name = code;
  return err;
}

/**
 *
 */
function assertSupportedExpression(e: Node): asserts e is SupportedExpression {
  switch (e.type) {
    case "ArrayExpression":
    case "ObjectExpression":
    case "UnaryExpression":
    case "BinaryExpression":
    case "LogicalExpression":
    case "ConditionalExpression":
    case "MemberExpression":
    case "CallExpression":
    case "TemplateLiteral":
    case "Identifier":
    case "Literal":
      return;
    default:
      throw newError(
        "EXPRESSION_NOT_SUPPORTED",
        `${e.type} is not supported in the formula`
      );
  }
}

/**
 *
 */
function createExpressionHandler<R, C>(
  handler: ExpressionHandler<R, C>
): (expr: Expression, ctx: C) => R {
  const callback = (expression: Expression, context: C): R => {
    switch (expression.type) {
      case "ArrayExpression":
        return handler.onArrayExpression({ expression, context, callback });
      case "ObjectExpression":
        return handler.onObjectExpression({ expression, context, callback });
      case "UnaryExpression":
        return handler.onUnaryExpression({ expression, context, callback });
      case "BinaryExpression":
        return handler.onBinaryExpression({ expression, context, callback });
      case "LogicalExpression":
        return handler.onLogicalExpression({ expression, context, callback });
      case "ConditionalExpression":
        return handler.onConditionalExpression({
          expression,
          context,
          callback,
        });
      case "MemberExpression":
        return handler.onMemberExpression({ expression, context, callback });
      case "CallExpression":
        return handler.onCallExpression({ expression, context, callback });
      case "TemplateLiteral":
        return handler.onTemplateLiteral({ expression, context, callback });
      case "Identifier":
        return handler.onIdentifier({ expression, context, callback });
      case "Literal":
        return handler.onLiteral({ expression, context, callback });
      default:
        return handler.onOtherExpression({ expression, context, callback });
    }
  };
  return callback;
}

/**
 *
 */
const expressionValidator: ExpressionHandler<void, void> = {
  onArrayExpression({ expression, context, callback }) {
    for (const elem of expression.elements) {
      if (elem?.type === "SpreadElement") {
        callback(elem.argument, context);
      } else if (elem != null) {
        callback(elem, context);
      }
    }
  },

  onObjectExpression({ expression, context, callback }) {
    for (const prop of expression.properties) {
      if (prop.type === "SpreadElement") {
        callback(prop.argument, context);
      } else {
        assertSupportedExpression(prop.key);
        callback(prop.key, context);
        assertSupportedExpression(prop.value);
        callback(prop.value, context);
      }
    }
  },

  onUnaryExpression({ expression, context, callback }) {
    callback(expression.argument, context);
  },

  onBinaryExpression({ expression, context, callback }) {
    callback(expression.left, context);
    callback(expression.right, context);
  },

  onLogicalExpression({ expression, context, callback }) {
    callback(expression.left, context);
    callback(expression.right, context);
  },

  onConditionalExpression({ expression, context, callback }) {
    callback(expression.test, context);
    callback(expression.consequent, context);
    callback(expression.alternate, context);
  },

  onCallExpression({ expression, context, callback }) {
    const { callee, arguments: args } = expression;
    assertSupportedExpression(callee);
    callback(callee, context);
    for (const arg of args) {
      if (arg.type === "SpreadElement") {
        callback(arg.argument, context);
      } else {
        callback(arg, context);
      }
    }
  },

  onMemberExpression({ expression, context, callback }) {
    const { object, property } = expression;
    assertSupportedExpression(object);
    callback(object, context);
    assertSupportedExpression(property);
    callback(property, context);
  },

  onTemplateLiteral({ expression, context, callback }) {
    for (const expr of expression.expressions) {
      callback(expr, context);
    }
  },

  onIdentifier() {
    // noop
  },

  onLiteral() {
    // noop
  },

  onOtherExpression({ expression }) {
    throw newError(
      "EXPRESSION_NOT_SUPPORTED",
      `${expression.type} is not supported in the formula`
    );
  },
};

const validateExpression = createExpressionHandler(expressionValidator);

/**
 *
 */
const identifierExtractor: ExpressionHandler<string[], void> = {
  onArrayExpression({ expression, context, callback }) {
    return expression.elements.reduce((ids, elem) => {
      if (elem?.type === "SpreadElement") {
        return [...ids, ...callback(elem.argument, context)];
      } else if (elem != null) {
        return [...ids, ...callback(elem, context)];
      }
      return ids;
    }, [] as ReturnType<typeof callback>);
  },

  onObjectExpression({ expression, context, callback }) {
    return expression.properties.reduce((ids, prop) => {
      if (prop.type === "SpreadElement") {
        return [...ids, ...callback(prop.argument, context)];
      }
      assertSupportedExpression(prop.key);
      assertSupportedExpression(prop.value);
      return [
        ...ids,
        ...(prop.computed ? callback(prop.key, context) : []),
        ...callback(prop.value, context),
      ];
    }, [] as ReturnType<typeof callback>);
  },

  onUnaryExpression({ expression, context, callback }) {
    return callback(expression.argument, context);
  },

  onBinaryExpression({ expression, context, callback }) {
    return [
      ...callback(expression.left, context),
      ...callback(expression.right, context),
    ];
  },

  onLogicalExpression({ expression, context, callback }) {
    return [
      ...callback(expression.left, context),
      ...callback(expression.right, context),
    ];
  },

  onConditionalExpression({ expression, context, callback }) {
    return [
      ...callback(expression.test, context),
      ...callback(expression.consequent, context),
      ...callback(expression.alternate, context),
    ];
  },

  onCallExpression({ expression, context, callback }) {
    const { callee, arguments: args } = expression;
    assertSupportedExpression(callee);
    return [
      ...callback(callee, context),
      ...args.reduce((ids, arg) => {
        if (arg.type === "SpreadElement") {
          return [...ids, ...callback(arg.argument, context)];
        }
        return [...ids, ...callback(arg, context)];
      }, [] as ReturnType<typeof callback>),
    ];
  },

  onMemberExpression({ expression, context, callback }) {
    const { object, property, computed } = expression;
    assertSupportedExpression(object);
    assertSupportedExpression(property);
    return [
      ...callback(object, context),
      ...(computed ? callback(property, context) : []),
    ];
  },

  onTemplateLiteral({ expression, context, callback }) {
    return expression.expressions.reduce(
      (ids, expr) => [...ids, ...callback(expr, context)],
      [] as ReturnType<typeof callback>
    );
  },

  onIdentifier({ expression }) {
    return [expression.name];
  },

  onLiteral() {
    return [];
  },

  onOtherExpression({ expression }) {
    throw newError(
      "EXPRESSION_NOT_SUPPORTED",
      `${expression.type} is not supported in the formula`
    );
  },
};

const extractIdentifiers = createExpressionHandler(identifierExtractor);

function extractRootIdentifiers(expression: Expression): string[] {
  const identifiers = extractIdentifiers(expression);
  return Array.from(new Set(identifiers));
}

/**
 *
 */
type EvaluationContext = {
  context: { [name: string]: any };
  member?: boolean;
};

const expressionEvaluator: ExpressionHandler<any, EvaluationContext> = {
  onArrayExpression({ expression, context, callback }) {
    return expression.elements.reduce((elems, elem) => {
      if (elem?.type === "SpreadElement") {
        return [...elems, ...callback(elem.argument, context)];
      } else if (elem) {
        return [...elems, callback(elem, context)];
      }
      return elems;
    }, [] as Array<ReturnType<typeof callback>>);
  },

  onObjectExpression({ expression, context, callback }) {
    return expression.properties.reduce((obj, prop) => {
      if (prop.type === "SpreadElement") {
        return {
          ...obj,
          ...callback(prop.argument, context),
        };
      }
      assertSupportedExpression(prop.key);
      assertSupportedExpression(prop.value);
      const key = callback(
        prop.key,
        prop.computed ? context : { ...context, member: true }
      );
      const value = callback(prop.value, context);
      return { ...obj, [key]: value };
    }, {});
  },

  onUnaryExpression({ expression, context, callback }) {
    const argument = callback(expression.argument, context);
    const { operator } = expression;
    switch (operator) {
      case "-":
        return -argument;
      case "+":
        return +argument;
      case "!":
        return !argument;
      case "~":
        return ~argument; // eslint-disable-line no-bitwise
      case "typeof":
        return typeof argument;
      case "void":
        return undefined;
      default:
        throw newError(
          "INVALID_OPERATOR",
          `Invalid UnaryExpression operator: ${operator}`
        );
    }
  },

  onBinaryExpression({ expression, context, callback }) {
    const left = callback(expression.left, context);
    const right = callback(expression.right, context);
    const { operator } = expression;
    switch (operator) {
      case "==":
        return left == right; // eslint-disable-line eqeqeq
      case "!=":
        return left != right; // eslint-disable-line eqeqeq
      case "===":
        return left === right;
      case "!==":
        return left !== right;
      case "<":
        return left < right;
      case "<=":
        return left <= right;
      case ">":
        return left > right;
      case ">=":
        return left >= right;
      case "<<":
        return left << right; // eslint-disable-line no-bitwise
      case ">>":
        return left >> right; // eslint-disable-line no-bitwise
      case ">>>":
        return left >>> right; // eslint-disable-line no-bitwise
      case "+":
        return left + right;
      case "-":
        return left - right;
      case "*":
        return left * right;
      case "/":
        return left / right;
      case "%":
        return left % right;
      case "**":
        return left ** right;
      case "|":
        return left | right; // eslint-disable-line no-bitwise
      case "^":
        return left ^ right; // eslint-disable-line no-bitwise
      case "&":
        return left & right; // eslint-disable-line no-bitwise
      case "in":
        return left in right;
      case "instanceof":
        return left instanceof right;
      default:
        throw newError(
          "INVALID_OPERATOR",
          `Invalid BinaryExpression operator: ${operator}`
        );
    }
  },

  onLogicalExpression({ expression, context, callback }) {
    switch (expression.operator) {
      case "&&":
        return (
          callback(expression.left, context) &&
          callback(expression.right, context)
        );
      case "||":
        return (
          callback(expression.left, context) ||
          callback(expression.right, context)
        );
      default:
        throw newError(
          "INVALID_OPERATOR",
          `Invalid LogicalExpression operator: ${expression.operator}`
        );
    }
  },

  onConditionalExpression({ expression, context, callback }) {
    return callback(expression.test, context)
      ? callback(expression.consequent, context)
      : callback(expression.alternate, context);
  },

  onCallExpression({ expression, context, callback }) {
    const { callee } = expression;
    assertSupportedExpression(callee);
    const args = expression.arguments.reduce((args, arg) => {
      if (arg.type === "SpreadElement") {
        return [...args, ...callback(arg.argument, context)];
      }
      return [...args, callback(arg, context)];
    }, [] as typeof expression.arguments);
    if (callee.type === "MemberExpression") {
      assertSupportedExpression(callee.object);
      const object = callback(callee.object, context);
      const call = callback(callee, context);
      return call?.apply(object, args);
    } else {
      const call = callback(callee, context);
      return call?.apply(context, args);
    }
  },

  onMemberExpression({ expression, context, callback }) {
    assertSupportedExpression(expression.object);
    const object = callback(expression.object, context);
    assertSupportedExpression(expression.property);
    const property = callback(
      expression.property,
      expression.computed ? context : { ...context, member: true }
    );
    // disallow prototype / constructor access
    if (
      property === "prototype" ||
      property === "__proto__" ||
      property === "constructor"
    ) {
      return undefined;
    }
    const ret = object?.[property];
    return ret;
  },

  onTemplateLiteral({ expression, context, callback }) {
    let str = "";
    const { quasis, expressions } = expression;
    for (let i = 0; i < quasis.length; i++) {
      const quasi = expression.quasis[i];
      str += quasi.value.cooked;
      if (i < expressions.length) {
        const expression = expressions[i];
        str += callback(expression, context);
      }
    }
    return str;
  },

  onIdentifier({ expression, context }) {
    const { name } = expression;
    return context.member ? name : context.context[name];
  },

  onLiteral({ expression }) {
    return expression.value;
  },

  onOtherExpression({ expression }) {
    throw newError(
      "EXPRESSION_NOT_SUPPORTED",
      `${expression.type} is not supported in the formula`
    );
  },
};

const evaluateExpression = createExpressionHandler(expressionEvaluator);

/**
 *
 */
export function build(expression: Expression) {
  validateExpression(expression);
  return {
    expression,
    evaluate(context: { [name: string]: any } = {}) {
      return evaluateExpression(expression, { context });
    },
    identifiers: extractRootIdentifiers(expression),
  };
}

/**
 *
 */
export function parse(formula: string) {
  const expression: Expression = acorn.parseExpressionAt(formula, 0, {
    ecmaVersion: 9,
  }) as any;
  return build(expression);
}

/**
 *
 */
export function parseTemplate(templateStr: string) {
  return parse(`\`${templateStr}\``);
}

/**
 *
 */
export type {
  BaseNodeWithoutComments,
  BaseNode,
  Node,
  Comment,
  SourceLocation,
  Position,
  Program,
  Directive,
  BaseFunction,
  Function,
  Statement,
  BaseStatement,
  EmptyStatement,
  BlockStatement,
  ExpressionStatement,
  IfStatement,
  LabeledStatement,
  BreakStatement,
  ContinueStatement,
  WithStatement,
  SwitchStatement,
  ReturnStatement,
  ThrowStatement,
  TryStatement,
  WhileStatement,
  DoWhileStatement,
  ForStatement,
  BaseForXStatement,
  ForInStatement,
  DebuggerStatement,
  Declaration,
  BaseDeclaration,
  FunctionDeclaration,
  VariableDeclaration,
  VariableDeclarator,
  Expression,
  BaseExpression,
  ChainElement,
  ChainExpression,
  ThisExpression,
  ArrayExpression,
  ObjectExpression,
  PrivateIdentifier,
  Property,
  PropertyDefinition,
  FunctionExpression,
  SequenceExpression,
  UnaryExpression,
  BinaryExpression,
  AssignmentExpression,
  UpdateExpression,
  LogicalExpression,
  ConditionalExpression,
  BaseCallExpression,
  CallExpression,
  SimpleCallExpression,
  NewExpression,
  MemberExpression,
  Pattern,
  BasePattern,
  SwitchCase,
  CatchClause,
  Identifier,
  Literal,
  SimpleLiteral,
  RegExpLiteral,
  BigIntLiteral,
  UnaryOperator,
  BinaryOperator,
  LogicalOperator,
  AssignmentOperator,
  UpdateOperator,
  ForOfStatement,
  Super,
  SpreadElement,
  ArrowFunctionExpression,
  YieldExpression,
  TemplateLiteral,
  TaggedTemplateExpression,
  TemplateElement,
  AssignmentProperty,
  ObjectPattern,
  ArrayPattern,
  RestElement,
  AssignmentPattern,
  Class,
  BaseClass,
  ClassBody,
  MethodDefinition,
  ClassDeclaration,
  ClassExpression,
  MetaProperty,
  ModuleDeclaration,
  BaseModuleDeclaration,
  ModuleSpecifier,
  BaseModuleSpecifier,
  ImportDeclaration,
  ImportSpecifier,
  ImportExpression,
  ImportDefaultSpecifier,
  ImportNamespaceSpecifier,
  ExportNamedDeclaration,
  ExportSpecifier,
  ExportDefaultDeclaration,
  ExportAllDeclaration,
  AwaitExpression,
};
