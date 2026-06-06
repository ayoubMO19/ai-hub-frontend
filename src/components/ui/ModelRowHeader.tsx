const desktopGrid = 'grid-cols-[3rem_1fr_7rem_7rem_7rem_5rem_auto_2.5rem]'

function ModelRowHeader() {
  return (
    <div className="sticky top-14 z-10 hidden border-b border-border bg-bg-primary/80 px-4 py-2 backdrop-blur-sm lg:block">
      <div className={`items-center gap-4 ${desktopGrid}`}>
        <span className="text-center font-mono text-xs font-medium uppercase tracking-wider text-text-muted">
          #
        </span>
        <span className="font-mono text-xs font-medium uppercase tracking-wider text-text-muted">
          Model
        </span>
        <span className="font-mono text-xs font-medium uppercase tracking-wider text-text-muted">
          Context
        </span>
        <span className="font-mono text-xs font-medium uppercase tracking-wider text-text-muted">
          Input
        </span>
        <span className="font-mono text-xs font-medium uppercase tracking-wider text-text-muted">
          Output
        </span>
        <span className="font-mono text-xs font-medium uppercase tracking-wider text-text-muted">
          Speed
        </span>
        <span className="font-mono text-xs font-medium uppercase tracking-wider text-text-muted">
          Features
        </span>
        <span />
      </div>
    </div>
  )
}

export default ModelRowHeader
