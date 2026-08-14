import { MDXComponents } from 'mdx/types';
import { ReactNode } from 'react';
import Image from 'next/image';

interface ProseProps {
  children: ReactNode
  className?: string
}

export function Prose({ children, className = '' }: ProseProps) {
  return (
    <div className={`prose max-w-none prose-headings:text-secondary prose-p:text-base-content/80 prose-strong:text-secondary prose-a:text-primary prose-li:text-base-content/80 ${className}`}>
      {children}
    </div>
  )
}

export const mdxComponents: MDXComponents = {
  h1: ({ children, ...props }) => (
    <h2 className="text-3xl text-secondary font-bold mb-4 mt-8 first:mt-0" {...props}>
      {children}
    </h2>
  ),
  h2: ({ children, ...props }) => (
    <h2 className="text-2xl text-secondary font-semibold mb-3 mt-6" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="text-xl text-secondary font-semibold mb-2 mt-4" {...props}>
      {children}
    </h3>
  ),
  p: ({ children, ...props }) => (
    <p className="text-base-content mb-4 leading-relaxed" {...props}>
      {children}
    </p>
  ),
  a: ({ children, href, ...props }) => (
    <a 
      href={href} 
      className="text-primary hover:text-accent underline" 
      {...props}
    >
      {children}
    </a>
  ),
  ul: ({ children, ...props }) => (
    <ul className="list-disc list-inside mb-4 space-y-1" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="list-decimal list-inside mb-4 space-y-1" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="text-secondary ml-4" {...props}>
      {children}
    </li>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote className="border-l-4 border-accent/60 bg-secondary/40 pl-4 italic my-4 rounded-md" {...props}>
      {children}
    </blockquote>
  ),
  code: ({ children, ...props }) => (
    <code className="bg-secondary/60 border border-accent/60 px-1 py-0.5 rounded text-sm font-mono" {...props}>
      {children}
    </code>
  ),
  pre: ({ children, ...props }) => (
    <pre className="bg-secondary/60 border border-accent/60 p-4 rounded-lg overflow-x-auto mb-4" {...props}>
      {children}
    </pre>
  ),
  hr: ({ ...props }) => (
    <hr className="border-primary/80 my-8" {...props} />
  ),
  img: ({ src, alt, ...props }) => (
    <Image 
      src={src} 
      alt={alt} 
      className="max-w-full h-auto rounded-lg my-4" 
      {...props} 
    />
  ),
}
