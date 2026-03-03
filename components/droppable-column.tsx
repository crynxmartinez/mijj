"use client"

import { useDroppable } from "@dnd-kit/core"
import { ReactNode } from "react"

interface DroppableColumnProps {
  id: string
  children: ReactNode
  title: string
  count: number
  color: string
}

export function DroppableColumn({ id, children, title, count, color }: DroppableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <div className="space-y-4">
      <div className={`${color} p-4 rounded-lg ${isOver ? 'ring-2 ring-blue-500' : ''}`}>
        <h3 className="font-semibold text-lg mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{count} projects</p>
      </div>
      <div ref={setNodeRef} className="space-y-3 min-h-[200px]">
        {children}
      </div>
    </div>
  )
}
