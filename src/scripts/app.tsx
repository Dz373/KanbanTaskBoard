import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom'; // Import this!
import { createRoot } from 'react-dom/client';
import supabase from './supabaseClient';
import TaskItem from './TaskItem';

const table = "test";

const App = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  function allowDrop(ev: DragEvent): void {
    ev.preventDefault();
  }
  async function drop(ev: DragEvent){
    ev.preventDefault();
    const column = (ev.target as HTMLElement).closest(".columnItems") as HTMLElement;
    const itemId = ev.dataTransfer?.getData("id");

    if (column && itemId) {
      const newStatus = column.id.replace("column", "");

      const previousTasks = [...tasks];
      setTasks(prev => prev.map(t => 
        String(t.id) === itemId ? { ...t, status: newStatus } : t
      ));

      const { error } = await supabase
        .from(table)
        .update({ status: newStatus })
        .eq('id', itemId);

      if (error) {
        console.error("Update failed, rolling back:", error.message);
        setTasks(previousTasks);
      }
    }
  }
  function drag(ev: DragEvent): void {
    const draggedItem = ev.target as HTMLElement;
    ev.dataTransfer?.setData("id", draggedItem.id.split("_")[1]);
  }

  useEffect(() => {
    const columns = document.querySelectorAll('.columnItems');
    columns.forEach(col => {
        col.addEventListener('dragover', allowDrop as any);
        col.addEventListener('drop', drop as any);
    });

    const initApp = async () => {
      let { data: { user: currentUser } } = await supabase.auth.getUser();

      if (!currentUser) {
        const { data: anonData } = await supabase.auth.signInAnonymously();
        currentUser = anonData?.user;
      }

      if (!currentUser) 
        return;

      setLoading(false);

      const { data: initialTasks } = await supabase
        .from(table)
        .select('*')
        .eq('user_id', currentUser.id);;
      
      if (initialTasks) 
        setTasks(initialTasks);

      const titleInput = document.getElementById('titleInput') as HTMLInputElement;
      const buttons = document.querySelectorAll('.createTaskBtn');

      const createTaskBtn = async (e: Event) => {
        const btn = e.currentTarget as HTMLButtonElement;
        const status = btn.id.replace("create", "");
        const title = titleInput.value;
        
        if (!title.trim()) 
          return;

        const { data, error } = await supabase
          .from(table)
          .insert([{ 
            title: title, 
            status: status,
            user_id: currentUser?.id 
          }])
          .select();

        if (data) {
          setTasks(prev => [...prev, data[0]]);
          
          titleInput.value = "";
          console.log(data[0]);
        }
        if (error)
          console.error(error.message);
      };

      buttons.forEach(btn => btn.addEventListener('click', createTaskBtn));

      return () => {
        columns.forEach(col => {
          col.removeEventListener('dragover', allowDrop as any);
          col.removeEventListener('drop', drop as any);
        });
        buttons.forEach(btn => btn.removeEventListener('click', createTaskBtn));
      };
    };

    initApp();
  }, []);

  const getTasksByStatus = (status: string) => tasks.filter(t => t.status.toLowerCase() === status.toLowerCase());
  
  const renderPortal = (status: string) => {
    const column = document.getElementById("column"+status);
    if (!column) 
      return null;

    return createPortal(
      getTasksByStatus(status).map(t => <TaskItem key={t.id} data={t} drag={drag as any} />),
      column
    );
  };

  if (loading) return <div>Loading</div>;
  return (
    <>
      {renderPortal('ToDo')}
      {renderPortal('InProgress')}
      {renderPortal('InReview')}
      {renderPortal('Done')}
    </>
  );
};

const container = document.createElement('div');
document.body.appendChild(container); 
createRoot(container).render(<App />);
