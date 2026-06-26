import { useState, type ReactNode } from 'react'
import './DemoBlock.scss'

export interface DemoBlockProps {
  title: string
  description?: string
  code: string
  children: ReactNode
  defaultCodeOpen?: boolean
}

export function DemoBlock({
  title,
  description,
  code,
  children,
  defaultCodeOpen = false,
}: DemoBlockProps) {
  const [codeOpen, setCodeOpen] = useState(defaultCodeOpen)

  return (
    <article className="demo-block">
      <header className="demo-block__header">
        <h3 className="demo-block__title">{title}</h3>
        {description && <p className="demo-block__desc">{description}</p>}
      </header>
      <div className="demo-block__preview">{children}</div>
      <div className="demo-block__code-panel">
        <button
          type="button"
          className={`demo-block__code-toggle${codeOpen ? ' demo-block__code-toggle--open' : ''}`}
          aria-expanded={codeOpen}
          onClick={() => setCodeOpen((open) => !open)}
        >
          <span className="demo-block__code-toggle-icon" aria-hidden>
            {codeOpen ? '▾' : '▸'}
          </span>
          {codeOpen ? '隐藏代码' : '查看代码'}
        </button>
        {codeOpen && (
          <pre className="demo-block__code">
            <code>{code.trim()}</code>
          </pre>
        )}
      </div>
    </article>
  )
}
