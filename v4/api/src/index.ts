import fs from "fs";
import path from "path";
import express from "express";
import cors from "cors";

const app = express();
const root = path.resolve(process.env.HOME || ".", "joeos-v3");

app.use(cors());
app.use(express.json({ limit: "5mb" }));

function safePath(file = "") {
  const full = path.resolve(root, file);
  if (!full.startsWith(root)) throw new Error("Unsafe path");
  return full;
}

function walk(dir: string, base = root, depth = 0): any[] {
  if (depth > 3) return [];
  return fs.readdirSync(dir)
    .filter(item => !["node_modules", ".git", "dist"].includes(item))
    .map(item => {
      const full = path.join(dir, item);
      const stat = fs.statSync(full);
      return {
        name: item,
        path: path.relative(base, full),
        type: stat.isDirectory() ? "folder" : "file",
        size: stat.size
      };
    });
}

app.get("/health", (_req, res) => {
  res.json({ ok: true, version: "JoeOS v4", mode: "development" });
});

app.get("/files", (_req, res) => {
  res.json({ ok: true, root, files: walk(root) });
});

app.post("/file/read", (req, res) => {
  const file = String(req.body?.file || "");
  const full = safePath(file);
  res.json({ ok: true, file, content: fs.readFileSync(full, "utf8") });
});

app.post("/file/write", (req, res) => {
  const file = String(req.body?.file || "");
  const content = String(req.body?.content || "");
  const full = safePath(file);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);
  res.json({ ok: true, file, bytes: content.length });
});

app.get("/agents", (_req, res) => {
  res.json({
    ok: true,
    agents: [
      { name: "Executive", status: "Ready" },
      { name: "Planner", status: "Ready" },
      { name: "Architect", status: "Ready" },
      { name: "Developer", status: "Ready" },
      { name: "QA", status: "Ready" }
    ]
  });
});

app.listen(8788, () => {
  console.log("JoeOS v4 API running on 8788");
});

const builds:any[]=[];
const buildDir = path.join(root, "v4", "workspace", "builds");
fs.mkdirSync(buildDir, { recursive: true });

app.get("/builder",(_,res)=>{
    res.json(builds);
});

app.post("/builder",(req,res)=>{
    const build={
        id:Date.now(),
        goal:req.body.goal,
        status:"queued",
        created:new Date().toISOString()
    };

    builds.unshift(build);

    console.log("NEW BUILD:",build.goal);

    res.json(build);
});


setInterval(() => {
  const next = builds.find((b:any) => b.status === "queued");

  if (!next) return;

  next.status = "running";
  console.log("Executing:", next.goal);

  setTimeout(() => {
    const buildDir = path.join(root, "v4", "workspace", "builds");
    fs.mkdirSync(buildDir, { recursive: true });

    const file = path.join(buildDir, `build-${next.id}.md`);
    const completed = new Date().toISOString();

    fs.writeFileSync(file, `# JoeOS Build

Goal:
${next.goal}

Status:
completed

Created:
${next.created}

Completed:
${completed}
`);

    next.file = path.relative(root, file);
    next.status = "completed";
    next.completed = completed;

    console.log("Finished:", next.goal);
  }, 3000);

}, 1000);

