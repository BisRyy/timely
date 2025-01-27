import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import prisma from "@/db/prisma";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, boardId } = body;

    // Fetch board data for context
    const board = await prisma.board.findUnique({
      where: { id: boardId },
      include: {
        columns: {
          include: {
            tasks: true
          }
        }
      }
    });

    if (!board) {
      return new NextResponse("Board not found", { status: 404 });
    }

    // Create context from board data
    const boardContext = {
      title: board.title,
      columns: board.columns.map(column => ({
        title: column.title,
        tasks: column.tasks.map(task => ({
          title: task.title,
          description: task.description
        }))
      }))
    };

    const aiPrompt = `
      You are a project management assistant specialized in risk assessment and project analysis.
      Current board context:
      ${JSON.stringify(boardContext, null, 2)}

      User message: ${prompt}

      Provide analysis, insights, and recommendations based on the board content.
      Focus on:
      1. Potential risks and mitigation strategies
      2. Project timeline analysis
      3. Resource allocation suggestions
      4. Dependencies between tasks
      5. Overall project health assessment
    `;

    const result = await model.generateContent(aiPrompt);
    const response = result.response.text();

    return NextResponse.json({ response });
  } catch (error) {
    console.error('[GEMINI_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
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
