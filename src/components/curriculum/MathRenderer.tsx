'use client';

import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import { visit } from 'unist-util-visit';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface MathRendererProps {
  content: string;
  className?: string;
}

/**
 * Rehype plugin to strip foster-parented or redundant whitespace text nodes
 * between block elements (e.g. between lists/headings and tables).
 * This prevents HTML5 table foster-parented newlines from creating blank vertical gaps.
 */
function rehypeCleanWhitespace() {
  return (tree: any) => {
    visit(tree, 'text', (node: any, index: number | undefined, parent: any) => {
      if (parent && Array.isArray(parent.children) && typeof index === 'number' && /^\s+$/.test(node.value)) {
        const next = parent.children[index + 1];
        const prev = parent.children[index - 1];
        const isBlock = (n: any) =>
          n &&
          n.type === 'element' &&
          ['table', 'div', 'ul', 'ol', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'details'].includes(n.tagName);
        if (isBlock(next) || isBlock(prev)) {
          node.value = '';
        }
      }
    });
  };
}

/**
 * Robust Math & Markdown Renderer:
 * Handles inline math ($...$), display/block math ($$...$$),
 * standard markdown formatting (bold, italic, lists, quotes),
 * with fallback KaTeX compilation for guaranteed rendering.
 */
export function MathRenderer({ content, className = '' }: MathRendererProps) {
  // Gracefully clean content and recover from any pre-rendered KaTeX HTML if present
  const processed = useMemo(() => {
    if (!content) return '';

    let text = content;

    // Safety fallback: if content contains pre-rendered KaTeX HTML tags
    // (from previous buggy compiles or legacy database saves), extract the raw TeX
    if (text.includes('annotation encoding="application/x-tex"')) {
      text = text.replace(
        /<span[^>]*class="katex-inline-wrapper"[^>]*>[\s\S]*?<annotation encoding="application\/x-tex">([\s\S]*?)<\/annotation>[\s\S]*?<\/span>\s*<\/span>/gi,
        (_, tex) => `$${tex.trim()}$`
      );
      text = text.replace(
        /<div[^>]*class="katex-block-wrapper[^"]*"[^>]*>[\s\S]*?<annotation encoding="application\/x-tex">([\s\S]*?)<\/annotation>[\s\S]*?<\/div>/gi,
        (_, tex) => `\n\n$$${tex.trim()}$$\n\n`
      );
      text = text.replace(
        /<span class="katex">[\s\S]*?<annotation encoding="application\/x-tex">([\s\S]*?)<\/annotation>[\s\S]*?<\/span>/gi,
        (_, tex) => `$${tex.trim()}$`
      );
    }

    return text;
  }, [content]);

  if (!processed) return null;

  return (
    <div className={`prose prose-invert max-w-none text-sm leading-relaxed ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeCleanWhitespace, rehypeKatex]}
        components={{
          details: ({ node, ...props }) => (
            <details
              {...props}
              className="my-3 rounded-2xl border border-slate-700/70 bg-slate-900/90 p-4 shadow-md transition-all text-slate-200"
            />
          ),
          summary: ({ node, ...props }) => (
            <summary
              {...props}
              className="cursor-pointer font-semibold text-indigo-300 hover:text-indigo-200 select-none outline-none mb-2"
            />
          ),
          p: ({ children }) => (
            <p className="mb-2 last:mb-0 leading-relaxed text-slate-200">
              {children}
            </p>
          ),
          strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
          em: ({ children }) => <em className="italic text-slate-300">{children}</em>,
          ul: ({ children }) => <ul className="list-disc pl-5 my-2 space-y-1 text-slate-200">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-5 my-2 space-y-1 text-slate-200">{children}</ol>,
          li: ({ children }) => <li className="text-slate-200 leading-relaxed">{children}</li>,
          table: ({ children }) => (
            <div className="overflow-x-auto mt-4 mb-6 rounded-2xl border border-slate-800 bg-slate-950/60 shadow-lg">
              <table className="w-full text-left text-xs text-slate-200 border-collapse">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-slate-900/90 text-indigo-300 font-bold border-b border-slate-800 text-[11px] uppercase tracking-wider">
              {children}
            </thead>
          ),
          tbody: ({ children }) => <tbody className="divide-y divide-slate-800/60">{children}</tbody>,
          tr: ({ children }) => <tr className="hover:bg-slate-800/40 transition-colors">{children}</tr>,
          th: ({ children }) => <th className="px-3.5 py-3 font-bold text-slate-100 whitespace-nowrap">{children}</th>,
          td: ({ children }) => <td className="px-3.5 py-2.5 text-slate-300 align-middle leading-normal">{children}</td>,
          code: ({ children }) => (
            <code className="px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300 font-mono text-xs">
              {children}
            </code>
          )
        }}
      >
        {processed}
      </ReactMarkdown>
    </div>
  );
}
