import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export type FlowNodeType =
  | "youtube.search"
  | "youtube.upload"
  | "youtube.comment"
  | "youtube.analytics"
  | "llm.summarize"
  | "llm.translate"
  | "schedule.cron"
  | "http.request";

export const FLOW_NODE_TYPES: FlowNodeType[] = [
  "youtube.search",
  "youtube.upload",
  "youtube.comment",
  "youtube.analytics",
  "llm.summarize",
  "llm.translate",
  "schedule.cron",
  "http.request"
];

export interface FlowNode {
  id: string;
  type: FlowNodeType;
  name: string;
  config: Record<string, unknown>;
  description?: string;
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
}

export interface AgentFlow {
  name: string;
  goal: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isFlowNodeType(value: string): value is FlowNodeType {
  return (FLOW_NODE_TYPES as string[]).includes(value);
}

export function serializeFlow(flow: AgentFlow) {
  return JSON.stringify(flow, null, 2);
}

export function generateNodeLabel(node: FlowNode) {
  switch (node.type) {
    case "youtube.search":
      return "YouTube Search";
    case "youtube.upload":
      return "YouTube Upload";
    case "youtube.comment":
      return "Comment Automation";
    case "youtube.analytics":
      return "Performance Analytics";
    case "llm.summarize":
      return "AI Summarizer";
    case "llm.translate":
      return "AI Translator";
    case "schedule.cron":
      return "Scheduler";
    case "http.request":
      return "HTTP Request";
    default:
      return "Custom Node";
  }
}

export function defaultNodeConfig(type: FlowNodeType) {
  switch (type) {
    case "youtube.search":
      return {
        query: "trending AI tools",
        channelId: "",
        maxResults: 10
      };
    case "youtube.upload":
      return {
        titleTemplate: "{{title}}",
        descriptionTemplate: "{{description}}",
        privacyStatus: "public"
      };
    case "youtube.comment":
      return {
        strategy: "engagement",
        pattern: "Reply with insights and CTAs"
      };
    case "youtube.analytics":
      return {
        metrics: ["views", "watchTime", "subscribers"],
        days: 30
      };
    case "llm.summarize":
      return {
        prompt: "Summarize the transcript focusing on key takeaways",
        temperature: 0.3
      };
    case "llm.translate":
      return {
        targetLanguage: "es",
        style: "informal"
      };
    case "schedule.cron":
      return {
        cron: "0 9 * * *",
        timezone: "UTC"
      };
    case "http.request":
      return {
        method: "POST",
        url: "https://hooks.zapier.com/hooks/catch/...",
        headers: {
          "Content-Type": "application/json"
        },
        body: {
          payload: "{{data}}"
        }
      };
    default:
      return {};
  }
}

export function summarizeFlow(flow: AgentFlow) {
  const stages = flow.nodes
    .map((node) => `${generateNodeLabel(node)} → ${node.name}`)
    .join("\n");

  return `Goal: ${flow.goal}\nNodes:\n${stages}`;
}
