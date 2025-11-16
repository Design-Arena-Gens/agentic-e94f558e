import { type AgentFlow } from "./utils";

export const templateFlows: AgentFlow[] = [
  {
    name: "Evergreen Content Repurposer",
    goal: "Scale YouTube clips into shorts and newsletter content",
    nodes: [
      {
        id: "cron",
        type: "schedule.cron",
        name: "Weekly Trigger",
        config: { cron: "0 13 * * 1", timezone: "UTC" }
      },
      {
        id: "analytics",
        type: "youtube.analytics",
        name: "Surface Top Clips",
        config: { metrics: ["views", "watchTime"], days: 7 }
      },
      {
        id: "http",
        type: "http.request",
        name: "Grab Transcript",
        config: { method: "GET", url: "https://yt.agent/api/transcript" }
      },
      {
        id: "llm",
        type: "llm.summarize",
        name: "Spin Shorts Scripts",
        config: { prompt: "Write 60s short scripts", temperature: 0.5 }
      },
      {
        id: "upload",
        type: "youtube.upload",
        name: "Schedule Shorts",
        config: { privacyStatus: "private" }
      }
    ],
    edges: [
      { id: "e1", source: "cron", target: "analytics" },
      { id: "e2", source: "analytics", target: "http" },
      { id: "e3", source: "http", target: "llm" },
      { id: "e4", source: "llm", target: "upload" }
    ]
  },
  {
    name: "Audience Whisperer",
    goal: "Reply to community comments with AI-driven context",
    nodes: [
      {
        id: "cron",
        type: "schedule.cron",
        name: "Hourly Scan",
        config: { cron: "0 * * * *", timezone: "UTC" }
      },
      {
        id: "comments",
        type: "youtube.comment",
        name: "Fetch Mentions",
        config: { strategy: "questions" }
      },
      {
        id: "llm",
        type: "llm.summarize",
        name: "Response Drafts",
        config: { prompt: "Draft friendly replies", temperature: 0.4 }
      },
      {
        id: "http",
        type: "http.request",
        name: "n8n Webhook",
        config: { method: "POST", url: "https://n8n.cloud/webhook/reply" }
      }
    ],
    edges: [
      { id: "e1", source: "cron", target: "comments" },
      { id: "e2", source: "comments", target: "llm" },
      { id: "e3", source: "llm", target: "http" }
    ]
  },
  {
    name: "Launch Radar Alerts",
    goal: "Notify growth team when competitor launches videos",
    nodes: [
      {
        id: "cron",
        type: "schedule.cron",
        name: "15 Minute Poll",
        config: { cron: "*/15 * * * *", timezone: "UTC" }
      },
      {
        id: "search",
        type: "youtube.search",
        name: "Competitor Sweep",
        config: { query: "competitor channel", maxResults: 5 }
      },
      {
        id: "llm",
        type: "llm.summarize",
        name: "Why It Matters",
        config: { prompt: "Explain impact for growth team", temperature: 0.2 }
      },
      {
        id: "http",
        type: "http.request",
        name: "Slack Broadcast",
        config: { method: "POST", url: "https://hooks.slack.com/services/..." }
      }
    ],
    edges: [
      { id: "e1", source: "cron", target: "search" },
      { id: "e2", source: "search", target: "llm" },
      { id: "e3", source: "llm", target: "http" }
    ]
  }
];
