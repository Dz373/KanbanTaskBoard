interface TaskItemProps {
    data: any;
    drag: (e: React.DragEvent, id: string) => void;
}

const TaskItem = ({ data, drag }: TaskItemProps) => (
    <div 
        id={`${data.id}`}
        className="item" 
        draggable="true"
        onDragStart={(e) => drag(e, String(data.id))}>

        <div className="itemContent">
            <p className="itemTitle">{data.title}</p>
        </div>
    </div>
);

export default TaskItem;
