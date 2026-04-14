interface TaskItemProps {
    data: any;
    drag: React.DragEventHandler<HTMLDivElement>;
}

const TaskItem = ({ data, drag }: TaskItemProps) => (
    <div 
        id={`${data.user_id}_${data.id}`}
        className="item" 
        draggable="true"
        onDragStart={drag}>

        <div className="itemContent">
            <p className="itemTitle">{data.title}</p>
        </div>
    </div>
);

export default TaskItem;
