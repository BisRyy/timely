"use client";
import { User, BoardMember } from "@prisma/client";
import { Select, SelectItem, Avatar } from "@nextui-org/react";
import {
  handleAssignTask,
  handleRemoveTaskAssignee,
} from "@/actions/TaskServerActions";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

type BoardMemberWithUser = BoardMember & {
  user: User;
};
export default function AssignTask({
  task,
  members,
}: {
  task: any;
  members: BoardMemberWithUser[];
}) {
  const [assignee, setAssignee] = useState<any>(null);

  useEffect(() => {
    setAssignee(task?.assignee);
  }, [task]);

  const handleUserSelect = (e: any) => {
    const user = members.find((member) => member.userId === e.target.value);
    if (user) {
      sendAssignRequest(user);
    } else {
      removeAssigne();
    }
  };

  const sendAssignRequest = async (user: any) => {
    try {
      const data = {
        taskId: task.id,
        userId: user.user.id,
        userName: user.user.name,
      };

      const response = await handleAssignTask(data);

      if (response.success) {
        toast.success(response.message);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      toast.error(
        `Failed to Assign Task to ${user.user.name}. Please try again.`
      );
    }
  };

  const removeAssigne = async () => {
    try {
      const data = {
        taskId: task.id,
      };

      const response = await handleRemoveTaskAssignee(data);

      if (response.success) {
        toast.success(response.message);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      toast.error("Failed to remove assignee. Please try again.");
    }
  };

  return (
    <li className="bg-zinc-200  hover:bg-zinc-300 rounded-md ring-2  hover:ring-primary">
      <Select
        fullWidth
        onChange={handleUserSelect}
        items={members}
        label="Assigned to"
        className="max-w-xs"
        variant="bordered"
        classNames={{
          label: "group-data-[filled=true]:-translate-y-5",
          trigger: "min-h-unit-16",
          listboxWrapper: "max-h-[400px]",
        }}
        listboxProps={{
          itemClasses: {
            base: [
              "rounded-md",
              "text-default-500",
              "transition-opacity",
              "data-[hover=true]:text-foreground",
              "data-[hover=true]:bg-default-100",
              "dark:data-[hover=true]:bg-default-50",
              "data-[selectable=true]:focus:bg-default-50",
              "data-[pressed=true]:opacity-70",
              "data-[focus-visible=true]:ring-default-500",
            ],
          },
        }}
        popoverProps={{
          classNames: {
            base: "before:bg-default-200",
            content: "p-0 border-small border-divider bg-background",
          },
        }}
        renderValue={(items) => {
          return items.map((item) => (
            <div key={item.key} className="flex items-center gap-2">
              <Avatar
                alt={item.data?.user.name || "User"}
                className="flex-shrink-0"
                size="sm"
                src={item.data?.user.image || "/images/default-avatar.png"}
              />
              <div className="flex flex-col">
                <span>{item.data?.user.name}</span>
                <span className="text-default-500 text-tiny">
                  {item.data?.user.email}
                </span>
              </div>
            </div>
          ));
        }}
      >
        {(member) => (
          <SelectItem key={member.user.id} textValue={member.user.name || ""}>
            <div className="flex gap-2 items-center">
              <Avatar
                alt={member.user.name || "User"}
                className="flex-shrink-0"
                size="sm"
                src={member.user.image || "/images/default-avatar.png"}
              />
              <div className="flex flex-col">
                <span className="text-small">{member.user.name}</span>
                <span className="text-tiny text-default-400">
                  {member.user.email}
                </span>
              </div>
            </div>
          </SelectItem>
        )}
      </Select>
    </li>
  );
}
