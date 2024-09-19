// components/MarkdownRenderer.tsx
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; // For GitHub-flavored markdown (optional)
import rehypeRaw from 'rehype-raw'; // To support raw HTML in markdown (optional)

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="prose">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
