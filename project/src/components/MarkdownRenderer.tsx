import React from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { Copy, Check, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';
import 'highlight.js/styles/github-dark.css';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = async (text: string, codeId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(codeId);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className={`prose prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={{
          // Custom code block component with copy functionality
          pre: ({ children, ...props }) => {
            const codeElement = React.Children.toArray(children)[0] as React.ReactElement;
            const codeContent = codeElement?.props?.children?.[0] || '';
            const language = codeElement?.props?.className?.replace('language-', '') || 'text';
            const codeId = `code-${Math.random().toString(36).substr(2, 9)}`;

            return (
              <div className="relative group">
                <div className="flex items-center justify-between bg-dark-card border border-dark-border rounded-t-lg px-4 py-2">
                  <span className="text-xs font-mono text-gray-400 uppercase">
                    {language}
                  </span>
                  <button
                    onClick={() => copyToClipboard(codeContent, codeId)}
                    className="flex items-center space-x-1 text-gray-400 hover:text-neon-green transition-colors opacity-0 group-hover:opacity-100"
                    title="Copy code"
                  >
                    {copiedCode === codeId ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span className="text-xs">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span className="text-xs">Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <pre 
                  {...props} 
                  className="!mt-0 !rounded-t-none bg-[#0d1117] border border-dark-border border-t-0 rounded-b-lg overflow-x-auto"
                >
                  {children}
                </pre>
              </div>
            );
          },
          
          // Custom code component for inline code
          code: ({ inline, children, ...props }: any) => {
            if (inline) {
              return (
                <code 
                  className="bg-dark-card text-neon-green px-1.5 py-0.5 rounded text-sm font-mono border border-dark-border"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return <code {...props}>{children}</code>;
          },

          // Custom image component with lazy loading and captions
          img: ({ src, alt, title, ...props }) => {
            const [imageLoaded, setImageLoaded] = useState(false);
            const [imageError, setImageError] = useState(false);

            return (
              <figure className="my-8">
                <div className="relative overflow-hidden rounded-lg border border-dark-border bg-dark-card">
                  {!imageLoaded && !imageError && (
                    <div className="flex items-center justify-center h-64 bg-dark-card">
                      <div className="flex items-center space-x-2 text-gray-400">
                        <ImageIcon className="w-6 h-6 animate-pulse" />
                        <span className="font-mono text-sm">Loading image...</span>
                      </div>
                    </div>
                  )}
                  
                  {imageError ? (
                    <div className="flex items-center justify-center h-64 bg-dark-card">
                      <div className="text-center text-gray-400">
                        <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p className="font-mono text-sm">Failed to load image</p>
                        <p className="font-mono text-xs text-gray-500 mt-1">{src}</p>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={src}
                      alt={alt || ''}
                      title={title}
                      loading="lazy"
                      className={`w-full h-auto transition-opacity duration-300 ${
                        imageLoaded ? 'opacity-100' : 'opacity-0'
                      }`}
                      onLoad={() => setImageLoaded(true)}
                      onError={() => setImageError(true)}
                      {...props}
                    />
                  )}
                </div>
                
                {(alt || title) && (
                  <figcaption className="mt-3 text-center text-sm text-gray-400 font-mono">
                    {title || alt}
                  </figcaption>
                )}
              </figure>
            );
          },

          // Custom heading components with anchor links
          h1: ({ children, ...props }) => (
            <h1 className="text-3xl font-bold text-white font-mono mb-6 mt-8 first:mt-0" {...props}>
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2 className="text-2xl font-bold text-white font-mono mb-4 mt-8" {...props}>
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3 className="text-xl font-bold text-white font-mono mb-3 mt-6" {...props}>
              {children}
            </h3>
          ),

          // Custom paragraph component
          p: ({ children, ...props }) => (
            <p className="text-gray-300 font-mono leading-relaxed mb-4" {...props}>
              {children}
            </p>
          ),

          // Custom list components
          ul: ({ children, ...props }) => (
            <ul className="list-disc list-inside text-gray-300 font-mono mb-4 space-y-1" {...props}>
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol className="list-decimal list-inside text-gray-300 font-mono mb-4 space-y-1" {...props}>
              {children}
            </ol>
          ),
          li: ({ children, ...props }) => (
            <li className="text-gray-300 font-mono" {...props}>
              {children}
            </li>
          ),

          // Custom blockquote component
          blockquote: ({ children, ...props }) => (
            <blockquote 
              className="border-l-4 border-neon-green bg-dark-card pl-4 py-2 my-6 italic text-gray-300 font-mono"
              {...props}
            >
              {children}
            </blockquote>
          ),

          // Custom table components
          table: ({ children, ...props }) => (
            <div className="overflow-x-auto my-6">
              <table className="w-full border-collapse border border-dark-border" {...props}>
                {children}
              </table>
            </div>
          ),
          th: ({ children, ...props }) => (
            <th className="border border-dark-border bg-dark-card px-4 py-2 text-left font-mono text-white" {...props}>
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td className="border border-dark-border px-4 py-2 font-mono text-gray-300" {...props}>
              {children}
            </td>
          ),

          // Custom link component
          a: ({ children, href, ...props }) => (
            <a 
              href={href}
              className="text-neon-green hover:text-neon-green/80 underline transition-colors"
              target={href?.startsWith('http') ? '_blank' : undefined}
              rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
              {...props}
            >
              {children}
            </a>
          ),

          // Custom horizontal rule
          hr: ({ ...props }) => (
            <hr className="border-dark-border my-8" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;