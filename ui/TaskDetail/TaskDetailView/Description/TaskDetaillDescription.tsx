"use client";
import { useState, useTransition } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import { EditTaskSchema } from "@/types/zodTypes";
import { ExpandedTask, TaskEditData } from "@/types/types";

import {
  handleEditTask,
  handleDeleteTaskDescription,
} from "@/actions/TaskServerActions";

import { Textarea } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { IconTextPlus, IconLoader2 } from "@tabler/icons-react";
import TaskDetailItemHeading from "../ui/TaskDetailItemHeading";
import TaskDetailItemContent from "../ui/TaskDetailItemContent";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export default function TaskDetailDescription({
  selectedTask,
  boardId,
}: {
  selectedTask: ExpandedTask;
  boardId: string;
}) {
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const toggleEditDescription = () =>
    setIsEditingDescription(!isEditingDescription);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<TaskEditData>({
    resolver: zodResolver(EditTaskSchema),
    defaultValues: {
      id: selectedTask.id,
      boardId,
      description: selectedTask.description,
    },
  });

  const onSubmit: SubmitHandler<TaskEditData> = async (data) => {
    const response = await handleEditTask(data);

    if (response.success) {
      toast.success("Description Updated");
      reset({ ...data, description: data.description });
      setIsEditingDescription(false);
    } else {
      toast.error(response.message);
    }
  };

  const handleDeleteDescription = async () => {
    const response = await handleDeleteTaskDescription(
      selectedTask.id,
      boardId
    );

    if (response.success) {
      toast.success(response.message);
      setIsEditingDescription(false);
      reset({ ...selectedTask, description: null });
    } else {
      toast.error(response.message);
    }
  };

  const handleGenerateDescription = async () => {
    setIsGenerating(true);
    // Generate description with AI
    try {
      const result = await model.generateContent("Explain how AI works");

      reset({ ...selectedTask, description: result.response.text() });
      toast.success("Description generated successfully");
    } catch (error) {
      toast.error("Failed to generate description");
    }
    setIsGenerating(false);
  };

  return (
    <>
      <TaskDetailItemHeading
        title="Description"
        icon={<IconTextPlus size={32} />}
      />
      <TaskDetailItemContent indented>
        {!isEditingDescription ? (
          <p onClick={toggleEditDescription} className="cursor-pointer">
            {selectedTask.description ? (
              selectedTask.description
            ) : (
              <span className="text-primary">Add a description</span>
            )}
          </p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <input type="hidden" {...register("id")} />
            <input type="hidden" {...register("boardId")} />
            <Textarea
              placeholder="Enter your description"
              autoFocus
              label="Description"
              defaultValue={selectedTask.description || ""}
              className="w-full mb-2 mt-1 border-none focus:outline-none"
              {...register("description")}
            />
            <div className="flex gap-2">
              <Button
                disabled={isGenerating}
                size="sm"
                color="secondary"
                onClick={handleGenerateDescription}
                className="flex justify-center items-center"
              >
                {isGenerating ? (
                  <>
                    <IconLoader2 size={16} className="animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  "Generate wit AI"
                )}
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                size="sm"
                color="primary"
                className="flex justify-center items-center"
              >
                {isSubmitting ? (
                  <>
                    <IconLoader2 size={16} className="animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  "Save"
                )}
              </Button>
              <Button size="sm" onClick={toggleEditDescription} type="button">
                Cancel
              </Button>
              {selectedTask.description && (
                <Button
                  size="sm"
                  onClick={handleDeleteDescription}
                  type="button"
                  color="danger"
                >
                  Delete
                </Button>
              )}
            </div>
          </form>
        )}
      </TaskDetailItemContent>
    </>
  );
}
