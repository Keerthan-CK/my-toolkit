// components/TaskList.tsx
import React from "react";


export type Task = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
  updatedAt: number;
};

type TaskListProps = {
  tasks: Task[];
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
};

export default function TaskList({ tasks, onToggle, onRemove }: TaskListProps) {
  if (!tasks.length) {
    return <p className="text-sm text-slate-500">No tasks yet.</p>;
  }

  return (
    <ul className="space-y-2">
      {tasks.map((t) => (
        <li
          key={t.id}
          className="flex items-center justify-between p-2 bg-white dark:bg-slate-800 rounded shadow"
        >
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={t.completed}
              onChange={() => onToggle(t.id)}
              className="w-4 h-4"
            />
            <span className={t.completed ? "line-through text-slate-400" : ""}>
              {t.title}
            </span>
          </div>
          <button
            onClick={() => onRemove(t.id)}
            className="text-red-500 hover:text-red-700"
          >
            ✕
          </button>
        </li>
      ))}
    </ul>
  );
}
