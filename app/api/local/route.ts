import { NextResponse } from "next/server";
import prisma from "@/db/prisma";

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
      Current board context:
      ${JSON.stringify(boardContext, null, 2)}
      
      User message: ${prompt}
    `;

    // Add mode-specific instructions
    if (analysisType) {
      systemPrompt += getModeInstructions(analysisType);
    }

    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "deepseek-r1:7b",
        prompt: systemPrompt,
        stream: false,
      }),
    });

    const data = await response.json();
    return NextResponse.json({ response: data.response });
  } catch (error) {
    console.error("[OLLAMA_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

function getModeInstructions(mode: string): string {
  const instructions = {
    dependencies: `
      Focus on analyzing task relationships and dependencies:
      - Identify dependencies between tasks
      - Determine the critical path
      - Suggest task sequencing
      - Highlight potential bottlenecks
      - Recommend parallel tasks
      Format your response in markdown with:
      1. A dependency matrix or list
      2. Critical path visualization
      3. Specific recommendations
    `,
    risk: `
      Focus on providing risk assessment analysis with:
      - Risk identification and classification
      - Impact analysis
      - Probability assessment
      - Mitigation strategies
      - Contingency plans
      Format responses using markdown for better readability.
    `,
    suggestions: `
      Focus on suggesting new tasks to enhance the project:
      - Analyze current project scope and tasks
      - Identify potential gaps or missing tasks
      - Suggest new tasks that would improve project completeness
      - Provide rationale for each suggested task
      - Include estimated complexity and priority
      Format your response in markdown.
    `,
    full: `
      Focus on providing comprehensive project analysis including:
      - Timeline assessment and milestones
      - Resource allocation and requirements
      - Task dependencies and critical path
      - Risk assessment overview
      - Overall project health and recommendations
      Format responses using markdown for better readability.
    `,
  };
  return instructions[mode as keyof typeof instructions] || "";
}
