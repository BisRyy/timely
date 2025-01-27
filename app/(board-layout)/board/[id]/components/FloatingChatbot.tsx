"use client";

import { useState } from "react";
import { Button } from "@nextui-org/button";
import { Card } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import {
  IconMessageCircle,
  IconX,
  IconLoader2,
  IconMaximize,
  IconMinimize,
} from "@tabler/icons-react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

interface FloatingChatbotProps {
  boardId: string;
}

interface AnalysisRequest {
  type: "risk" | "full";
  boardId: string;
}

export const FloatingChatbot = ({ boardId }: FloatingChatbotProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [messages, setMessages] = useState<
    Array<{ role: "user" | "assistant"; content: string }>
  >([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/gemini/json", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: userMessage,
          boardId,
        }),
      });

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response },
      ]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalysis = async (type: "risk" | "full") => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/gemini/json", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt:
            type === "risk"
              ? "Provide a detailed risk assessment of this project in a well-formatted way. Include risk levels, impact, and mitigation strategies."
              : "Provide a comprehensive project analysis including timeline, resources, dependencies, risks, and overall health assessment.",
          boardId,
          analysisType: type,
        }),
      });

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response },
      ]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "fixed z-50",
        isFullScreen
          ? "inset-0 p-4 bg-black/20 backdrop-blur-sm z-[5000]"
          : "bottom-4 right-4"
      )}
    >
      {!isOpen ? (
        <Button
          isIconOnly
          color="primary"
          variant="solid"
          onClick={() => setIsOpen(true)}
          className="rounded-full h-12 w-12"
        >
          <IconMessageCircle className="h-6 w-6" />
        </Button>
      ) : (
        <Card
          className={cn(
            "flex flex-col",
            isFullScreen
              ? "w-full h-full max-w-5xl mx-auto"
              : "w-[400px] h-[500px]"
          )}
        >
          <div className="p-3 border-b flex justify-between items-center">
            <h3 className="font-semibold">Project Assistant</h3>
            <div className="flex gap-2">
              <Button
                isIconOnly
                variant="light"
                size="sm"
                onClick={() => setIsFullScreen(!isFullScreen)}
              >
                {isFullScreen ? (
                  <IconMinimize className="h-4 w-4" />
                ) : (
                  <IconMaximize className="h-4 w-4" />
                )}
              </Button>
              <Button
                isIconOnly
                variant="light"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                <IconX className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="p-2 border-b flex gap-2">
            <Button
              color="warning"
              variant="flat"
              size="sm"
              onClick={() => handleAnalysis("risk")}
              isDisabled={isLoading}
            >
              Risk Assessment
            </Button>
            <Button
              color="primary"
              variant="flat"
              size="sm"
              onClick={() => handleAnalysis("full")}
              isDisabled={isLoading}
            >
              Full Analysis
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "p-3 rounded-lg prose prose-sm max-w-none",
                  message.role === "user"
                    ? "bg-primary-100 ml-auto max-w-[80%]"
                    : "bg-gray-100 mr-auto max-w-[80%]"
                )}
              >
                {message.role === "assistant" ? (
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                ) : (
                  message.content
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 bg-gray-100 p-3 rounded-lg mr-auto max-w-[80%]">
                <IconLoader2 className="h-4 w-4 animate-spin" />
                Thinking...
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-3 border-t">
            <div className="flex gap-2">
              <Input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about project risks and analysis..."
                className="flex-1"
              />
              <Button color="primary" type="submit" isDisabled={isLoading}>
                Send
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
};
