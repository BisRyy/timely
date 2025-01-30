import { NextResponse } from "next/server";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

const schema = {
  description: "List of Actions",
  type: SchemaType.ARRAY,
  items: {
    type: SchemaType.OBJECT,
    properties: {
      taskTitle: { type: SchemaType.STRING, description: "Title" },
      description: { type: SchemaType.STRING, description: "Description" },
      boardId: { type: SchemaType.STRING, description: "Board ID" },
      columnId: { type: SchemaType.STRING, description: "Column ID" },
    },
    required: ["taskTitle", "boardId", "columnId"],
  },
};

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: schema,
  },
});

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json().catch(() => ({}));
    console.log(prompt, "prompt", process.env.GEMINI_API_KEY);
    const result = await model.generateContent(
      prompt ||
        "Create 2 tasks for the board 'Computer Security Assignment' with the following details: 1. Task title: Poo, Description: This task, titled 'Poo,' involves the meticulous cleaning and sanitization of a designated area contaminated with fecal matter.  This includes the safe removal and disposal of waste, thorough disinfection of affected surfaces using appropriate cleaning agents, and the proper disposal of all contaminated materials according to established hygiene protocols.  The goal is to restore the area to a safe and sanitary condition, eliminating all traces of fecal matter and associated odors.  Appropriate personal protective equipment (PPE) must be worn throughout the process. 2. Task title: Banana"
    );
    console.log(result, "result");
    return NextResponse.json({ response: JSON.parse(result.response.text()) });
  } catch (error) {
    console.log(error, "error");
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 }
    );
  }
}

const x = {
  id: "cm4zwy4kc0000k4u2cknrkbt2",
  title: "Computer Security Assignment",
  backgroundUrl:
    "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NjkxODN8MHwxfHNlYXJjaHw3fHxCb29rfGVufDB8MHx8fDE3MzQ4OTA5MDR8MA&ixlib=rb-4.0.3&q=80&w=1080",
  createdAt: "2024-12-22T17:59:55.548Z",
  updatedAt: "2024-12-31T04:50:11.410Z",
  columns: [
    {
      id: "cm4zwyg8d000ek4u2mbf7d8l7",
      title: "column 1",
      boardId: "cm4zwy4kc0000k4u2cknrkbt2",
      order: 1,
      createdAt: "2024-12-22T18:00:10.669Z",
      updatedAt: "2024-12-22T18:00:10.669Z",
      tasks: [
        {
          id: "cm4zwz76g000mk4u2ar7bwa2d",
          title: "Poo",
          description:
            'This task, titled "Poo," involves the meticulous cleaning and sanitization of a designated area contaminated with fecal matter.  This includes the safe removal and disposal of waste, thorough disinfection of affected surfaces using appropriate cleaning agents, and the proper disposal of all contaminated materials according to established hygiene protocols.  The goal is to restore the area to a safe and sanitary condition, eliminating all traces of fecal matter and associated odors.  Appropriate personal protective equipment (PPE) must be worn throughout the process.\n',
          dueDate: "2025-01-16T00:00:00.000Z",
          startDate: "2025-01-01T00:00:00.000Z",
          columnId: "cm4zwyg8d000ek4u2mbf7d8l7",
          order: 1,
          createdAt: "2024-12-22T18:00:45.592Z",
          updatedAt: "2025-01-25T14:10:30.966Z",
          assignedToId: "cm3j3biln0000u9ckt6qghizz",
          createdByUserId: "cm4zwozgy0000qmb8eemgw2vl",
          labels: [],
        },
        {
          id: "cm6ca62xc0007ascfgi4j5i1g",
          title: "Banana",
          description: null,
          dueDate: null,
          startDate: null,
          columnId: "cm4zwyg8d000ek4u2mbf7d8l7",
          order: 2,
          createdAt: "2025-01-25T14:22:58.128Z",
          updatedAt: "2025-01-25T14:22:58.128Z",
          assignedToId: null,
          createdByUserId: "cm3j3biln0000u9ckt6qghizz",
          labels: [],
        },
      ],
    },
    {
      id: "cm4zwypl5000gk4u2n088dfz1",
      title: "column 2",
      boardId: "cm4zwy4kc0000k4u2cknrkbt2",
      order: 2,
      createdAt: "2024-12-22T18:00:22.793Z",
      updatedAt: "2024-12-22T18:00:22.793Z",
      tasks: [],
    },
  ],
};
