"use client";

import { useState } from "react";
import { Copy, Download } from "lucide-react";
import { serializeFlow, type AgentFlow } from "../lib/utils";

interface Props {
  flow: AgentFlow;
}

export function FlowExporter({ flow }: Props) {
  const [copied, setCopied] = useState(false);

  const json = serializeFlow(flow);

  async function handleCopy() {
    await navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${flow.name.toLowerCase().replace(/\s+/g, "-")}-n8n-flow.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-100">Export to n8n</h3>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 rounded-lg bg-brand-500 px-3 py-1.5 text-sm text-white shadow hover:bg-brand-400"
          >
            <Copy className="h-4 w-4" /> {copied ? "Copied" : "Copy"}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 rounded-lg border border-brand-500/60 px-3 py-1.5 text-sm text-brand-300 hover:bg-brand-500/10"
          >
            <Download className="h-4 w-4" /> Download
          </button>
        </div>
      </div>
      <p className="mt-2 text-sm text-slate-400">
        Import the JSON into your n8n instance under <span className="text-slate-200">Workflows → Import from file</span> to scaffold the automation.
      </p>
      <div className="mt-4 max-h-64 overflow-y-auto rounded-xl bg-slate-900/70 p-4 text-xs text-slate-300">
        <pre className="whitespace-pre-wrap break-words">{json}</pre>
      </div>
    </div>
  );
}
