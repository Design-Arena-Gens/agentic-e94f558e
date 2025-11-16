"use client";

import { motion } from "framer-motion";
import { Loader2, Rocket, Settings, Youtube } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { generateFlowSuggestion } from "./actions/generate-flow";
import { FlowCanvas } from "./components/flow-canvas";
import { FlowExporter } from "./components/flow-exporter";
import { TemplateGallery } from "./components/template-gallery";
import { templateFlows } from "./lib/templates";
import { summarizeFlow, type AgentFlow } from "./lib/utils";

const defaultFlow = templateFlows[0];

type FormValues = {
  goal: string;
  tone: string;
  channelId: string;
  automationStyle: "growth" | "repurposing" | "alerts";
  includeLLM: boolean;
};

export default function Page() {
  const [flow, setFlow] = useState<AgentFlow>(defaultFlow);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormValues>({
    defaultValues: {
      goal: "Automate youtube growth leveraging weekly highlights",
      tone: "Bold strategist",
      channelId: "",
      automationStyle: "growth",
      includeLLM: true
    }
  });

  const summary = useMemo(() => summarizeFlow(flow), [flow]);

  const handleGenerate = form.handleSubmit((values) => {
    setError(null);
    setStatus("Sending brief to AI architect...");

    startTransition(async () => {
      try {
        const suggestion = await generateFlowSuggestion({
          goal: values.goal,
          tone: values.tone,
          channelId: values.channelId,
          automationStyle: values.automationStyle,
          includeLLM: values.includeLLM
        });

        setFlow(suggestion);
        setStatus("Agent blueprint generated");
      } catch (err) {
        setError("Failed to reach AI planner. Loaded fallback template instead.");
        setFlow(defaultFlow);
      }
    });
  });

  const handleTemplate = (template: AgentFlow) => {
    setFlow(template);
    form.reset({
      goal: template.goal,
      tone: "Strategic analyst",
      channelId: "",
      automationStyle: "growth",
      includeLLM: template.nodes.some((node) => node.type.startsWith("llm"))
    });
    setStatus("Template loaded");
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 p-6 lg:flex-row">
      <div className="flex w-full flex-col gap-6 lg:w-96">
        <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6 shadow-2xl">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-500/20 text-brand-300">
              <Youtube className="h-6 w-6" />
            </span>
            <div>
              <h1 className="text-xl font-semibold text-slate-50">Agentic n8n Studio</h1>
              <p className="text-sm text-slate-400">Design AI-assisted YouTube automations in minutes.</p>
            </div>
          </div>
          <form className="mt-6 grid gap-4" onSubmit={handleGenerate}>
            <label className="grid gap-2 text-sm">
              <span className="text-slate-200">Automation goal</span>
              <textarea
                {...form.register("goal", { required: true })}
                rows={3}
                className="resize-none text-sm"
                placeholder="Grow subscribers by repurposing weekly livestreams into shorts"
              />
            </label>
            <label className="grid gap-2 text-sm">
              <span className="text-slate-200">Tone for AI steps</span>
              <input
                {...form.register("tone")}
                placeholder="Friendly growth partner"
              />
            </label>
            <label className="grid gap-2 text-sm">
              <span className="text-slate-200">Channel ID or URL (optional)</span>
              <input
                {...form.register("channelId")}
                placeholder="UC-"/>
            </label>
            <label className="grid gap-2 text-sm">
              <span className="text-slate-200">Automation style</span>
              <select {...form.register("automationStyle")}> 
                <option value="growth">Growth engine</option>
                <option value="repurposing">Content repurposing</option>
                <option value="alerts">Intelligence alerts</option>
              </select>
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-700"
                {...form.register("includeLLM")}
              />
              Inject AI summarization and scripting steps
            </label>
            <motion.button
              type="submit"
              whileTap={{ scale: 0.97 }}
              disabled={isPending}
              className="flex items-center justify-center gap-2 rounded-2xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 hover:bg-brand-400 focus:outline-none"
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Rocket className="h-4 w-4" />}
              {isPending ? "Mapping flow" : "Generate blueprint"}
            </motion.button>
            {status ? <p className="text-xs text-brand-300">{status}</p> : null}
            {error ? <p className="text-xs text-red-400">{error}</p> : null}
          </form>
        </section>
        <TemplateGallery onSelect={handleTemplate} />
      </div>
      <div className="flex w-full flex-1 flex-col gap-6">
        <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6 shadow-2xl">
          <header className="flex items-center gap-2 text-sm text-slate-400">
            <Settings className="h-4 w-4" />
            <span>Agent Summary</span>
          </header>
          <h2 className="mt-4 text-2xl font-semibold text-slate-50">{flow.name}</h2>
          <p className="mt-2 whitespace-pre-wrap text-sm text-slate-300">{summary}</p>
        </section>
        <FlowCanvas flow={flow} />
        <FlowExporter flow={flow} />
      </div>
    </main>
  );
}
