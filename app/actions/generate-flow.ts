"use server";

import OpenAI from "openai";
import { z } from "zod";
import {
  defaultNodeConfig,
  isFlowNodeType,
  type AgentFlow,
  type FlowNode,
  type FlowNodeType
} from "../lib/utils";

const suggestionSchema = z.object({
  name: z.string(),
  goal: z.string(),
  nodes: z.array(
    z.object({
      id: z.string(),
      type: z.string(),
      name: z.string(),
      description: z.string().optional(),
      config: z.record(z.any()).optional()
    })
  ),
  edges: z.array(
    z.object({
      id: z.string(),
      source: z.string(),
      target: z.string()
    })
  )
});

interface GenerateParams {
  goal: string;
  tone: string;
  channelId?: string;
  automationStyle: "growth" | "repurposing" | "alerts";
  includeLLM: boolean;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function generateFlowSuggestion(params: GenerateParams): Promise<AgentFlow> {
  const { goal, tone, channelId, automationStyle, includeLLM } = params;

  if (!process.env.OPENAI_API_KEY) {
    return buildFallbackFlow(params);
  }

  const prompt = `You are an n8n automation architect specialized in YouTube workflows.
Design a JSON payload with nodes and edges that could be imported into n8n to achieve the goal.
Constraints:
- Prefer YouTube API nodes, HTTP requests, Cron scheduling, and optional LLM nodes.
- Include at most 8 unique nodes.
- Respond strictly as JSON matching this schema:
{
  "name": string;
  "goal": string;
  "nodes": {
    "id": string;
    "type": string;
    "name": string;
    "description"?: string;
    "config"?: Record<string, unknown>;
  }[];
  "edges": {
    "id": string;
    "source": string;
    "target": string;
  }[];
}

Goal: ${goal}
Tone: ${tone}
Channel: ${channelId ?? "unknown"}
Automation focus: ${automationStyle}
Include LLM enhancement steps: ${includeLLM ? "yes" : "no"}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.4,
    max_tokens: 800,
    messages: [
      {
        role: "system",
        content:
          "You are an expert n8n automation architect. Respond strictly with valid JSON without code fences."
      },
      { role: "user", content: prompt }
    ]
  });

  const raw = completion.choices[0]?.message?.content ?? "{}";
  const text = raw
    .trim()
    .replace(/^```json\\s*/i, "")
    .replace(/^```\\s*/i, "")
    .replace(/```$/i, "")
    .trim();
  let parsedJson: unknown;

  try {
    parsedJson = JSON.parse(text);
  } catch (error) {
    return buildFallbackFlow(params);
  }

  const parsed = suggestionSchema.safeParse(parsedJson);

  if (!parsed.success) {
    return buildFallbackFlow(params);
  }

  return normalizeFlow(parsed.data);
}

function normalizeFlow(flow: z.infer<typeof suggestionSchema>): AgentFlow {
  const nodes: FlowNode[] = flow.nodes.map((node) => {
    const normalizedType: FlowNodeType = isFlowNodeType(node.type)
      ? node.type
      : "http.request";
    const config = node.config ?? defaultNodeConfig(normalizedType);

    return {
      id: node.id,
      name: node.name,
      type: normalizedType,
      description: node.description,
      config
    };
  });

  return {
    name: flow.name,
    goal: flow.goal,
    nodes,
    edges: flow.edges
  };
}

function buildFallbackFlow(params: GenerateParams): AgentFlow {
  const baseNodes: FlowNode[] = [
    {
      id: "schedule",
      type: "schedule.cron",
      name: "Daily Kickoff",
      description: "Trigger workflow every morning",
      config: defaultNodeConfig("schedule.cron")
    },
    {
      id: "youtube-search",
      type: "youtube.search",
      name: "Trend Pulse",
      description: "Discover fresh topics aligned with the goal",
      config: {
        ...defaultNodeConfig("youtube.search"),
        query: params.goal
      }
    },
    {
      id: "http-request",
      type: "http.request",
      name: "Fetch Transcript",
      description: "Grab the latest video transcript from the channel",
      config: defaultNodeConfig("http.request")
    }
  ];

  if (params.includeLLM) {
    baseNodes.push({
      id: "llm-summarize",
      type: "llm.summarize",
      name: "AI Summaries",
      description: "Summarize transcript for captions and shorts",
      config: defaultNodeConfig("llm.summarize")
    });
  }

  baseNodes.push({
    id: "analytics",
    type: "youtube.analytics",
    name: "Performance Review",
    description: "Monitor weekly metrics",
    config: defaultNodeConfig("youtube.analytics")
  });

  const edges = baseNodes.slice(1).map((node, index) => ({
    id: `edge-${index}`,
    source: baseNodes[index].id,
    target: node.id
  }));

  return {
    name: `${params.automationStyle} agent`.replace(/(^|\s)([a-z])/g, (_, space, letter) => `${space}${letter.toUpperCase()}`),
    goal: params.goal,
    nodes: baseNodes,
    edges
  };
}
