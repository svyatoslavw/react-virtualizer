import { useLayoutEffect, useMemo, useRef, useState } from "react"
import "./page.css"

const createItems = () =>
  Array.from({ length: 10_000 }, (_, index) => ({
    id: Math.random().toString(36).slice(2),
    text: String(index)
  }))

const Page = () => {
  const containerHeight = 400
  const itemHeight = 40
  const overscan = 3

  const [listItems, setListItems] = useState(() => createItems())
  const [scrollTop, setScrollTop] = useState(0)

  const scrollElementRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const scrollElement = scrollElementRef.current
    if (!scrollElement) return

    const handleScroll = () => {
      console.log(scrollElement.scrollTop)
      setScrollTop(scrollElement.scrollTop)
    }

    handleScroll()

    scrollElement.addEventListener("scroll", handleScroll)
    return () => {
      scrollElement.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const virtualItems = useMemo(() => {
    const startRange = scrollTop
    const endRange = scrollTop + containerHeight

    const startIdx = Math.max(0, Math.ceil(startRange / itemHeight) - overscan)
    const endIdx = Math.min(listItems.length - 1, Math.ceil(endRange / itemHeight) + overscan)

    const items = []

    for (let i = startIdx; i <= endIdx; i++) {
      items.push({
        index: i,
        key: `item-${i}`,
        offset: i * itemHeight,
        size: itemHeight
      })
    }

    return items
  }, [scrollTop, listItems.length])

  const listHeight = listItems.length * itemHeight

  return (
    <div className="container">
      <h1>List</h1>
      <div
        ref={scrollElementRef}
        style={{
          height: containerHeight,
          overflow: "auto",
          width: "300px",
          border: "1px solid lightgrey",
          position: "relative"
        }}
      >
        <div style={{ height: listHeight }}>
          {virtualItems.map((virtualItem) => {
            const item = listItems[virtualItem.index]
            return (
              <div
                key={item.id}
                style={{
                  height: "20px",
                  padding: "6px 12px",
                  position: "absolute",
                  top: virtualItem.offset,
                  left: 0
                }}
              >
                {item.text}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export { Page }

interface UseVirtualizerProps {
  count: number
  getScrollElement: () => HTMLElement | null
  estimateItemSize: () => number
  overscan: number
}

function useVirtualizer(props: UseVirtualizerProps) {
  const { count, getScrollElement, estimateItemSize, overscan } = props
}
