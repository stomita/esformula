/* @flow */

// ESTree AST specification is coming from the project: https://github.com/estree/estree

type Node_ = {
  // type: string;
  loc?: SourceLocation;
  range?: [number, number];
}

export type SourceLocation = {
  source?: string;
  start: Position;
  end: Position;
}

export type Position = {
  line: number;
  column: number;
}

export type Program = { // Node_
  type: 'Program',
  body: Array<Statement | ModuleDeclaration>;
  sourceType: string;
  loc?: SourceLocation;
  range?: [number, number];
}

type Function_ = { // Node_
  id?: Identifier;
  params: Array<Pattern>;
  body: BlockStatement | Expression;
  generator: boolean;
  loc?: SourceLocation;
  range?: [number, number];
}

type Statement_ = { // Node_
  loc?: SourceLocation;
  range?: [number, number];
}

export type EmptyStatement = { // Statement_
  type: 'EmptyStatement';
  loc?: SourceLocation;
  range?: [number, number];
}

export type BlockStatement = { // Statement_
  type: 'BlockStatement';
  body: Array<Statement>;
  loc?: SourceLocation;
  range?: [number, number];
}

export type ExpressionStatement = { // Statement_
  type: 'ExpressionStatement';
  expression: Expression;
  loc?: SourceLocation;
  range?: [number, number];
}

export type IfStatement = { // Statement_
  type: 'IfStatement';
  test: Expression;
  consequent: Statement;
  alternate?: Statement;
  loc?: SourceLocation;
  range?: [number, number];
}

export type LabeledStatement = { // Statement_
  type: 'LabeledStatement';
  label: Identifier;
  body: Statement;
  loc?: SourceLocation;
  range?: [number, number];
}

export type BreakStatement = { // Statement_
  type: 'BreakStatement';
  label?: Identifier;
  loc?: SourceLocation;
  range?: [number, number];
}

export type ContinueStatement = { // Statement_
  type: 'ContinueStatement';
  label?: Identifier;
  loc?: SourceLocation;
  range?: [number, number];
}

export type WithStatement = { // Statement_
  type: 'WithStatement';
  object: Expression;
  body: Statement;
  loc?: SourceLocation;
  range?: [number, number];
}

export type SwitchStatement = { // Statement_
  type: 'SwitchStatement';
  discriminant: Expression;
  cases: Array<SwitchCase>;
  loc?: SourceLocation;
  range?: [number, number];
}

export type ReturnStatement = { // Statement_
  type: 'ReturnStatement';
  argument?: Expression;
  loc?: SourceLocation;
  range?: [number, number];
}

export type ThrowStatement = { // Statement_
  type: 'ThrowStatement';
  argument: Expression;
  loc?: SourceLocation;
  range?: [number, number];
}

export type TryStatement = { // Statement_
  type: 'TryStatement';
  block: BlockStatement;
  handler?: CatchClause;
  finalizer?: BlockStatement;
  loc?: SourceLocation;
  range?: [number, number];
}

export type WhileStatement = { // Statement_
  type: 'WhileStatement';
  test: Expression;
  body: Statement;
  loc?: SourceLocation;
  range?: [number, number];
}

export type DoWhileStatement = { // Statement_
  type: 'DoWhileStatement';
  body: Statement;
  test: Expression;
  loc?: SourceLocation;
  range?: [number, number];
}

export type ForStatement = { // Statement_
  type: 'ForStatement';
  init?: VariableDeclaration | Expression;
  test?: Expression;
  update?: Expression;
  body: Statement;
  loc?: SourceLocation;
  range?: [number, number];
}

export type ForInStatement = { // Statement_{
  type: 'ForInStatement';
  left: VariableDeclaration | Expression;
  right: Expression;
  body: Statement;
  loc?: SourceLocation;
  range?: [number, number];
}

export type DebuggerStatement = { // Statement_
  type: 'DebuggerStatement';
  loc?: SourceLocation;
  range?: [number, number];
}

type Declaration_ = { // Statement_
  loc?: SourceLocation;
  range?: [number, number];
}

export type FunctionDeclaration = { // Function_ & Declaration_
  type: 'FunctionDeclaration';
  id: Identifier;
  params: Array<Pattern>;
  body: BlockStatement | Expression;
  generator: boolean;
  loc?: SourceLocation;
  range?: [number, number];
}

export type VariableDeclaration = { // Declaration_
  type: 'VariableDeclaration';
  declarations: Array<VariableDeclarator>;
  kind: string;
  loc?: SourceLocation;
  range?: [number, number];
}

export type VariableDeclarator = { // Node_
  type: 'VariableDeclarator';
  id: Pattern;
  init?: Expression;
  loc?: SourceLocation;
  range?: [number, number];
}

export type Expression_ = { // Node_
  loc?: SourceLocation;
  range?: [number, number];
}

export type ThisExpression = { // Expression_
  type: 'ThisExpression';
  loc?: SourceLocation;
  range?: [number, number];
}

export type ArrayExpression = { // Expression_
  type: 'ArrayExpression';
  elements: Array<Expression | SpreadElement>;
  loc?: SourceLocation;
  range?: [number, number];
}

export type ObjectExpression = { // Expression_
  type: 'ObjectExpression';
  properties: Array<Property | SpreadElement>;
  loc?: SourceLocation;
  range?: [number, number];
}

export type Property = { // Node_
  type: 'Property';
  key: Expression;
  value: Expression;
  kind: string;
  method: boolean;
  shorthand: boolean;
  computed: boolean;
  loc?: SourceLocation;
  range?: [number, number];
}

export type FunctionExpression = { // Function_ & Expression_
  type: 'FunctionExpression';
  id?: Identifier;
  params: Array<Pattern>;
  body: BlockStatement | Expression;
  generator: boolean;
  loc?: SourceLocation;
  range?: [number, number];
}

export type SequenceExpression = { // Expression_
  type: 'SequenceExpression';
  expressions: Array<Expression>;
  loc?: SourceLocation;
  range?: [number, number];
}

export type UnaryExpression = { // Expression_
  type: 'UnaryExpression';
  operator: UnaryOperator;
  prefix: boolean;
  argument: Expression;
  loc?: SourceLocation;
  range?: [number, number];
}

export type BinaryExpression = { // Expression_
  type: 'BinaryExpression';
  operator: BinaryOperator;
  left: Expression;
  right: Expression;
  loc?: SourceLocation;
  range?: [number, number];
}

export type AssignmentExpression = { // Expression_
  type: 'AssignmentExpression';
  operator: AssignmentOperator;
  left: Pattern | MemberExpression;
  right: Expression;
  loc?: SourceLocation;
  range?: [number, number];
}

export type UpdateExpression = { // Expression_
  type: 'UpdateExpression';
  operator: UpdateOperator;
  argument: Expression;
  prefix: boolean;
  loc?: SourceLocation;
  range?: [number, number];
}

export type LogicalExpression = { // Expression_
  type: 'LogicalExpression';
  operator: LogicalOperator;
  left: Expression;
  right: Expression;
  loc?: SourceLocation;
  range?: [number, number];
}

export type ConditionalExpression = { // Expression_
  type: 'ConditionalExpression';
  test: Expression;
  alternate: Expression;
  consequent: Expression;
  loc?: SourceLocation;
  range?: [number, number];
}

export type CallExpression = { // Expression_
  type: 'CallExpression';
  callee: Expression | Super;
  arguments: Array<Expression | SpreadElement>;
  loc?: SourceLocation;
  range?: [number, number];
}

export type NewExpression = { // CallExpression
  type: 'NewExpression';
  callee: Expression | Super;
  arguments: Array<Expression | SpreadElement>;
  loc?: SourceLocation;
  range?: [number, number];
}

export type MemberExpression = { // Expression_ & Pattern_
  type: 'MemberExpression';
  object: Expression | Super;
  property: Expression;
  computed: boolean;
  loc?: SourceLocation;
  range?: [number, number];
}

type Pattern_ = { // Node_
  loc?: SourceLocation;
  range?: [number, number];
}

export type SwitchCase = { // Node_
  type: 'SwitchCase';
  test?: Expression;
  consequent: Array<Statement>;
  loc?: SourceLocation;
  range?: [number, number];
}

export type CatchClause = { // Node_
  type: 'CatchClause';
  param: Pattern;
  body: BlockStatement;
  loc?: SourceLocation;
  range?: [number, number];
}

export type Identifier = { // Node_ & Expression_ & Pattern_
  type: 'Identifier';
  name: string;
  loc?: SourceLocation;
  range?: [number, number];
}

export type Literal = { // Node_ & Expression_
  type: 'Literal';
  value: string | boolean | number | RegExp | null;
  raw?: string;
  loc?: SourceLocation;
  range?: [number, number];
}

export type RegExpLiteral = { // Literal
  type: 'RegExpLiteral';
  value?: string | boolean | number | RegExp;
  regex: {
    pattern: string;
    flags: string;
  };
  loc?: SourceLocation;
  range?: [number, number];
}

export type UnaryOperator =
  "-" | "+" | "!" | "~" | "typeof" | "void" | "delete"

export type BinaryOperator =
    "==" | "!=" | "===" | "!=="
  | "<" | "<=" | ">" | ">="
  | "<<" | ">>" | ">>>"
  | "+" | "-" | "*" | "/" | "%"
  | "**"
  | "|" | "^" | "&" | "in"
  | "instanceof"

export type LogicalOperator = "||" | "&&"

export type AssignmentOperator =
    "=" | "+=" | "-=" | "*=" | "/=" | "%="
  | "**="
  | "<<=" | ">>=" | ">>>="
  | "|=" | "^=" | "&="

export type UpdateOperator = "++" | "--"

export type ForOfStatement = { // ForInStatement
  type: 'ForOfStatement';
  left: VariableDeclaration | Expression;
  right: Expression;
  body: Statement;
  loc?: SourceLocation;
  range?: [number, number];
}

export type Super = { // Node_
  type: 'Super';
  loc?: SourceLocation;
  range?: [number, number];
}

export type SpreadElement = { // Node_
  type: 'SpreadElement';
  argument: Expression;
  loc?: SourceLocation;
  range?: [number, number];
}

export type ArrowFunctionExpression = { // Function_ & Expression_
  type: 'ArrowFunctionExpression';
  id?: Identifier;
  params: Array<Pattern>;
  body: BlockStatement | Expression;
  generator: boolean;
  expression: boolean;
  loc?: SourceLocation;
  range?: [number, number];
}

export type YieldExpression = { // Expression_
  type: 'YieldExpression';
  argument?: Expression;
  delegate: boolean;
  loc?: SourceLocation;
  range?: [number, number];
}

export type TemplateLiteral = { // Expression_
  type: 'TemplateLiteral';
  quasis: Array<TemplateElement>;
  expressions: Array<Expression>;
  loc?: SourceLocation;
  range?: [number, number];
}

export type TaggedTemplateExpression = { // Expression_
  type: 'TaggedTemplateExpression';
  tag: Expression;
  quasi: TemplateLiteral;
  loc?: SourceLocation;
  range?: [number, number];
}

export type TemplateElement = { // Node_
  type: 'TemplateElement';
  tail: boolean;
  value: {
    cooked: string;
    raw: string;
  };
  loc?: SourceLocation;
  range?: [number, number];
}

export type AssignmentProperty = { // Property
  type: 'AssignmentProperty';
  key: Expression;
  value: Pattern;
  kind: string;
  method: boolean;
  shorthand: boolean;
  computed: boolean;
  loc?: SourceLocation;
  range?: [number, number];
}

export type ObjectPattern = { // Pattern_
  type: 'ObjectPattern';
  properties: Array<AssignmentProperty>;
  loc?: SourceLocation;
  range?: [number, number];
}

export type ArrayPattern = { // Pattern_
  type: 'ArrayPattern';
  elements: Array<Pattern>;
  loc?: SourceLocation;
  range?: [number, number];
}

export type RestElement = { // Pattern_
  type: 'RestElement';
  argument: Pattern;
  loc?: SourceLocation;
  range?: [number, number];
}

export type AssignmentPattern = { // Pattern_
  type: 'AssignmentPattern';
  left: Pattern;
  right: Expression;
  loc?: SourceLocation;
  range?: [number, number];
}

export type Class_ = { // Node_
  id?: Identifier;
  superClass: Expression;
  body: ClassBody;
  loc?: SourceLocation;
  range?: [number, number];
}

export type ClassBody = { // Node_
  body: Array<MethodDefinition>;
  loc?: SourceLocation;
  range?: [number, number];
}

export type MethodDefinition = { // Node_
  type: 'MethodDefinition';
  key: Expression;
  value: FunctionExpression;
  kind: string;
  computed: boolean;
  static: boolean;
  loc?: SourceLocation;
  range?: [number, number];
}

export type ClassDeclaration = { // Class_ & Declaration_
  type: 'ClassDeclaration';
  id: Identifier;
  superClass: Expression;
  body: ClassBody;
  loc?: SourceLocation;
  range?: [number, number];
}

export type ClassExpression = { // Class_ & Expression_
  type: 'ClassExpression';
  id?: Identifier;
  superClass: Expression;
  body: ClassBody;
  loc?: SourceLocation;
  range?: [number, number];
}

export type MetaProperty = { // Expression_
  type: 'MetaProperty';
  meta: Identifier;
  property: Identifier;
  loc?: SourceLocation;
  range?: [number, number];
}

type ModuleDeclaration_ = { // Node_
  loc?: SourceLocation;
  range?: [number, number];
}

type ModuleSpecifier_ = { // Node_
  local: Identifier;
  loc?: SourceLocation;
  range?: [number, number];
}

export type ImportDeclaration = { // ModuleDeclaration_
  type: 'ImportDeclaration';
  specifiers: Array<ImportSpecifier | ImportDefaultSpecifier | ImportNamespaceSpecifier>;
  source: Literal;
  loc?: SourceLocation;
  range?: [number, number];
}

export type ImportSpecifier = { // ModuleSpecifier_
  type: 'ImportSpecifier';
  imported: Identifier;
  loc?: SourceLocation;
  range?: [number, number];
}

export type ImportDefaultSpecifier = { // ModuleSpecifier_
  type: 'ImportDefaultSpecifier';
  loc?: SourceLocation;
  range?: [number, number];
}

export type ImportNamespaceSpecifier = { // ModuleSpecifier_
  type: 'ImportNamespaceSpecifier';
  loc?: SourceLocation;
  range?: [number, number];
}

export type ExportNamedDeclaration = { // ModuleDeclaration_
  type: 'ExportNamedDeclaration';
  declaration?: Declaration;
  specifiers: Array<ExportSpecifier>;
  source?: Literal;
  loc?: SourceLocation;
  range?: [number, number];
}

export type ExportSpecifier = { // ModuleSpecifier_
  type: 'ExportSpecifier';
  exported: Identifier;
  loc?: SourceLocation;
  range?: [number, number];
}

export type ExportDefaultDeclaration = { // ModuleDeclaration_
  type: 'ExportDefaultDeclaration';
  declaration: Declaration | Expression;
  loc?: SourceLocation;
  range?: [number, number];
}

export type ExportAllDeclaration = { // ModuleDeclaration_
  type: 'ExportAllDeclaration';
  source: Literal;
  loc?: SourceLocation;
  range?: [number, number];
}

export type Expression =
    ThisExpression
  | ArrayExpression
  | ObjectExpression
  | FunctionExpression
  | SequenceExpression
  | UnaryExpression
  | BinaryExpression
  | AssignmentExpression
  | UpdateExpression
  | LogicalExpression
  | ConditionalExpression
  | CallExpression
  | MemberExpression
  | Identifier
  | Literal
  | RegExpLiteral
  | ArrowFunctionExpression
  | YieldExpression
  | TemplateLiteral
  | TaggedTemplateExpression
  | ClassExpression
  | MetaProperty

export type Statement =
    EmptyStatement
  | BlockStatement
  | ExpressionStatement
  | IfStatement
  | LabeledStatement
  | BreakStatement
  | ContinueStatement
  | WithStatement
  | SwitchStatement
  | ReturnStatement
  | ThrowStatement
  | TryStatement
  | WhileStatement
  | DoWhileStatement
  | ForStatement
  | ForInStatement
  | ForOfStatement
  | DebuggerStatement
  | Declaration

export type ModuleDeclaration =
    ImportDeclaration
  | ExportNamedDeclaration
  | ExportDefaultDeclaration
  | ExportAllDeclaration

export type Declaration =
    FunctionDeclaration
  | VariableDeclaration
  | ClassDeclaration

export type Pattern =
    MemberExpression
  | Identifier
  | ObjectPattern
  | ArrayPattern
  | RestElement
  | AssignmentPattern