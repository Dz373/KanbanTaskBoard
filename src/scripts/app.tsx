import React, { useEffect, useState } from 'react';
import {
  getCurrentUser,
  fetchTasks,
  createTask,
  updateTaskStatus
} from '../api/tasks';
import Column from './column';

const statuses = ["ToDo", "InProgress", "InReview", "Done"];

const App = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");

  useEffect(() => {
    const init = async () => {
      const u = await getCurrentUser();
      if (!u) return;

      setUser(u);

      const data = await fetchTasks(u.id);
      setTasks(data || []);
      setLoading(false);

      console.log(data);
    };

    init();
  }, []);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("id", id);
  };

  const handleDropTask = async (taskId: string, newStatus: string) => {
    const prev = [...tasks];

    setTasks(prevTasks =>
      prevTasks.map(t =>
        String(t.id) === taskId ? { ...t, status: newStatus } : t
      )
    );

    try {
      await updateTaskStatus(taskId, newStatus);
    } catch (err) {
      console.error("Rollback:", err);
      setTasks(prev);
    }
  };

  const handleCreate = async (status: string) => {
    if (!title.trim() || !user) 
      return;

    try {
      const newTask = await createTask(title, status, user.id);
      setTasks(prev => [...prev, newTask]);
      setTitle("");
    } catch (err) {
      console.error(err);
    }
  };

  const getTasks = (status: string) =>
    tasks.filter(t => t.status === status);

  if (loading) return <div>Loading...</div>;

  return (
    <div id="mainBody">
      {statuses.map(status => (
          <div className="column" key={status}>
            <h3 className="columnHeader">{status}</h3>

            <button onClick={() => handleCreate(status)}>
              New Task
            </button>

            <Column
              status={status}
              tasks={getTasks(status)}
              onDropTask={handleDropTask}
              onDragStart={handleDragStart}
            />
          </div>
        ))}
    </div>
  );
};

export default App;