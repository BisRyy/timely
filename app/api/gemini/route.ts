import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import prisma from "@/db/prisma";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, boardId, analysisType, messages = [] } = body;

    const board = await prisma.board.findUnique({
      where: { id: boardId },
      include: {
        columns: {
          include: {
            tasks: true,
          },
        },
      },
    });

    if (!board) {
      return new NextResponse("Board not found", { status: 404 });
    }

    const boardContext = {
      title: board.title,
      columns: board.columns.map((column) => ({
        title: column.title,
        tasks: column.tasks.map((task) => ({
          title: task.title,
          description: task.description,
        })),
      })),
    };

    let systemPrompt = `
      You are a project management assistant specialized in risk assessment and project analysis.

      Previous conversation context:
      ${messages
        .map(
          (m: { role: string; content: string }) => `${m.role}: ${m.content}`
        )
        .join("\n")}

      Current mode: ${analysisType || "chat"}

      Current board context, only use this context if the user asks for it:
      ${JSON.stringify(boardContext, null, 2)}
    `;

    if (analysisType === "risk") {
      systemPrompt += `
        Focus on providing risk assessment analysis with:
        - Risk identification and classification
        - Impact analysis
        - Probability assessment
        - Mitigation strategies
        - Contingency plans
        Format responses using markdown for better readability.
      `;
    } else if (analysisType === "full") {
      systemPrompt += `
        Focus on providing comprehensive project analysis including:
        - Timeline assessment and milestones
        - Resource allocation and requirements
        - Task dependencies and critical path
        - Risk assessment overview
        - Overall project health and recommendations
        Format responses using markdown for better readability.
      `;
    } else {
      systemPrompt += `
        Provide conversational assistance while keeping in mind the project context.
        Be helpful and specific in your responses, referring to actual tasks and columns when relevant.
      `;
    }

    systemPrompt += `\nUser's current message: ${prompt}`;

    const result = await model.generateContent(systemPrompt);
    const response = result.response.text();

    return NextResponse.json({ response });
  } catch (error) {
    console.error("[GEMINI_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
