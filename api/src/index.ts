import fs from "fs";
import path from "path";
import express from "express";
import cors from "cors";

const app = express();
const root = path.resolve(process.env.HOME || ".", "joeos-v3");
const logs: string[] = ["JoeOS API online"];

app.use(cors());
app.use(express.json({ limit: "2mb" }));

function safePath(file: string) {
  const full = path.resolve(root, file);
  if (!full.startsWith(root)) throw new Error("Unsafe path");
  return full;
}

app.get("/api/health", (_req, res) => res.json({ ok: true, status: "online", time: new Date().toISOString() }));
app.get("/api/status", (_req, res) => res.json({ ok: true, mode: "dev", agents: 5, queue: 0 }));

app.get("/api/agents", (_req, res) => res.json({
  ok: true,
  agents: ["Executive", "Planner", "Architect", "Developer", "QA"]
}));

app.get("/api/files", (_req, res) => {
  const files: string[] = [];
  function walk(dir: string) {
    for (const item of fs.readdirSync(dir)) {
      if (item === "node_modules" || item === ".git") continue;
      const full = path.join(dir, item);
      const rel = path.relative(root, full);
      if (fs.statSync(full).isDirectory()) walk(full);
      else files.push(rel);
    }
  }
  walk(root);
  res.json({ ok: true, files: files.slice(0, 200) });
});

app.post("/api/file/read", (req, res) => {
  const file = String(req.body?.file || "");
  const full = safePath(file);
  res.json({ ok: true, file, content: fs.readFileSync(full, "utf8") });
});

app.post("/api/file/write", (req, res) => {
  const file = String(req.body?.file || "");
  const content = String(req.body?.content || "");
  const full = safePath(file);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);
  logs.unshift("Wrote file: " + file);
  res.json({ ok: true, file, bytes: content.length });
});

app.get("/api/memory", (_req, res) => res.json({ ok: true, memory: ["Executive UI", "Working file explorer", "Builder can write files"] }));
app.get("/api/logs", (_req, res) => res.json({ ok: true, logs }));
app.get("/api/pipeline", (_req, res) => res.json({ ok: true, pipeline: ["Plan", "Design", "Build", "QA", "Ship"] }));

app.post("/api/builder", (req, res) => {
  const goal = String(req.body?.goal || "");
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const file = `builds/build-${stamp}.md`;
  const content = `# JoeOS Build\n\nGoal:\n${goal}\n\nCreated:\n${new Date().toISOString()}\n`;
  const full = safePath(file);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);
  logs.unshift("Builder created: " + file);
  res.json({ ok: true, message: "Builder created a build file", file, goal });
});

app.post("/api/chat", (req, res) => {
  const message = String(req.body?.message || "");
  logs.unshift("Chat: " + message);
  res.json({ ok: true, reply: "JoeOS received: " + message });
});

app.listen(8787, () => console.log("JoeOS API running on 8787"));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, status: "online", time: new Date().toISOString() });
});

app.get("/api/status", (_req, res) => {
  res.json({ ok: true, mode: "dev", agents: 5, queue: 0 });
});

app.get("/api/agents", (_req, res) => {
  res.json({
    ok: true,
    agents: ["Executive", "Planner", "Architect", "Developer", "QA"]
  });
});

app.get("/api/files", (_req, res) => {
  const files: string[] = [];

  function walk(dir: string) {
    for (const item of fs.readdirSync(dir)) {
      if (item === "node_modules" || item === ".git") continue;

      const full = path.join(dir, item);
      const rel = path.relative(root, full);

      if (fs.statSync(full).isDirectory()) walk(full);
      else files.push(rel);
    }
  }

  walk(root);
  res.json({ ok: true, files: files.slice(0, 200) });
});

app.post("/api/file/read", (req, res) => {
  const file = String(req.body?.file || "");
  const full = safePath(file);

  res.json({
    ok: true,
    file,
    content: fs.readFileSync(full, "utf8")
  });
});

app.post("/api/file/write", (req, res) => {
  const file = String(req.body?.file || "");
  const content = String(req.body?.content || "");
  const full = safePath(file);

  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);

  logs.unshift("Wrote file: " + file);

  res.json({
    ok: true,
    file,
    bytes: content.length
  });
});

app.get("/api/memory", (_req, res) => {
  res.json({
    ok: true,
    memory: [
      "Executive UI",
      "Working file explorer",
      "Builder can write files"
    ]
  });
});


app.get("/api/logs", (_req, res) => {
  res.json({ ok: true, logs });
});

app.get("/api/pipeline", (_req, res) => {
  res.json({
    ok: true,
    pipeline: [
      "Plan",
      "Design",
      "Build",
      "QA",
      "Ship"
    ]
  });
});

app.post("/api/builder", (req, res) => {
  const goal = String(req.body?.goal || "");

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const file = `builds/build-${stamp}.md`;

  const content = `# JoeOS Build

Goal:
${goal}

Created:
${new Date().toISOString()}
`;

  const full = safePath(file);

  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);

  logs.unshift("Builder created: " + file);

  res.json({
    ok: true,
    message: "Builder created a build file",
    file,
    goal
  });
});

app.post("/api/chat", (req, res) => {
  const message = String(req.body?.message || "");

  logs.unshift("Chat: " + message);

  res.json({
    ok: true,
    reply: "JoeOS received: " + message
  });
});

app.listen(8787, () => {
  console.log("JoeOS API running on 8787");
});

