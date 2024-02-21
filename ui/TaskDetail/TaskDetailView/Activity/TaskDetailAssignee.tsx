import { IconUser } from "@tabler/icons-react";
import TaskDetailItemHeading from "../ui/TaskDetailItemHeading";
import TaskDetailItemContent from "../ui/TaskDetailItemContent";
import { ExpandedTask } from "@/types/types";

interface TaskDetailAssigneeProps {
  assignee: ExpandedTask["assignedTo"];
}

export default function TaskDetailAssignee({
  assignee,
}: TaskDetailAssigneeProps) {
  if (!assignee) {
    return (
      <>
        <TaskDetailItemHeading
          title="Assigned to"
          icon={<IconUser size={26} />}
        />
        <TaskDetailItemContent indented>
          <span>No One</span>
        </TaskDetailItemContent>
      </>
    );
  }

  return (
    <>
      <TaskDetailItemHeading title="Assigned to" icon={<IconUser size={26} />} />
      <TaskDetailItemContent indented>
        <div className="flex items-center gap-2">
          <img
            src={assignee.image || ""}
            alt="avatar"
            className="w-6 h-6 rounded-full"
          />
          <div className="flex flex-col">
            <span>{assignee.name}</span>
            <span className="text-default-500 text-tiny">
              {assignee.email}
            </span>
          </div>
        </div>
      </TaskDetailItemContent>
    </>
  );
}
