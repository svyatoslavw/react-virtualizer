import { useEffect, useLayoutEffect, useMemo, useState } from "react"

const DEFAULT_CONSTS = {
  OVERSCAN: 3,
  SCROLLING_DELAY: 150,
  INITIAL_INDEX: -1
}

interface UseVirtualizerProps {
  count: number
  estimateItemSize: (idx: number) => number
  getScrollElement: () => HTMLDivElement | null
  overscan?: number
}

export function useVirtualizer(props: UseVirtualizerProps) {
  const { getScrollElement, estimateItemSize, count, overscan = DEFAULT_CONSTS.OVERSCAN } = props

  const [isScrolling, setIsScrolling] = useState(false)
  const [scrollTop, setScrollTop] = useState(0)
  const [listHeight, setListHeight] = useState(0)

  useLayoutEffect(() => {
    const scrollElement = getScrollElement()
    if (!scrollElement) return

    const resizeObserver = new ResizeObserver(([entry]) => {
      const height =
        entry.borderBoxSize?.[0]?.blockSize ?? entry.target.getBoundingClientRect().height
      setListHeight(height)
    })
    resizeObserver.observe(scrollElement)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  useLayoutEffect(() => {
    const scrollElement = getScrollElement()
    if (!scrollElement) return

    const handleScroll = () => {
      const st = scrollElement.scrollTop
      console.log("[virtualizer] scroll event, scrollTop =", st)
      setScrollTop(st)
    }

    handleScroll()

    scrollElement.addEventListener("scroll", handleScroll)
    return () => {
      scrollElement.removeEventListener("scroll", handleScroll)
    }
  }, [])

  useEffect(() => {
    const scrollElement = getScrollElement()
    if (!scrollElement) return

    let timeoutId: NodeJS.Timeout | null = null

    const handleScroll = () => {
      setIsScrolling(true)

      if (timeoutId) clearTimeout(timeoutId)
      timeoutId = setTimeout(() => setIsScrolling(false), DEFAULT_CONSTS.SCROLLING_DELAY)
    }

    scrollElement.addEventListener("scroll", handleScroll)
    return () => {
      scrollElement.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const { virtualItems, totalHeight } = useMemo(() => {
    if (count === 0) return { virtualItems: [], totalHeight: 0 }

    const startRange = scrollTop
    const endRange = scrollTop + listHeight

    let totalHeight = 0
    let startIdx = DEFAULT_CONSTS.INITIAL_INDEX
    let endIdx = DEFAULT_CONSTS.INITIAL_INDEX

    const isInitialIndex = (index: number) => index === DEFAULT_CONSTS.INITIAL_INDEX

    const allRows: Array<{ key: string; index: number; height: number; offsetTop: number }> =
      new Array(count)

    for (let i = 0; i < count; i++) {
      const height = estimateItemSize(i)
      const row = { key: `row-${i}`, index: i, height, offsetTop: totalHeight }

      totalHeight += row.height
      allRows[i] = row

      if (isInitialIndex(startIdx) && row.offsetTop + row.height > startRange) {
        startIdx = Math.max(0, i - overscan)
      }

      if (isInitialIndex(endIdx) && row.offsetTop + row.height >= endRange) {
        endIdx = Math.min(count - 1, i + overscan)
      }
    }

    const finalStartIdx = isInitialIndex(startIdx) ? 0 : startIdx
    const finalEndIdx = isInitialIndex(endIdx) ? undefined : endIdx + 1

    const rows = allRows.slice(finalStartIdx, finalEndIdx)

    return { virtualItems: rows, totalHeight }
  }, [scrollTop, estimateItemSize, listHeight, count, overscan])

  return { virtualItems, totalHeight, isScrolling }
}
