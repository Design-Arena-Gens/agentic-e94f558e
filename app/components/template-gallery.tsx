"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { templateFlows } from "../lib/templates";
import { type AgentFlow } from "../lib/utils";

interface Props {
  onSelect(flow: AgentFlow): void;
}

export function TemplateGallery({ onSelect }: Props) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6">
      <div className="flex items-center gap-2 text-sm text-slate-400">
        <Sparkles className="h-4 w-4" />
        <span>Templates</span>
      </div>
      <div className="mt-4 grid gap-4">
        {templateFlows.map((flow, index) => (
          <motion.button
            key={flow.name}
            onClick={() => onSelect(flow)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="w-full rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-left hover:border-brand-400/60 hover:bg-slate-900"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-base font-semibold text-slate-100">{flow.name}</h4>
              <span className="text-xs text-slate-500">{flow.nodes.length} nodes</span>
            </div>
            <p className="mt-2 line-clamp-2 text-sm text-slate-400">{flow.goal}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-400">
              {flow.nodes.map((node) => (
                <span
                  key={node.id}
                  className="rounded-full border border-slate-800/80 bg-slate-900/50 px-2 py-1 uppercase tracking-wide"
                >
                  {node.type}
                </span>
              ))}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
