import TodoApp from "@/components/todo-app"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-muted py-12">
      <div className="container mx-auto px-4">
        <TodoApp />
      </div>
    </main>
  )
}