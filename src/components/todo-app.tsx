"use client";

import { useState, useEffect } from "react";
import { Provider } from "react-redux";
import {
  configureStore,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { motion } from "framer-motion";
import { Search, Plus, Moon, Sun, Calendar } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import TodoList from "./todo-list";
import AddTodoDialog from "./add-todo-dialog";

// Define Todo type
export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  category?: string;
  dueDate?: string;
  createdAt: string;
}

// Slice
const todosSlice = createSlice({
  name: "todos",
  initialState: [] as Todo[],
  reducers: {
    addTodo: (state, action: PayloadAction<Omit<Todo, "id" | "createdAt">>) => {
      const newTodo: Todo = {
        id: Date.now(),
        ...action.payload,
        createdAt: new Date().toISOString(),
      };
      state.push(newTodo);
    },
    toggleTodo: (state, action: PayloadAction<number>) => {
      const todo = state.find((t) => t.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    updateTodo: (
      state,
      action: PayloadAction<{ id: number; updates: Partial<Todo> }>
    ) => {
      const todo = state.find((t) => t.id === action.payload.id);
      if (todo) Object.assign(todo, action.payload.updates);
    },
    deleteTodo: (state, action: PayloadAction<number>) => {
      return state.filter((t) => t.id !== action.payload);
    },
  },
});

export const { addTodo, toggleTodo, updateTodo, deleteTodo } =
  todosSlice.actions;

// ✅ Store harus wrap reducer di object
const store = configureStore({
  reducer: {
    todos: todosSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

// ORM-style helpers
export const TodoORM = {
  getAll: (state: RootState) => state.todos,
  getActive: (state: RootState) => state.todos.filter((t) => !t.completed),
  getCompleted: (state: RootState) => state.todos.filter((t) => t.completed),
  create: (
    todo: Omit<Todo, "id" | "createdAt">,
    dispatch: typeof store.dispatch
  ) => {
    dispatch(addTodo(todo));
  },
  update: (
    id: number,
    updates: Partial<Todo>,
    dispatch: typeof store.dispatch
  ) => {
    dispatch(updateTodo({ id, updates }));
  },
  toggle: (id: number, dispatch: typeof store.dispatch) => {
    dispatch(toggleTodo(id));
  },
  delete: (id: number, dispatch: typeof store.dispatch) => {
    dispatch(deleteTodo(id));
  },
};

// Main App
export default function TodoApp() {
  return (
    <Provider store={store}>
      <TodoAppContent />
    </Provider>
  );
}

// App UI
function TodoAppContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  const today = format(new Date(), "EEEE, d MMMM yyyy", { locale: id });

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <>
      <div className="w-full max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
              To Do List
            </h1>
            <p className="text-muted-foreground mt-1">{today}</p>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="mb-6 overflow-hidden border-none shadow-lg">
            <CardContent className="p-0">
              <div className="flex items-center p-4 bg-primary/5">
                <Search className="h-5 w-5 text-muted-foreground mr-2" />
                <Input
                  type="text"
                  placeholder="Cari tugas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <Button
                  onClick={() => setIsAddDialogOpen(true)}
                  className="ml-2 rounded-full"
                  size="sm"
                >
                  <Plus className="h-5 w-5 mr-1" />
                  Tambah
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardContent className="p-6">
              <Tabs defaultValue="all" className="w-full">
                <div className="flex items-center justify-between mb-6">
                  <TabsList className="grid grid-cols-3 w-[300px]">
                    <TabsTrigger value="all">Semua</TabsTrigger>
                    <TabsTrigger value="active">Aktif</TabsTrigger>
                    <TabsTrigger value="completed">Selesai</TabsTrigger>
                  </TabsList>
                  <div className="flex gap-2">
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <Calendar className="h-3 w-3" />
                      Hari Ini
                    </Badge>
                  </div>
                </div>

                {/* Jangan pakai AnimatePresence untuk TabsContent */}
                <TabsContent value="all" className="mt-0">
                  <TodoList filter="all" searchQuery={searchQuery} />
                </TabsContent>
                <TabsContent value="active" className="mt-0">
                  <TodoList filter="active" searchQuery={searchQuery} />
                </TabsContent>
                <TabsContent value="completed" className="mt-0">
                  <TodoList filter="completed" searchQuery={searchQuery} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <AddTodoDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
    </>
  );
}
