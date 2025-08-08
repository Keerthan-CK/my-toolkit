"use client";

import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useLocalStorage } from "../hooks/useLocalStorage";
import TaskList from "../components/TaskList";
import Layout from "../components/TaskStruct.tsx";

type Task = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
  updatedAt: number;
};

export default function TasksPageClient() {
  const [tasks, setTasks] = useLocalStorage<Task[]>("tasks:v1", []);
  const [input, setInput] = useState("");

  function addTask() {
    if (!input.trim()) return;
    const t: Task = {
      id: uuidv4(),
      title: input.trim(),
      completed: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setTasks([t, ...tasks]);
    setInput("");
  }

  function toggle(id: string) {
    setTasks(
      tasks.map((t) =>
        t.id === id
          ? { ...t, completed: !t.completed, updatedAt: Date.now() }
          : t
      )
    );
  }

  function remove(id: string) {
    setTasks(tasks.filter((t) => t.id !== id));
  }

  return (
    <Layout title="Tasks">
      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-2xl font-semibold mb-4">Tasks</h1>

        <div className="flex gap-2 mb-4">
          <input
            className="flex-1 px-3 py-2 border rounded"
            placeholder="Quick add task..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
          />
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={addTask}
          >
            Add
          </button>
        </div>

        <TaskList tasks={tasks} onToggle={toggle} onRemove={remove} />
      </div>
    </Layout>
  );
}
