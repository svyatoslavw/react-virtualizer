import { useMemo, useRef } from "react"
import { useVirtualizer } from "./use-visualizer"

const createItems = () =>
  Array.from({ length: 10_000 }, (_, index) => ({
    id: Math.random().toString(36).slice(2),
    text: String(index),
    size: 40 + Math.round(10 * Math.random())
  }))

const Virtualizer = () => {
  const scrollElementRef = useRef<HTMLDivElement>(null)
  const listItems = useMemo(() => createItems(), [])
  const estimateItemSize = (idx: number) => listItems[idx].size

  const { totalHeight, virtualItems } = useVirtualizer({
    estimateItemSize,
    count: listItems.length,
    getScrollElement: () => scrollElementRef.current
  })
  return (
    <div
      ref={scrollElementRef}
      style={{
        height: 600,
        overflow: "auto",
        width: "300px",
        border: "1px solid lightgrey",
        position: "relative"
      }}
    >
      <div style={{ height: totalHeight }}>
        {virtualItems.map((virtualItem) => {
          const item = listItems[virtualItem.index]
          return (
            <div
              key={item.id}
              style={{
                height: virtualItem.height,
                padding: "6px 12px",
                position: "absolute",
                top: 0,
                transform: `translateY(${virtualItem.offsetTop}px)`
              }}
            >
              {item.text}
              {/*{isScrolling ? "Scrolling..." : item.text}*/}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export { Virtualizer }
