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
            <h3 className="itemTitle">{data.title}</h3>
            <p className="itemDescription">{data.description}</p>
            <p className="itemDate">{dateFormat(data.due_date, String(data.id))}</p>
        </div>
    </div>
);

export default TaskItem;

function dateFormat(date: string, id:string){
    if(!date) return;

    var due: Date = new Date(date);
    var now: Date = new Date();
    var parts = date.split("-");

    var diff = (due.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    const item = document.getElementById(id) as HTMLElement;
    if(item){
        console.log(due + " : " + diff)

        if(diff > 24*30)
            item.style.borderLeft = "5px solid lightgray";

        else if(diff > 24*7)
            item.style.borderLeft = "5px solid gray";
        
        else if(diff > 24*3)
            item.style.borderLeft = "5px solid yellow";

        else if(diff > 24)
            item.style.borderLeft = "5px solid orange";

        else
            item.style.borderLeft = "5px solid red";
    }

    return parts[1] + "/" + parts[2] + "/" + parts[0];
}