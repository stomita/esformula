// Type definitions for acorn,
// ESTree AST specification is coming from the project: https://github.com/estree/estree

import type { Program, Expression } from '../src/estree';

declare module 'acorn' {
  /**
   *
   */
  declare type AcornParseOptions = {
    ecmaVersion?: number,
    sourceType?: 'script' | 'module',
  };

  declare function parse(str: string, options?: AcornParseOptions): Program

  declare function parseExpressionAt(str: string, offset: number, options?: AcornParseOptions): Expression

}

