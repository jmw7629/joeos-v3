import {useState} from "react";
import "./App.css";

const pages=["Overview","Builder","Agents","Files","Memory","Pipeline","Logs","AI Chat"];

export default function App(){
const[page,setPage]=useState("Overview");
const[goal,setGoal]=useState("Build the next JoeOS module.");
const[chat,setChat]=useState("Test are you there");
const[out,setOut]=useState("JoeOS ready.");
const[history,setHistory]=useState<string[]>([]);
const[files,setFiles]=useState<string[]>([]);
const[logs,setLogs]=useState<string[]>([]);
const[memory,setMemory]=useState<string[]>([]);
const[agents,setAgents]=useState<string[]>(["Executive","Planner","Architect","Developer","QA"]);

async function api(path:string,opt?:RequestInit){
 const r=await fetch(path,opt); return await r.json();
}

async function open(p:string){
 setPage(p); setOut("Opened "+p);
 if(p==="Files"){const d=await api("/api/files");setFiles(d.files||[]);setOut(JSON.stringify(d,null,2))}
 if(p==="Logs"){const d=await api("/api/logs");setLogs(d.logs||[]);setOut(JSON.stringify(d,null,2))}
 if(p==="Memory"){const d=await api("/api/memory");setMemory(d.memory||[]);setOut(JSON.stringify(d,null,2))}
 if(p==="Agents"){const d=await api("/api/agents");setAgents((d.agents||[]).map((a:any)=>a.name||a));setOut(JSON.stringify(d,null,2))}
 if(p==="Pipeline"){setOut("Pipeline ready: Plan → Design → Build → QA → Ship")}
}

async function build(){
 const d=await api("/api/builder",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({goal})});
 setHistory([goal,...history]);
 setOut(JSON.stringify(d,null,2));
 setPage("Builder");
}

async function send(){
 const d=await api("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:chat})});
 setOut(JSON.stringify(d,null,2));
 setPage("AI Chat");
}

return <div className="app">
<header><div className="brand"><div className="logo">J</div><div><h1>JoeOS</h1><p>Executive AI Engineering Console</p></div></div>
<nav>{pages.map(p=><button className={page===p?"active":""} onClick={()=>open(p)}>{p}</button>)}</nav></header>

<main>
<section className="hero"><p>SYSTEM COMMAND</p><h2>{page}</h2><span>Real pages. Real API calls. Visible results.</span>
<div className="buttons"><button onClick={()=>api("/api/health").then(d=>setOut(JSON.stringify(d,null,2)))}>Test API</button><button onClick={build}>Run Builder</button></div></section>

<section className="metrics">
<button onClick={()=>api("/api/health").then(d=>setOut(JSON.stringify(d,null,2)))} className="metric green"><small>API</small><b>Online</b></button>
<button onClick={()=>open("Agents")} className="metric blue"><small>Agents</small><b>{agents.length} Ready</b></button>
<button onClick={()=>open("Builder")} className="metric purple"><small>Builds</small><b>{history.length}</b></button>
<button onClick={()=>open("Logs")} className="metric amber"><small>Logs</small><b>{logs.length}</b></button>
</section>

<section className="grid">
<div className="panel"><h3>Live Builder <em>Ready</em></h3><textarea value={goal} onChange={e=>setGoal(e.target.value)}/><div className="buttons"><button onClick={build}>Execute Build</button><button className="dark" onClick={()=>setOut("Output cleared.")}>Clear</button></div>{history.map(h=><div className="item">✅ {h}</div>)}</div>

<div className="panel"><h3>Agents <em>Live</em></h3>{agents.map(a=><button className="agent" onClick={()=>setOut(a+" is ready.")}><span>{a}</span><b>Ready</b></button>)}</div>

<div className="panel wide"><h3>Files <em>{files.length}</em></h3>{files.map(f=><button className="item" onClick={()=>setOut("Selected file: "+f)}>📄 {f}</button>)}</div>

<div className="panel wide"><h3>Memory <em>{memory.length}</em></h3>{memory.map(m=><div className="item">🧠 {m}</div>)}</div>

<div className="panel wide"><h3>AI Chat <em>Connected</em></h3><textarea value={chat} onChange={e=>setChat(e.target.value)}/><div className="buttons"><button onClick={send}>Send Chat</button><button className="dark" onClick={()=>open("Memory")}>Load Memory</button></div></div>

<div className="panel wide"><h3>Output Console <em>Live</em></h3><pre>{out}</pre></div>
</section>
</main>
</div>
}
