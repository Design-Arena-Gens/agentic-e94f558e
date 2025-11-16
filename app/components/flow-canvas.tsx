"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Workflow } from "lucide-react";
import { generateNodeLabel, type AgentFlow } from "../lib/utils";

interface Props {
  flow: AgentFlow;
}

export function FlowCanvas({ flow }: Props) {
  return (
    <div className="relative isolate overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl">
      <div className="flex items-center gap-2 text-sm text-slate-400">
        <Workflow className="h-4 w-4" />
        <span>Execution Graph</span>
      </div>
      <div className="mt-6 grid gap-4">
        {flow.nodes.map((node, index) => {
          const label = generateNodeLabel(node);
          const edge = flow.edges.find((e) => e.source === node.id);
          const targetIndex = edge
            ? flow.nodes.findIndex((n) => n.id === edge.target)
            : -1;

          return (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-xl border border-slate-800 bg-slate-950/80 p-4"
            >
              <div className="flex items-center justify-between text-xs uppercase tracking-wide text-brand-300">
                <span>{label}</span>
                <span className="text-slate-500">#{index + 1}</span>
              </div>
              <h4 className="mt-2 text-lg font-semibold text-slate-100">{node.name}</h4>
              {node.description ? (
                <p className="mt-2 text-sm text-slate-400">{node.description}</p>
              ) : null}
              <div className="mt-3 rounded-lg bg-slate-900/60 p-3 text-xs text-slate-400">
                <pre className="whitespace-pre-wrap break-words text-[11px]">
                  {JSON.stringify(node.config, null, 2)}
                </pre>
              </div>
              {edge && targetIndex >= 0 ? (
                <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <ArrowUpRight className="h-4 w-4" /> Next → {flow.nodes[targetIndex].name}
                  </div>
                  <span>{edge.id}</span>
                </div>
              ) : null}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
