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
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newStatus, setNewStatus] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const u = await getCurrentUser();
      if (!u) return;

      setUser(u);

      const data = await fetchTasks(u.id);
      setTasks(data || []);
      setLoading(false);
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

  const handleSubmit = async () => {
    if (!title.trim() || !user || !newStatus) return;

    try {
      const newTask = await createTask(title, newStatus, user.id, description, dueDate);
      setTasks(prev => [...prev, newTask]);

      setTitle("");
      setShowModal(false);
      setNewStatus(null);
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

            <button className="addTaskBtn" onClick={() => {
              setNewStatus(status);
              setShowModal(true);
            }}>
              + New Task
            </button>

            <Column
              status={status}
              tasks={getTasks(status)}
              onDropTask={handleDropTask}
              onDragStart={handleDragStart}
            />
          </div>
        ))}

        {showModal && (
          <div className="modalOverlay">
            <div className="modal">
              <h2 id="modalHeader">Create Task</h2>

              <input id="inputTitle"
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title"/>
              
              <input id="inputDescription"
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter task description"/>

              <input type="date" id="inputDate" 
                onChange={(e) => setDueDate(e.target.value)}
                placeholder="Enter task due date" />

              <div className="modalButtons">
                <button onClick={() => setShowModal(false)}>Cancel</button>
                <button onClick={handleSubmit}>Submit</button>
              </div>
            </div>
          </div>
        )}
    </div>
    
  );
};

export default App;