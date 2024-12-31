"use server";
import prisma from "@/db/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import {
  CreateTaskSchema,
  EditTaskSchema,
  DeleteTaskSchema,
} from "@/types/zodTypes";
import {
  TaskCreationData,
  TaskEditData,
  TaskDeletionData,
} from "@/types/types";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Create Task
export async function handleCreateTask(data: TaskCreationData) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return { success: false, message: "User is not authenticated" };
    }

    const parse = CreateTaskSchema.safeParse(data);

    if (!parse.success) {
      return { success: false, message: "Failed to create task" };
    }

    const maxOrderTask = await prisma.task.findFirst({
      where: { columnId: parse.data.columnId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const newOrder = (maxOrderTask?.order || 0) + 1;

    const createdTask = await prisma.task.create({
      data: {
        title: parse.data.taskTitle,
        description: parse.data.description,
        columnId: parse.data.columnId,
        order: newOrder,
        createdByUserId: userId,
      },
    });

    // Add activity logging
    if (createdTask) {
      await prisma.activity.create({
        data: {
          type: "TASK_CREATED",
          userId: userId,
          taskId: createdTask.id,
          boardId: parse.data.boardId,
          originalColumnId: parse.data.columnId,
        },
      });
    }

    revalidatePath(`/board/${parse.data.boardId}`);

    return { success: true, message: `Added task` };
  } catch (e) {
    return { success: false, message: `Failed to create task` };
  }
}

// EDIT TASK
export async function handleEditTask(data: TaskEditData) {
  const parse = EditTaskSchema.safeParse(data);

  if (!parse.success) {
    return { success: false, message: "Failed to edit task" };
  }

  try {
    await prisma.task.update({
      where: {
        id: parse.data.id,
      },
      data: {
        title: parse.data.title,
        description: parse.data.description,
      },
    });

    revalidatePath(`/board/${parse.data.boardId}`);
    //revalidatePath(`/task/${parse.data.id}`);

    return { success: true, message: `Edited task sucessfully!` };
  } catch (e) {
    return { success: false, message: `Failed to edit task` };
  }
}

// DELETE TASK
export async function handleDeleteTask(data: TaskDeletionData) {
  const parse = DeleteTaskSchema.safeParse(data);

  if (!parse.success) {
    return {
      success: false,
      message: "Failed to delete task due to validation error",
    };
  }

  try {
    const deletedTask = await prisma.task.delete({
      where: { id: parse.data.id },
      select: { order: true },
    });

    if (deletedTask) {
      await prisma.task.updateMany({
        where: {
          columnId: parse.data.columnId,
          order: { gt: deletedTask.order },
        },
        data: {
          order: { decrement: 1 },
        },
      });
    }

    revalidatePath(`/board/${parse.data.boardId}`);
    return { success: true, message: `Deleted task` };
  } catch (e) {
    return { success: false, message: "Failed to delete task" };
  }
}

// Add/update a date. NOTE: we expect a string since server actions need to be serialised
export async function handleAddDate(data: {
  taskId: string;
  date: string;
  boardId: string;
  dateType: "startDate" | "dueDate";
}) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!data.boardId || !data.taskId || !data.date || !userId) {
    return {
      success: false,
      message: `Board ID, Task ID, ${data.dateType}, or User ID is missing`,
    };
  }

  try {
    const dateObject = new Date(data.date);

    const existingTask = await prisma.task.findUnique({
      where: { id: data.taskId },
      select: { [data.dateType]: true },
    });

    await prisma.task.update({
      where: { id: data.taskId },
      data: { [data.dateType]: dateObject },
    });

    const activityType =
      existingTask && existingTask[data.dateType]
        ? data.dateType === "dueDate"
          ? "DUE_DATE_UPDATED"
          : "START_DATE_UPDATED"
        : data.dateType === "dueDate"
        ? "DUE_DATE_ADDED"
        : "START_DATE_ADDED";

    await prisma.activity.create({
      data: {
        type: activityType,
        taskId: data.taskId,
        userId: userId,
        [data.dateType]: dateObject,
      },
    });

    revalidatePath(`/board/${data.boardId}`);
    return {
      success: true,
      message: `${
        data.dateType.charAt(0).toUpperCase() + data.dateType.slice(1)
      } Updated`,
    };
  } catch (e) {
    return {
      success: false,
      message: `Failed to Update ${
        data.dateType.charAt(0).toUpperCase() + data.dateType.slice(1)
      }`,
    };
  }
}

// Remove a date.
export async function handleRemoveDate(data: {
  taskId: string;
  boardId: string;
  dateType: "startDate" | "dueDate";
}) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!data.boardId || !data.taskId || !userId) {
    return {
      success: false,
      message: `Board ID, Task ID, or User ID is missing`,
    };
  }

  try {
    await prisma.task.update({
      where: { id: data.taskId },
      data: { [data.dateType]: null },
    });

    const activityType =
      data.dateType === "dueDate" ? "DUE_DATE_REMOVED" : "START_DATE_REMOVED";

    await prisma.activity.create({
      data: {
        type: activityType,
        taskId: data.taskId,
        userId: userId,
      },
    });

    revalidatePath(`/board/${data.boardId}`);
    return {
      success: true,
      message: `${
        data.dateType.charAt(0).toUpperCase() + data.dateType.slice(1)
      } Removed`,
    };
  } catch (e) {
    return {
      success: false,
      message: `Failed to Remove ${
        data.dateType.charAt(0).toUpperCase() + data.dateType.slice(1)
      }`,
    };
  }
}

// DELETE TASK DESCRIPTION
export async function handleDeleteTaskDescription(
  taskId: string,
  boardId: string
) {
  try {
    await prisma.task.update({
      where: { id: taskId },
      data: { description: null },
    });

    revalidatePath(`/board/${boardId}`);

    return { success: true, message: "Description deleted successfully" };
  } catch (e) {
    return { success: false, message: "Failed to delete description" };
  }
}

export async function handleGetAssignee(taskId: string) {
  try {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      select: { assignedToId: true },
    });

    if (!task?.assignedToId) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: task?.assignedToId || "" },
      select: { id: true, name: true, image: true },
    });

    return user;
  } catch {
    return null;
  }
}

export async function handleAssignTask(data: {
  taskId: string;
  userId: string;
  userName: string;
}) {
  const session = await auth();
  const currentUserId = session?.user?.id;

  if (!data.taskId || !data.userId || !currentUserId) {
    return {
      success: false,
      message: "Task ID or User ID is missing",
    };
  }

  try {
    const task = await prisma.task.findUnique({
      where: { id: data.taskId },
      select: { assignedToId: true },
    });

    await prisma.task.update({
      where: { id: data.taskId },
      data: { assignedToId: data.userId },
    });

    // await prisma.activity.create({
    //   data: {
    //     type: currentUserId === data.userId ? "TASK_ASSIGNED_TO_SELF" : "TASK_ASSIGNED",
    //     taskId: data.taskId,
    //     userId: currentUserId,
    //     newAssignedToId: currentUserId === data.userId ? "self" : data.userName,
    //     oldAssignedToId: task?.assignedToId,
    //   },
    // });

    revalidatePath(`/task/${data.taskId}`);
    return { success: true, message: "Task assigned successfully" };
  } catch (e) {
    return { success: false, message: "Failed to assign task" };
  }
}

export async function handleRemoveTaskAssignee(data: { taskId: string }) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!data.taskId || !userId) {
    return {
      success: false,
      message: "Task ID, or Board ID is missing",
    };
  }

  try {
    const task = await prisma.task.findUnique({
      where: { id: data.taskId },
      select: { assignedToId: true },
    });

    await prisma.task.update({
      where: { id: data.taskId },
      data: { assignedToId: null },
    });

    // await prisma.activity.create({
    //   data: {
    //     type: "TASK_UNASSIGNED",
    //     taskId: data.taskId,
    //     userId: userId,
    //     oldAssignedToId: task?.assignedToId,
    //   },
    // });

    revalidatePath(`/task/${data.taskId}`);
    return { success: true, message: "Task unassigned successfully" };
  } catch (e) {
    return { success: false, message: "Failed to unassign task" };
  }
}

export async function handleGenerateDescriptionWithAI(taskTitle: string) {
  try {
    // Generate description with AI
    const result = await model.generateContent(`Write a paragraph description for a task titled "${taskTitle}"`);``
    console.log(taskTitle, result.response.text());

    return {
      success: true,
      description: result.response.text(),
      message: "Description generated successfully.",
    };
  } catch (e) {
    return { success: false, message: "Failed to generate description." };
  }
}
