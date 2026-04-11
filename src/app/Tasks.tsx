"use client";

import { useEffect, useState, FormEvent } from "react";

interface Task {
  id: number;
  content: string;
  created_at: string;
}

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch("/api/tasks")
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
        setIsLoading(false);
      });
  }, []);

  const addTask = async (e: FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/tasks/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    if (res.ok) {
      const newTask = await res.json();
      setTasks((prev) => [newTask, ...prev]);
      setContent("");
    }
  };

  const deleteTask = async (id: number) => {
    const res = await fetch("/api/tasks/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setTasks((prev) => prev.filter((task) => task.id !== id));
    }
  };

  return (
    <div>
      <form onSubmit={addTask}>
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className="text-black p-2 text-lg mr-6"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-blue-50 font-bold py-2 px-4 rounded"
        >
          Add Task
        </button>
      </form>
      
      {isLoading ? (
        <div className="flex text-xl pt-4 justify-center">Loading tasks...</div>
      ) : (
        <ul className="divide-y divide-gray-900 pt-4">
          {tasks.map((task) => (
            <li key={task.id} className="flex justify-between gap-x-6 py-5">
              {task.content}
              <button
                onClick={() => deleteTask(task.id)}
                className="border border-red-500 hover:border-red-700 text-red-500 hover:text-red-700 font-bold w-8 h-8 rounded "
              >
                ✖
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
