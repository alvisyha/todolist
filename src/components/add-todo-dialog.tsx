"use client"

import type React from "react"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { TodoORM } from "./todo-app"

interface AddTodoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function AddTodoDialog({ open, onOpenChange }: AddTodoDialogProps) {
  const dispatch = useDispatch()
  const [text, setText] = useState("")
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium")
  const [category, setCategory] = useState("")
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (text.trim()) {
      TodoORM.create(
        {
          text,
          completed: false,
          priority,
          category: category || undefined,
          dueDate: dueDate ? dueDate.toISOString() : undefined,
        },
        dispatch,
      )

      // Reset form
      setText("")
      setPriority("medium")
      setCategory("")
      setDueDate(undefined)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Tambah Tugas Baru</DialogTitle>
            <DialogDescription>Buat tugas baru dengan detail lengkap.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="task">Tugas</Label>
              <Input
                id="task"
                placeholder="Masukkan tugas baru..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                autoFocus
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Kategori (opsional)</Label>
              <Input
                id="category"
                placeholder="Contoh: Pekerjaan, Pribadi, Belanja"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label>Prioritas</Label>
              <RadioGroup value={priority} onValueChange={(value) => setPriority(value as any)}>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="low" id="low" />
                    <Label htmlFor="low" className="text-green-500">
                      Rendah
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="medium" />
                    <Label htmlFor="medium" className="text-orange-500">
                      Sedang
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high" id="high" />
                    <Label htmlFor="high" className="text-red-500">
                      Tinggi
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div className="grid gap-2">
              <Label>Tenggat Waktu (opsional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${!dueDate && "text-muted-foreground"}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP", { locale: id }) : "Pilih tanggal"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit">Tambah Tugas</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
