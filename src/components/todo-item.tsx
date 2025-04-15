"use client"

import { useState } from "react"
import { Check, Trash2, Clock, AlertTriangle, Tag, MoreVertical, Edit2 } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Todo } from "./todo-app"
import EditTodoDialog from "./edit-todo-dialog"

interface TodoItemProps {
  todo: Todo
  onToggle: () => void
  onDelete: () => void
  onUpdate: (updates: Partial<Todo>) => void
}

export default function TodoItem({ todo, onToggle, onDelete, onUpdate }: TodoItemProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // Priority colors
  const priorityColors = {
    low: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
    medium: "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20",
    high: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
  }

  // Priority icons
  const PriorityIcon = todo.priority === "high" ? AlertTriangle : todo.priority === "medium" ? Clock : Tag

  // Format due date if exists
  const formattedDueDate = todo.dueDate ? format(new Date(todo.dueDate), "d MMM", { locale: id }) : null

  // Check if task is overdue
  const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed

  return (
    <>
      <div
        className={`
        flex items-center justify-between p-4 
        bg-card border rounded-xl shadow-sm
        transition-all duration-200
        ${todo.completed ? "opacity-70" : ""}
        hover:shadow-md
      `}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Button
            variant={todo.completed ? "default" : "outline"}
            size="icon"
            className="h-6 w-6 rounded-full shrink-0"
            onClick={onToggle}
          >
            {todo.completed && <Check className="h-3 w-3" />}
          </Button>

          <div className="flex flex-col min-w-0">
            <span
              className={`
              font-medium truncate
              ${todo.completed ? "line-through text-muted-foreground" : ""}
            `}
            >
              {todo.text}
            </span>

            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className={`text-xs px-2 py-0 h-5 ${priorityColors[todo.priority]}`}>
                <PriorityIcon className="h-3 w-3 mr-1" />
                {todo.priority === "low" ? "Rendah" : todo.priority === "medium" ? "Sedang" : "Tinggi"}
              </Badge>

              {todo.category && (
                <Badge variant="secondary" className="text-xs px-2 py-0 h-5">
                  {todo.category}
                </Badge>
              )}

              {formattedDueDate && (
                <Badge
                  variant="outline"
                  className={`text-xs px-2 py-0 h-5 ${isOverdue ? "bg-red-500/10 text-red-500" : ""}`}
                >
                  <Clock className="h-3 w-3 mr-1" />
                  {formattedDueDate}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
              <Edit2 className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onToggle}>
              <Check className="h-4 w-4 mr-2" />
              {todo.completed ? "Tandai belum selesai" : "Tandai selesai"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-red-500 focus:text-red-500">
              <Trash2 className="h-4 w-4 mr-2" />
              Hapus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <EditTodoDialog todo={todo} open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} onUpdate={onUpdate} />
    </>
  )
}
