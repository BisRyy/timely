"use client";
import React from "react";
import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Input,
  Textarea,
} from "@nextui-org/react";
import { Board, Column, Task } from "@prisma/client";
import { handleGenerateTasksWithAI } from "@/actions/TaskServerActions";

type ExtendedColumn = Column & {
  tasks: Task[];
};

type ExtendedBoard = Board & {
  columns: ExtendedColumn[];
};

export default function PopupButton({ board }: { board: ExtendedBoard }) {
  const generateTasksWithAI = async () => {
    const description = "Generated with AI";
    const tasks = await handleGenerateTasksWithAI(
      board.id,
      JSON.stringify(board),
      2,
      description
    );
    console.log(tasks);
    alert(JSON.stringify(tasks));
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Popover>
        <PopoverTrigger>
          <Button>Open Popup</Button>
        </PopoverTrigger>
        <PopoverContent
          style={{
            padding: "1rem",
            display: "flex",
            gap: "1rem",
            width: "100%",
          }}
          className="bg-primary flex"
        >
          <div className="flex gap-1 items-center">
            <label htmlFor="generate tasks">Generate tasks with AI</label>
            <Textarea minRows={4} maxRows={5} id="generate tasks" />
            <div className="flex flex-col gap-1 items-center">
              <label htmlFor="count">Task Count</label>
              <Input id="count" placeholder="1" type="number" />
              <Button onClick={generateTasksWithAI}>Generate</Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
