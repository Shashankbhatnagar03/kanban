import { Droppable, Draggable } from "@hello-pangea/dnd";
import { ITask } from "@/models/task";

interface ColumnProps {
  title: string;
  tasks: ITask[];
  droppableId: string;
  onDelete: (id: string) => void; // Function to handle task deletion
}

const Column = ({ title, tasks, droppableId, onDelete }: ColumnProps) => {
  return (
    <div className="flex-1 bg-gray-100 rounded-lg shadow-lg p-4">
      <div className="flex gap-1 mb-4">
        <h2 className="text-xl font-semibold uppercase text-gray-700">
          {title}
        </h2>
      </div>
      <Droppable droppableId={droppableId}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="space-y-2"
          >
            {tasks.map((task, index) => (
              <Draggable key={task._id} draggableId={task._id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="bg-white p-4 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-xl flex justify-between items-center"
                  >
                    <span className="text-gray-800">{task.title}</span>
                    <button
                      onClick={() => onDelete(task._id)} // Call delete function
                      className="text-red-500 hover:text-red-700 transition duration-200"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;
