import TaskItem from "./TaskItem";

type ColumnProps = {
  status: string;
  tasks: any[];
  onDropTask: (taskId: string, newStatus: string) => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
};

const Column = ({ status, tasks, onDropTask, onDragStart }: ColumnProps) => {
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const id = e.dataTransfer.getData("id");
        onDropTask(id, status);
    };

    return (
        <div
            id={status}
            className="columnItems"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}>

            {tasks.map(task => (
                <TaskItem key={task.id} data={task} drag={onDragStart as any} />
            ))}
        </div>
    );
};

export default Column;