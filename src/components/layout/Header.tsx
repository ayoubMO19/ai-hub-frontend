import { APP_NAME } from '@/lib/constants'
import { useThemeStore } from '@/store/themeStore'

function Header() {
  const { theme, toggleTheme } = useThemeStore()

  return (
    <header className="border-b border-gray-200 dark:border-gray-700">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <h1 className="text-xl font-bold">{APP_NAME}</h1>
        <button
          onClick={toggleTheme}
          className="rounded bg-gray-200 px-4 py-2 text-sm dark:bg-gray-700"
        >
          {theme === 'dark' ? 'Light' : 'Dark'}
        </button>
      </div>
    </header>
  )
}

export default Header
