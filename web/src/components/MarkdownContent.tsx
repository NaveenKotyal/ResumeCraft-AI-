import ReactMarkdown from 'react-markdown';

interface Props {
  content: string;
  className?: string;
}

export function MarkdownContent({ content, className = '' }: Props) {
  return (
    <div className={`text-slate-300 leading-relaxed [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:mb-1 ${className}`}>
      <ReactMarkdown
        components={{
          ul: ({ children }) => <ul className="list-disc pl-6 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-6 space-y-1">{children}</ol>,
          p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
          strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
          h1: ({ children }) => <h2 className="text-xl font-semibold mt-4 mb-2">{children}</h2>,
          h2: ({ children }) => <h3 className="text-lg font-semibold mt-3 mb-1">{children}</h3>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
