import React from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

function App() {
  const [output, setOutput] = React.useState("JoeOS v4 ready.");
  const [goal, setGoal] = React.useState("Create file explorer page");

  async function call(path: string, options?: RequestInit) {
    const res = await fetch("/api" + path, options);
    const data = await res.json();
    setOutput(JSON.stringify(data, null, 2));
  }

  async function build() {
    await call("/builder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goal })
    });
  }

  return (
    <main>
      <header>
        <h1>JoeOS v4</h1>
        <p>AI Engineering Console</p>
      </header>

      <section className="hero">
        <h2>Builder Workspace</h2>
        <p>Connected to v4 API on port 8788.</p>
        <div>
          <button onClick={() => call("/health")}>Health</button>
          <button onClick={() => call("/files")}>Files</button>
          <button onClick={() => call("/agents")}>Agents</button>
          <button onClick={() => call("/builder")}>Build Queue</button>
        </div>
      </section>

      <section className="panel">
        <h3>Build Command</h3>
        <textarea value={goal} onChange={e => setGoal(e.target.value)} />
        <button onClick={build}>Run Build</button>
      </section>

      <section className="panel">
        <h3>Output</h3>
        <pre>{output}</pre>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
