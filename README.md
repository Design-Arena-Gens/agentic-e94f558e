# Agentic n8n Studio for YouTube Automation

Design, simulate, and export AI-augmented n8n workflows that automate YouTube growth, repurposing, and intelligence tasks.

## ✨ What’s inside

- **Blueprint Generator** – brief the built-in architect with a goal, tone, and channel metadata to receive an AI-designed graph of YouTube + LLM nodes.
- **Visual Runbook** – inspect every step, config, and transition inside the flow canvas with animated cards that mirror n8n’s execution order.
- **One-click Export** – copy or download a ready-to-import JSON scaffold tailored for n8n.
- **Curated Templates** – jump-start with pre-built agents for repurposing livestreams, automating comment replies, and competitive monitoring.
- **Server Actions + OpenAI** – Next.js server action orchestrates flow synthesis (falls back to deterministic templates when no key is available).

Live deployment: https://agentic-e94f558e.vercel.app

## 🚀 Getting Started

```bash
npm install
npm run dev
# open http://localhost:3000
```

Environment variable for AI generation (optional):

```bash
export OPENAI_API_KEY=sk-...
```

Without the key the app still works using curated fallback flows.

## 🧱 Project Structure

```
app/
 ├─ actions/           # Server actions (OpenAI-backed synthesis)
 ├─ components/        # UI building blocks
 ├─ lib/               # Shared types, helpers, templates
 └─ styles/            # Tailwind entry point
```

## 🛠️ Scripts

- `npm run dev` – Next.js dev server
- `npm run build` – Production build (used for deployment)
- `npm start` – Serve the production bundle
- `npm run lint` – ESLint + Next.js rules
- `npm test` – Jest (passes when no tests exist)

## 📦 Tech Stack

- Next.js 14 App Router + Server Actions
- React 18 + Framer Motion UI animations
- Tailwind CSS (custom brand palette)
- OpenAI SDK (chat completions)
- React Hook Form + Zod validation

## 🔌 Exporting to n8n

1. Compose or generate a flow.
2. Use **Copy** or **Download** in the “Export to n8n” panel.
3. Inside n8n, select **Workflows → Import from file** and upload the JSON.
4. Wire real credentials (YouTube, webhooks, LLM providers) inside n8n.

## ✅ Deployment

The repository includes a ready-to-deploy configuration for Vercel:

```bash
vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-e94f558e
```

After deployment, verify the production URL with:

```bash
curl https://agentic-e94f558e.vercel.app
```

Enjoy shipping agentic YouTube workflows! 💡
