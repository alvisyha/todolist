"use client";

import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { type RootState, TodoORM, Todo } from "./todo-app";
import TodoItem from "./todo-item";
import { makeFilteredTodos } from "./todoSelectors";

interface TodoListProps {
  filter: "all" | "active" | "completed";
  searchQuery: string;
}

const filteredTodosSelector = makeFilteredTodos();

export default function TodoList({ filter, searchQuery }: TodoListProps) {
  const dispatch = useDispatch();

  const filteredTodos = useSelector((state: RootState) =>
    filteredTodosSelector(state, filter)
  );

  const searchLower = searchQuery.trim().toLowerCase();

  const todos = filteredTodos
    .filter(
      (todo) =>
        todo.text.toLowerCase().includes(searchLower) ||
        todo.category?.toLowerCase().includes(searchLower)
    )
    .sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;

      const priorityOrder = { high: 0, medium: 1, low: 2 };
      if (a.priority !== b.priority)
        return priorityOrder[a.priority] - priorityOrder[b.priority];

      if (a.dueDate && b.dueDate)
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

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
    );
  }

  return (
    <ul className="space-y-3">
      <AnimatePresence initial={false}>
        {todos.map((todo: Todo) => (
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
  );
}
