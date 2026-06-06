import { Link } from 'react-router-dom'
import { APP_NAME } from '@/lib/constants'
import ThemeToggle from './ThemeToggle'

function scrollTo(id: string) {
  return () => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }
}

function Header() {
  return (
    <header className="sticky top-0 z-50 h-14 border-b border-border bg-bg-primary/80 backdrop-blur-sm">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4">
        {/* Left: logo */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-lg font-bold text-text-primary">{APP_NAME}</span>
          <span className="rounded-md bg-accent/15 px-1.5 py-0.5 font-mono text-[10px] font-medium leading-none text-accent">
            beta
          </span>
        </div>

        {/* Center: nav (hidden on mobile) */}
        <nav className="hidden items-center gap-6 md:flex">
          <button
            onClick={scrollTo('models')}
            className="text-sm text-text-secondary transition-colors hover:text-text-primary"
          >
            Models
          </button>
          <button
            onClick={scrollTo('rankings')}
            className="text-sm text-text-secondary transition-colors hover:text-text-primary"
          >
            Rankings
          </button>
          <Link
            to="/compare"
            className="text-sm text-text-secondary transition-colors hover:text-text-primary"
          >
            Compare
          </Link>
        </nav>

        {/* Right: actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button className="rounded-lg border border-border px-4 py-1.5 text-sm font-medium text-text-secondary transition-colors hover:border-accent hover:text-accent">
            Sign in
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
