"use client"

import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { motion, AnimatePresence } from "framer-motion"
import { type RootState, TodoORM } from "./todo-app"
import TodoItem from "./todo-item"

interface TodoListProps {
  filter: "all" | "active" | "completed"
  searchQuery: string
}

export default function TodoList({ filter, searchQuery }: TodoListProps) {
  const dispatch = useDispatch()

  const todos = useSelector((state: RootState) => {
    let filteredTodos = []

    // First apply the tab filter
    switch (filter) {
      case "active":
        filteredTodos = TodoORM.getActive(state)
        break
      case "completed":
        filteredTodos = TodoORM.getCompleted(state)
        break
      default:
        filteredTodos = TodoORM.getAll(state)
    }

    // Then apply the search filter if there's a query
    if (searchQuery.trim()) {
      filteredTodos = filteredTodos.filter(
        (todo) =>
          todo.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
          todo.category?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Sort by priority and due date
    return filteredTodos.sort((a, b) => {
      // First by completion status
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1
      }

      // Then by priority
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      if (a.priority !== b.priority) {
        return priorityOrder[a.priority] - priorityOrder[b.priority]
      }

      // Then by due date if available
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      }

      // Finally by creation date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  })

  if (todos.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center justify-center py-12 text-center"
      >
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">📝</span>
        </div>
        <h3 className="text-xl font-medium mb-2">Tidak ada tugas</h3>
        <p className="text-muted-foreground">
          {filter === "all"
            ? "Tambahkan tugas baru untuk memulai"
            : filter === "active"
              ? "Semua tugas telah selesai"
              : "Belum ada tugas yang diselesaikan"}
        </p>
      </motion.div>
    )
  }

  return (
    <ul className="space-y-3">
      <AnimatePresence initial={false}>
        {todos.map((todo) => (
          <motion.li
            key={todo.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.2 }}
          >
            <TodoItem
              todo={todo}
              onToggle={() => TodoORM.toggle(todo.id, dispatch)}
              onDelete={() => TodoORM.delete(todo.id, dispatch)}
              onUpdate={(updates) => TodoORM.update(todo.id, updates, dispatch)}
            />
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  )
}