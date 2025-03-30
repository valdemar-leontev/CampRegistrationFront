import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const MarkdownRenderer = ({ content }: { content: string }) => {
  const normalizedContent = content
    .replace(/\\n/g, '\n')
    .replace(/^- /gm, '• ')
    .trim();

  const paragraphs = normalizedContent.split('\n\n');

  return (
    <div className="markdown-content">
      {paragraphs.map((paragraph, index) => {
        const isList = paragraph.startsWith('• ');

        return (
          <div key={index} className={isList ? 'list-paragraph' : 'text-paragraph'}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ node, ...props }) => (
                  <p className="mb-3 whitespace-pre-wrap" {...props} />
                ),
                ul: ({ node, ...props }) => (
                  <ul className="list-disc pl-5 space-y-1 my-2" {...props} />
                ),
                li: ({ node, ...props }) => (
                  <li className="mb-1 whitespace-normal" {...props} />
                ),
                strong: ({ node, ...props }) => (
                  <strong className="font-semibold" {...props} />
                ),
                a: ({ node, href, ...props }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline transition-colors"
                    {...props}
                  />
                ),
              }}
            >
              {isList ? paragraph : paragraph.replace(/\n/g, '  \n')}
            </ReactMarkdown>
          </div>
        );
      })}
    </div>
  );
};