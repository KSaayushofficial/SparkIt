"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Clock,
  Bell,
  Filter,
  CheckCircle2,
  Circle,
  Trash2,
  Timer,
  Target,
} from "lucide-react";
import GlassPanel from "@/components/ui/GlassPanel";
import type { Todo } from "../types";

interface TodoSectionProps {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  onNotification: (notification: any) => void;
}

const priorities = ["low", "medium", "high"] as const;
const categories = [
  "Work",
  "Personal",
  "Health",
  "Learning",
  "Shopping",
  "Other",
];

export default function TodoSection({
  todos,
  setTodos,
  onNotification,
}: TodoSectionProps) {
  const [newTodo, setNewTodo] = useState("");
  const [newPriority, setNewPriority] = useState<"low" | "medium" | "high">(
    "medium"
  );
  const [newCategory, setNewCategory] = useState("Personal");
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [showCompleted, setShowCompleted] = useState(false);

  const addTodo = () => {
    if (!newTodo.trim()) return;

    const now = new Date();
    const alarmTime = new Date(now.getTime() + timerMinutes * 60 * 1000);

    const todo: Todo = {
      id: Date.now().toString(),
      text: newTodo.trim(),
      completed: false,
      priority: newPriority,
      category: newCategory,
      createdAt: now,
      timer: timerMinutes,
      isTimerRunning: true,
      alarm: alarmTime.toTimeString().slice(0, 5), // HH:MM format
      hasAlarm: true,
      tags: [],
      estimatedTime: timerMinutes,
    };

    const updatedTodos = [...todos, todo];
    setTodos(updatedTodos);

    // Show popup notification with task details
    onNotification({
      type: "success",
      title: "✅ Todo Added Successfully!",
      message: `Task: "${
        todo.text
      }" | Timer: ${timerMinutes} min | Alarm: ${alarmTime.toLocaleTimeString()}`,
    });

    // Reset form
    setNewTodo("");
    setNewPriority("medium");
    setNewCategory("Personal");
    setTimerMinutes(25);

    // Start the global timer for this todo
    if (typeof window !== "undefined" && (window as any).todoTimers) {
      (window as any).todoTimers.start(todo.id, timerMinutes * 60);
    }
  };

  const toggleTodo = (id: string) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        const updated = {
          ...todo,
          completed: !todo.completed,
          completedAt: !todo.completed ? new Date() : undefined,
        };

        // Stop timer if completed
        if (
          updated.completed &&
          typeof window !== "undefined" &&
          (window as any).todoTimers
        ) {
          (window as any).todoTimers.stop(id);
          updated.isTimerRunning = false;
        }

        return updated;
      }
      return todo;
    });
    setTodos(updatedTodos);

    const todo = todos.find((t) => t.id === id);
    if (todo && !todo.completed) {
      onNotification({
        type: "success",
        title: "🎉 Task Completed!",
        message: `Great job completing: "${todo.text}"`,
      });
    }
  };

  const deleteTodo = (id: string) => {
    // Stop any running timer
    if (typeof window !== "undefined" && (window as any).todoTimers) {
      (window as any).todoTimers.stop(id);
    }

    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);

    onNotification({
      type: "info",
      title: "🗑️ Task Deleted",
      message: "Task has been removed from your list",
    });
  };

  const startTimer = (todoId: string, minutes: number) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === todoId) {
        return { ...todo, isTimerRunning: true, timer: minutes };
      }
      return todo;
    });
    setTodos(updatedTodos);

    // Start global timer
    if (typeof window !== "undefined" && (window as any).todoTimers) {
      (window as any).todoTimers.start(todoId, minutes * 60);
    }
  };

  const stopTimer = (todoId: string) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === todoId) {
        return { ...todo, isTimerRunning: false };
      }
      return todo;
    });
    setTodos(updatedTodos);

    // Stop global timer
    if (typeof window !== "undefined" && (window as any).todoTimers) {
      (window as any).todoTimers.stop(todoId);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "from-red-500 to-pink-500";
      case "medium":
        return "from-yellow-500 to-orange-500";
      case "low":
        return "from-green-500 to-emerald-500";
      default:
        return "from-blue-500 to-cyan-500";
    }
  };

  const filteredTodos = todos.filter((todo) => {
    if (!showCompleted && todo.completed) return false;
    if (filterPriority !== "all" && todo.priority !== filterPriority)
      return false;
    if (filterCategory !== "all" && todo.category !== filterCategory)
      return false;
    return true;
  });

  const completedCount = todos.filter((todo) => todo.completed).length;
  const totalCount = todos.length;
  const activeTimers = todos.filter(
    (todo) => todo.isTimerRunning && !todo.completed
  ).length;

  return (
    <div className="h-full overflow-y-auto custom-scrollbar space-y-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Todo Manager
          </h1>
          <p className="text-white/70">
            Manage your tasks with focus timers and smart notifications
          </p>
        </div>

        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <GlassPanel className="p-4" glow>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-300 font-medium">Total Tasks</p>
                <p className="text-2xl font-bold text-white">{totalCount}</p>
              </div>
              <Circle className="h-8 w-8 text-blue-400" />
            </div>
          </GlassPanel>

          <GlassPanel className="p-4" glow>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-300 font-medium">Completed</p>
                <p className="text-2xl font-bold text-white">
                  {completedCount}
                </p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-400" />
            </div>
          </GlassPanel>

          <GlassPanel className="p-4" glow>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-300 font-medium">
                  Active Timers
                </p>
                <p className="text-2xl font-bold text-white">{activeTimers}</p>
              </div>
              <Timer className="h-8 w-8 text-orange-400" />
            </div>
          </GlassPanel>

          <GlassPanel className="p-4" glow>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-300 font-medium">
                  Completion
                </p>
                <p className="text-2xl font-bold text-white">
                  {totalCount > 0
                    ? Math.round((completedCount / totalCount) * 100)
                    : 0}
                  %
                </p>
              </div>
              <Target className="h-8 w-8 text-purple-400" />
            </div>
          </GlassPanel>
        </div>

        {/* Add Todo Form */}
        <GlassPanel className="p-6 mb-6" glow>
          <div className="flex items-center gap-2 mb-4">
            <Plus className="h-5 w-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">
              Add New Todo with Timer
            </h3>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Input
                  placeholder="What needs to be done?"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addTodo()}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 text-lg p-3"
                />
              </div>

              <Select
                value={newPriority}
                onValueChange={(value: any) => setNewPriority(value)}
              >
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={newCategory} onValueChange={setNewCategory}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="md:col-span-2">
                <div className="flex items-center gap-2">
                  <Timer className="h-4 w-4 text-blue-400" />
                  <span className="text-sm font-medium text-white">
                    Timer Duration:
                  </span>
                  <Input
                    type="number"
                    min="1"
                    max="480"
                    value={timerMinutes}
                    onChange={(e) =>
                      setTimerMinutes(Number.parseInt(e.target.value) || 25)
                    }
                    className="w-20 bg-white/10 border-white/20 text-white"
                  />
                  <span className="text-sm text-white/70">minutes</span>
                </div>
              </div>
            </div>

            <Button
              onClick={addTodo}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Todo with {timerMinutes}min Timer
            </Button>
          </div>
        </GlassPanel>

        {/* Filters */}
        <GlassPanel className="p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-white" />
              <span className="text-sm font-medium text-white">Filters:</span>
            </div>

            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                {priorities.map((priority) => (
                  <SelectItem key={priority} value={priority}>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant={showCompleted ? "default" : "outline"}
              size="sm"
              onClick={() => setShowCompleted(!showCompleted)}
              className={
                showCompleted
                  ? "bg-white/20 text-white"
                  : "border-white/20 text-white hover:bg-white/10"
              }
            >
              {showCompleted ? "Hide" : "Show"} Completed
            </Button>
          </div>
        </GlassPanel>

        {/* Todo List */}
        <div className="space-y-3">
          {filteredTodos.length === 0 ? (
            <GlassPanel className="p-8 text-center">
              <Circle className="h-12 w-12 mx-auto mb-4 text-white/30" />
              <p className="text-white/50">No todos found. Add one above!</p>
            </GlassPanel>
          ) : (
            filteredTodos.map((todo) => (
              <GlassPanel
                key={todo.id}
                id={`todo-${todo.id}`}
                className={`p-4 transition-all ${
                  todo.completed ? "opacity-60" : ""
                } ${
                  todo.isTimerRunning
                    ? "ring-2 ring-blue-400/50 shadow-lg shadow-blue-500/20"
                    : ""
                }`}
                glow={todo.isTimerRunning}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => toggleTodo(todo.id)}
                    className="mt-1 border-white/30 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={`font-medium text-white ${
                          todo.completed ? "line-through text-white/50" : ""
                        }`}
                      >
                        {todo.text}
                      </p>

                      <div className="flex items-center gap-2">
                        <Badge
                          className={`bg-gradient-to-r ${getPriorityColor(
                            todo.priority
                          )} text-white border-0`}
                        >
                          {todo.priority}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="border-white/30 text-white/80"
                        >
                          {todo.category}
                        </Badge>
                        {todo.isTimerRunning && (
                          <Badge className="bg-blue-500/30 text-blue-200 border-blue-400/50 animate-pulse">
                            <Timer className="h-3 w-3 mr-1" />
                            Running
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteTodo(todo.id)}
                          className="h-8 w-8 p-0 text-white/50 hover:text-red-400 hover:bg-red-500/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-2 text-sm text-white/60">
                      {todo.timer && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Timer: {todo.timer} min
                        </div>
                      )}

                      {todo.alarm && (
                        <div className="flex items-center gap-1">
                          <Bell className="h-3 w-3" />
                          Alarm: {todo.alarm}
                        </div>
                      )}

                      <div className="text-xs">
                        Added: {new Date(todo.createdAt).toLocaleString()}
                      </div>
                    </div>

                    {/* Timer Controls */}
                    {!todo.completed && (
                      <div className="flex gap-2 mt-3">
                        {!todo.isTimerRunning ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              startTimer(todo.id, todo.timer || 25)
                            }
                            className="text-green-400 border-green-400/50 hover:bg-green-500/20 hover:text-green-300"
                          >
                            <Timer className="h-3 w-3 mr-1" />
                            Start Timer
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => stopTimer(todo.id)}
                            className="text-red-400 border-red-400/50 hover:bg-red-500/20 hover:text-red-300"
                          >
                            <Timer className="h-3 w-3 mr-1" />
                            Stop Timer
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </GlassPanel>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
