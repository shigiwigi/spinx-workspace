import React, { useState, useEffect } from "react";
import { Search, Bell, ChevronRight, ChevronLeft, Sparkles } from "lucide-react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "./firebase";
import { C, useFonts } from "./theme";
import { Avatar, XMark } from "./components/Primitives";
import { NAV } from "./data";

// Clean, modular individual page imports
import { Dashboard } from "./components/views/Dashboard";
import { Meetings } from "./components/views/Meetings";
import { Notices } from "./components/views/Notices";
import { Finance } from "./components/views/Finance";
import { Inventory } from "./components/views/Inventory";
import { Projects } from "./components/views/Projects";
import { Team } from "./components/views/Team";
import { Documentation } from "./components/views/Documentation";
import { Procurement } from "./components/views/Procurement";
import { Analytics } from "./components/views/Analytics";
import { AIFeatures } from "./components/views/AIFeatures";

export default function SpinXWorkspace() {
  useFonts();
  const [active, setActive] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);

  const [meetings, setMeetings] = useState([]);
  const [notices, setNotices] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [tasks, setTasks] = useState({ todo: [], progress: [], done: [] });
  const [team, setTeam] = useState([]);
  const [docs, setDocs] = useState([]);
  const [procurement, setProcurement] = useState([]);

  useEffect(() => {
    const unsubMeetings = onSnapshot(query(collection(db, "meetings"), orderBy("createdAt", "desc")), (s) => setMeetings(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    const unsubNotices = onSnapshot(query(collection(db, "notices"), orderBy("createdAt", "desc")), (s) => setNotices(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    const unsubExpenses = onSnapshot(query(collection(db, "expenses"), orderBy("createdAt", "desc")), (s) => setExpenses(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    const unsubInventory = onSnapshot(query(collection(db, "inventory"), orderBy("createdAt", "desc")), (s) => setInventory(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    const unsubTasks = onSnapshot(query(collection(db, "tasks"), orderBy("createdAt", "desc")), (s) => {
      const all = s.docs.map(d => ({ id: d.id, ...d.data() }));
      setTasks({ todo: all.filter(t => t.status === "todo"), progress: all.filter(t => t.status === "progress"), done: all.filter(t => t.status === "done") });
    });
    const unsubTeam = onSnapshot(query(collection(db, "team"), orderBy("createdAt", "asc")), (s) => setTeam(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    const unsubDocs = onSnapshot(query(collection(db, "documentation"), orderBy("createdAt", "asc")), (s) => setDocs(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    const unsubProcure = onSnapshot(query(collection(db, "procurement"), orderBy("createdAt", "desc")), (s) => setProcurement(s.docs.map(d => ({ id: d.id, ...d.data() }))));

    return () => {
      unsubMeetings(); unsubNotices(); unsubExpenses(); unsubInventory(); unsubTasks();
      unsubTeam(); unsubDocs(); unsubProcure();
    };
  }, []);

  const renderSection = () => {
    switch (active) {
      case "dashboard": return <Dashboard meetings={meetings} inventory={inventory} notices={notices} tasks={tasks} expenses={expenses} />;
      case "meetings": return <Meetings liveMeetings={meetings} />;
      case "notices": return <Notices liveNotices={notices} />;
      case "finance": return <Finance liveExpenses={expenses} />;
      case "inventory": return <Inventory liveInventory={inventory} />;
      case "projects": return <Projects liveTasks={tasks} />;
      case "team": return <Team liveTeam={team} />;
      case "docs": return <Documentation liveDocs={docs} />;
      case "procurement": return <Procurement liveProcurement={procurement} />;
      case "analytics": return <Analytics expenses={expenses} tasks={tasks} inventory={inventory} />;
      case "ai": return <AIFeatures />;
      default: return <Dashboard meetings={meetings} inventory={inventory} notices={notices} tasks={tasks} expenses={expenses} />;
    }
  };

  return (
    <div className="flex w-full" style={{ height: "100vh", background: C.bg, fontFamily: "Inter" }}>
      <style>{`
        * { box-sizing: border-box; }
        ::selection { background: ${C.gold}44; }
        input::placeholder, textarea::placeholder { color: ${C.textFaint}; }
        select option { background: ${C.surface}; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: ${C.bg}; }
        ::-webkit-scrollbar-thumb { background: ${C.surface3}; }
        .spx-fade { animation: spxFade 0.25s ease both; }
        @keyframes spxFade { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        @media (prefers-reduced-motion: reduce) { .spx-fade { animation: none; } }
      `}</style>

      {/* SIDEBAR */}
      <div className="flex flex-col shrink-0 transition-all duration-300" style={{ width: collapsed ? 68 : 232, background: C.surface, borderRight: `1px solid ${C.border}` }}>
        <div className="flex items-center gap-2.5 px-4 h-16 shrink-0" style={{ borderBottom: `1px solid ${C.border}` }}>
          <XMark size={20} strokeWidth={4} />
          {!collapsed && (
            <div>
              <div style={{ fontFamily: "Orbitron", fontWeight: 800, fontSize: 15, color: C.text, letterSpacing: "0.03em" }}>SPINX</div>
              <div style={{ fontFamily: "JetBrains Mono", fontSize: 9, color: C.textFaint, letterSpacing: "0.12em", marginTop: -2 }}>WORKSPACE</div>
            </div>
          )}
        </div>

        <div className="flex-1 py-3 px-2.5 space-y-0.5 overflow-y-auto">
          {NAV.map(n => {
            const isActive = active === n.id;
            return (
              <button
                key={n.id}
                onClick={() => setActive(n.id)}
                className="w-full flex items-center gap-3 px-2.5 py-2.5 relative transition-colors group"
                style={{ background: isActive ? C.goldSoft : "transparent", color: isActive ? C.gold : C.textDim }}
              >
                {isActive && <div className="absolute left-0 top-0 bottom-0" style={{ width: 2, background: C.gold }} />}
                <n.icon size={16} className="shrink-0" />
                {!collapsed && <span className="text-sm" style={{ fontFamily: "Rajdhani", fontWeight: 600, fontSize: 14 }}>{n.label}</span>}
              </button>
            );
          })}
        </div>

        <div className="p-2.5 shrink-0" style={{ borderTop: `1px solid ${C.border}` }}>
          <button onClick={() => setActive("ai")} className="w-full flex items-center gap-3 px-2.5 py-2.5 transition-colors"
            style={{ background: active === "ai" ? C.goldSoft : "transparent", color: active === "ai" ? C.gold : C.textDim }}>
            <Sparkles size={16} className="shrink-0" />
            {!collapsed && <span className="text-sm" style={{ fontFamily: "Rajdhani", fontWeight: 600 }}>AI Assistant</span>}
          </button>
          <button onClick={() => setCollapsed(!collapsed)} className="w-full flex items-center justify-center gap-2 px-2.5 py-2 mt-1 text-xs"
            style={{ color: C.textFaint, fontFamily: "Rajdhani" }}>
            {collapsed ? <ChevronRight size={14} /> : <><ChevronLeft size={14} /> Collapse</>}
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center gap-4 px-6 h-16 shrink-0" style={{ borderBottom: `1px solid ${C.border}`, background: C.bg }}>
          <div className="flex items-center gap-2 px-3 py-2 border max-w-sm w-full" style={{ borderColor: C.border, background: C.surface }}>
            <Search size={14} style={{ color: C.textFaint }} />
            <input placeholder="Search projects, docs, people..." className="bg-transparent outline-none text-sm flex-1" style={{ color: C.text, fontFamily: "Inter" }} />
          </div>
          <div className="ml-auto flex items-center gap-4">
            <button className="relative">
              <Bell size={17} style={{ color: C.textDim }} />
              <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full" style={{ background: C.gold }} />
            </button>
            <div className="w-px h-6" style={{ background: C.border }} />
            <div className="flex items-center gap-2.5">
              <Avatar name="Shihan" size={32} />
              <div>
                <div className="text-sm font-semibold leading-none" style={{ color: C.text, fontFamily: "Rajdhani" }}>Shihan</div>
                <div className="text-[11px] mt-0.5" style={{ color: C.textFaint, fontFamily: "Inter" }}>Founder</div>
              </div>
            </div>
          </div>
        </div>

        <div key={active} className="flex-1 overflow-y-auto p-6 spx-fade">
          {renderSection()}
        </div>
      </div>
    </div>
  );
}