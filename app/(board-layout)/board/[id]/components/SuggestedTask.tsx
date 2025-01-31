import { Button } from "@nextui-org/button";
import { Card } from "@nextui-org/card";
import { IconPlus } from "@tabler/icons-react";

interface SuggestedTaskProps {
  task: {
    taskTitle: string;
    description: string;
    priority: string;
    estimatedTime: string;
    category: string;
  };
  onAdd: (task: any) => void;
}

export const SuggestedTask = ({ task, onAdd }: SuggestedTaskProps) => {
  return (
    <Card className="p-4 hover:bg-gray-50">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <h4 className="font-semibold">{task.taskTitle}</h4>
          <p className="text-sm text-gray-600 mt-1">{task.description}</p>
          <div className="flex gap-2 mt-2">
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                task.priority === "high"
                  ? "bg-red-100 text-red-700"
                  : task.priority === "medium"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {task.priority}
            </span>
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100">
              {task.estimatedTime || 1}h
            </span>
          </div>
        </div>
        <Button
          isIconOnly
          color="primary"
          variant="flat"
          onClick={() => onAdd(task)}
          className="self-start"
        >
          <IconPlus className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};
