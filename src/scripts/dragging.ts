const columns = [...document.getElementsByClassName('columnItems') as HTMLCollectionOf<HTMLDivElement>];
const items = [...document.getElementsByClassName('item') as HTMLCollectionOf<HTMLDivElement>];

columns.forEach(col => {
    col.addEventListener('dragover', allowDrop);
    col.addEventListener('drop', drop);
});

items.forEach(item =>{
    item.addEventListener('dragstart', drag);
});


let draggedItem: HTMLElement;

function allowDrop(ev: DragEvent): void {
  ev.preventDefault();
}

function drag(ev: DragEvent): void {
  draggedItem = ev.target as HTMLElement;
}

function drop(ev: DragEvent): void {
  const body = ev.target as HTMLElement;
  
  if (body.className === "columnItems") {
    ev.preventDefault();
    body.appendChild(draggedItem);
  }
}
