"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import type { Todo } from "./todo-app";

interface EditTodoDialogProps {
  todo: Todo;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (updates: Partial<Todo>) => void;
}

export default function EditTodoDialog({
  todo,
  open,
  onOpenChange,
  onUpdate,
}: EditTodoDialogProps) {
  const [text, setText] = useState(todo.text);
  const [priority, setPriority] = useState<"low" | "medium" | "high">(
    todo.priority
  );
  const [category, setCategory] = useState(todo.category || "");
  const [dueDate, setDueDate] = useState<Date | undefined>(
    todo.dueDate ? new Date(todo.dueDate) : undefined
  );

  // Update local state when todo changes
  useEffect(() => {
    setText(todo.text);
    setPriority(todo.priority);
    setCategory(todo.category || "");
    setDueDate(todo.dueDate ? new Date(todo.dueDate) : undefined);
  }, [todo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (text.trim()) {
      onUpdate({
        text,
        priority,
        category: category || undefined,
        dueDate: dueDate ? dueDate.toISOString() : undefined,
      });

      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Tugas</DialogTitle>
            <DialogDescription>
              Ubah detail tugas sesuai kebutuhan.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-task">Tugas</Label>
              <Input
                id="edit-task"
                value={text}
                onChange={(e) => setText(e.target.value)}
                autoFocus
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-category">Kategori (opsional)</Label>
              <Input
                id="edit-category"
                placeholder="Contoh: Pekerjaan, Pribadi, Belanja"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label>Prioritas</Label>
              <RadioGroup
                value={priority}
                onValueChange={(value: "low" | "medium" | "high") =>
                  setPriority(value)
                }
              >
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="low" id="edit-low" />
                    <Label htmlFor="edit-low" className="text-green-500">
                      Rendah
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="edit-medium" />
                    <Label htmlFor="edit-medium" className="text-orange-500">
                      Sedang
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high" id="edit-high" />
                    <Label htmlFor="edit-high" className="text-red-500">
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
                    className={`w-full justify-start text-left font-normal ${
                      !dueDate && "text-muted-foreground"
                    }`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate
                      ? format(dueDate, "PPP", { locale: id })
                      : "Pilih tanggal"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button type="submit">Simpan Perubahan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
