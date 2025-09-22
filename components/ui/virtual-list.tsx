"use client"

import type React from "react"

import { memo, useMemo, useCallback } from "react"
import { FixedSizeList as List } from "react-window"

interface VirtualListProps<T> {
  items: T[]
  height: number
  itemHeight: number
  renderItem: (item: T, index: number) => React.ReactNode
  className?: string
}

export const VirtualList = memo(function VirtualList<T>({
  items,
  height,
  itemHeight,
  renderItem,
  className = "",
}: VirtualListProps<T>) {
  const Row = useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => (
      <div style={style}>{renderItem(items[index], index)}</div>
    ),
    [items, renderItem],
  )

  const memoizedRow = useMemo(() => Row, [Row])

  return (
    <div className={className}>
      <List height={height} itemCount={items.length} itemSize={itemHeight} width="100%">
        {memoizedRow}
      </List>
    </div>
  )
})
