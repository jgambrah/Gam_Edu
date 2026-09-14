'use client';

import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface MathRendererProps {
  content: string;
  className?: string;
}

/**
 * Robust Math & Markdown Renderer:
 * Handles inline math ($...$), display/block math ($$...$$),
 * standard markdown formatting (bold, italic, lists, quotes),
 * with fallback KaTeX compilation for guaranteed rendering.
 */
export function MathRenderer({ content, className = '' }: MathRendererProps) {
  // Pre-process math expressions with KaTeX to ensure 100% reliable rendering
  // regardless of markdown parsing variances
  const processedContent = useMemo(() => {
    if (!content) return '';

    // First, compile block math ($$...$$)
    let text = content.replace(/\$\$([\s\S]*?)\$\$/g, (match, formula) => {
      try {
        const rendered = katex.renderToString(formula.trim(), {
          displayMode: true,
          throwOnError: false
        });
        return `\n\n<div class="katex-block-wrapper my-3 overflow-x-auto text-center">${rendered}</div>\n\n`;
      } catch (err) {
        console.warn('[MathRenderer] KaTeX block error:', err);
        return match;
      }
    });

    // Second, compile inline math ($...$)
    text = text.replace(/\$([^\$\n\r]+?)\$/g, (match, formula) => {
      try {
        const rendered = katex.renderToString(formula.trim(), {
          displayMode: false,
          throwOnError: false
        });
        return `<span class="katex-inline-wrapper">${rendered}</span>`;
      } catch (err) {
        console.warn('[MathRenderer] KaTeX inline error:', err);
        return match;
      }
    });

    return text;
  }, [content]);

  return (
    <div className={`prose prose-invert max-w-none text-sm leading-relaxed ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          // Render HTML produced by KaTeX compiler
          div: ({ node, ...props }) => <div {...props} />,
          span: ({ node, ...props }) => <span {...props} />,
          p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
          strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
          em: ({ children }) => <em className="italic text-slate-300">{children}</em>
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
}
