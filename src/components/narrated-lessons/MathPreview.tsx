'use client';

import React from 'react';
import { astToPlainText, parseEvalExpr, type EvalAstNode } from '@/lib/math-evaluator/math-eval-parser';

function renderAstNode(node: EvalAstNode, parentPrec = 0): React.ReactNode {
  switch (node.type) {
    case 'number':
      return <span>{node.raw}</span>;
    case 'const':
      return <span className="italic">{node.name === 'pi' ? 'π' : node.name === 'inf' ? '∞' : 'e'}</span>;
    case 'var':
      return <span className="italic font-semibold">{node.name}</span>;
    case 'unary':
      return (
        <span>
          {node.op === '-' ? '−' : '+'}
          {renderAstNode(node.arg, 3)}
        </span>
      );
    case 'call':
      if (node.name === 'sqrt') {
        return (
          <span className="inline-flex items-baseline">
            <span aria-hidden="true" className="text-base leading-none">
              √
            </span>
            <span className="border-t border-slate-700 px-0.5">{renderAstNode(node.arg, 0)}</span>
          </span>
        );
      }
      if (node.name === 'abs') {
        return (
          <span className="inline-flex items-baseline">
            <span>|</span>
            {renderAstNode(node.arg, 0)}
            <span>|</span>
          </span>
        );
      }
      return (
        <span>
          <span className="font-medium">{node.name}</span>({renderAstNode(node.arg, 0)})
        </span>
      );
    case 'binary': {
      if (node.op === '/') {
        return (
          <span className="mx-1 inline-flex flex-col items-center align-middle text-[0.9em] leading-tight">
            <span className="border-b border-slate-700 px-1 pb-0.5">{renderAstNode(node.left, 0)}</span>
            <span className="px-1 pt-0.5">{renderAstNode(node.right, 0)}</span>
          </span>
        );
      }
      if (node.op === '^') {
        const needsParen = node.left.type === 'binary' || node.left.type === 'unary';
        return (
          <span className="inline-flex items-baseline">
            {needsParen ? <>({renderAstNode(node.left, 0)})</> : renderAstNode(node.left, 4)}
            <sup className="ml-0.5 text-[0.75em]">{renderAstNode(node.right, 0)}</sup>
          </span>
        );
      }
      const prec = node.op === '+' || node.op === '-' ? 1 : 2;
      const opSym = node.op === '+' ? ' + ' : node.op === '-' ? ' − ' : node.implicit ? '' : ' × ';
      const body = (
        <span>
          {renderAstNode(node.left, prec)}
          {opSym}
          {renderAstNode(node.right, prec + 1)}
        </span>
      );
      return prec < parentPrec ? <>({body})</> : body;
    }
  }
}

export interface MathPreviewProps {
  expression: string;
  allowedVariables?: string[];
  allowConstantC?: boolean;
  label?: string;
}

/**
 * Approved M1: Lightweight, zero-dependency AST-to-React mathematical previewer.
 * Zero KaTeX/Markdown/rehype-raw overhead and zero dangerouslySetInnerHTML.
 */
export function MathPreview({
  expression,
  allowedVariables = [],
  allowConstantC = false,
  label = 'Live formatted preview',
}: MathPreviewProps) {
  if (!expression.trim()) return null;

  let parsed: ReturnType<typeof parseEvalExpr> | null = null;
  let parseErr: string | null = null;
  try {
    parsed = parseEvalExpr(expression, { allowedVariables, allowConstantC, allowInfinity: true });
  } catch (e) {
    parseErr = e instanceof Error ? e.message : 'Invalid syntax';
  }

  return (
    <div
      aria-label={label}
      className="mt-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900"
    >
      {parsed ? (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="font-serif text-base tracking-wide" aria-hidden="true">
            {renderAstNode(parsed.ast)}
          </div>
          <span className="text-[11px] text-slate-500">
            Spoken: {astToPlainText(parsed.ast)}
          </span>
        </div>
      ) : (
        <p className="text-xs font-medium text-amber-800">{parseErr}</p>
      )}
    </div>
  );
}
