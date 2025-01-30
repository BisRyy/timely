import { Task, Label, User } from "@prisma/client";
import { format } from "date-fns";
import {
  IconClock,
  IconClock12,
  IconFileDescription,
  IconGripVertical,
} from "@tabler/icons-react";
import { DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";
import Link from "next/link";
import TaskAssignee from "./TaskAssignee";
import { Avatar } from "@nextui-org/react";
// import TaskAssignee from "./TaskAssignee";

interface ExtendedTask extends Task {
  labels: Label[];
  assignedTo: User | null;
}

interface TaskItemProps {
  task: ExtendedTask;
  dragHandleProps: DraggableProvidedDragHandleProps | null;
}

export default function TaskItem({ task, dragHandleProps }: TaskItemProps) {
  const renderDateInfo = () => {
    const startDate = task.startDate
      ? format(new Date(task.startDate), "d MMM")
      : null;
    const dueDate = task.dueDate
      ? format(new Date(task.dueDate), "d MMM")
      : null;

    if (startDate && dueDate) {
      return `${startDate} - ${dueDate}`;
    } else if (startDate) {
      return `Started: ${startDate}`;
    } else if (dueDate) {
      return dueDate;
    } else {
      return null;
    }
  };

  const showInfo = () => {
    return (
      task.description ||
      task.startDate ||
      task.dueDate ||
      task.assignedToId ||
      task.timeEstimate
    );
  };

  return (
    <div className="bg-white flex select-none rounded-md ring-1 ring-zinc-200 hover:shadow-md hover:ring-2 hover:ring-primary">
      <div
        className="pl-1 pr-1 flex items-center cursor-grab touch-none"
        {...dragHandleProps}
      >
        <IconGripVertical className="text-primary" size={24} />
      </div>

      <Link className="flex-grow pr-3 py-2" href={`/task/${task.id}`}>
        {task.labels && task.labels.length > 0 && (
          <div className="grid grid-cols-5 gap-1 w-full mb-1">
            {task.labels.map((label) => (
              <span
                key={label.id}
                className={`text-white bg-${label.color}-500 text-xs h-5 w-full rounded-full align-middle justify-center flex p-x-2`}
              >
                {label.title === "Bug"
                  ? "🐞"
                  : label.title === "Feature"
                  ? "🚀"
                  : label.title === "Improvement"
                  ? "🔧"
                  : label.title === "Documentation"
                  ? "📚"
                  : label?.title && label?.title?.length > 6
                  ? label?.title?.substring(0, 6)
                  : label?.title}
              </span>
            ))}
          </div>
        )}

        <div className="text-sm cursor-pointer">{task.title}</div>

        {showInfo() && (
          <div className="flex gap-3 items-center mt-1 justify-between">
            <div className="flex gap-3 items-center mt-1">
              {renderDateInfo() && (
                <div className="flex items-center gap-1 text-xs text-zinc-500">
                  <IconClock size={14} /> {renderDateInfo()}
                </div>
              )}

              {task.description && (
                <div className="text-zinc-500">
                  <IconFileDescription size={14} />
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {task.assignedTo && (
                <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                  <IconClock12 size={14} />
                  <span>{task.timeEstimate || 1} hours</span>
                </div>
              )}

              {task.assignedToId && (
                <div className="flex items-center">
                  <Avatar
                    src={task.assignedTo?.image || ""}
                    alt={task.assignedTo?.name || "Assignee"}
                    size="sm"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </Link>
    </div>
  );
}
