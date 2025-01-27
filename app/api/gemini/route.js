import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(req, res) {
  try {
    const { prompt } = req.body;
    const result = await model.generateContent(
      prompt || "Explain how AI works"
    );
    return NextResponse.status(200).json({ response: result.response.text() });
  } catch (error) {
    return NextResponse.status(500).json({
      error: "Failed to generate content",
    });
  }
}

export async function GET(req, res) {
  try {
    const result = await model.generateContent("Explain how AI works");
    return res(200).json({ response: result.response.text() });
  } catch (error) {
    return NextResponse.status(500).json({
      error: "Failed to generate content",
    });
  }
}
