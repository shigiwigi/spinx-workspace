import React, { useState, useEffect } from "react";
import { Search, Bell, ChevronRight, ChevronLeft, Sparkles } from "lucide-react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "./firebase";
import { C, useFonts } from "./theme";
import { Avatar, XMark } from "./components/Primitives";
import { NAV } from "./data"; // Nav array remains static configuration
import { Dashboard, Meetings, Notices, Finance, Inventory, Projects, Team, Documentation, Procurement, Analytics, AIFeatures } from "./components/Views";

export default function SpinXWorkspace() {
  useFonts();
  const [active, setActive] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);

  // Live database states
  const [meetings, setMeetings] = useState([]);
  const [notices, setNotices] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [tasks, setTasks] = useState({ todo: [], progress: [], done: [] });
  const [team, setTeam] = useState([]);
  const [docs, setDocs] = useState([]);
  const [procurement, setProcurement] = useState([]);

  useEffect(() => {
    // Standard Base Listeners
    const unsubMeetings = onSnapshot(query(collection(db, "meetings"), orderBy("createdAt", "desc")), (s) => setMeetings(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    const unsubNotices = onSnapshot(query(collection(db, "notices"), orderBy("createdAt", "desc")), (s) => setNotices(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    const unsubExpenses = onSnapshot(query(collection(db, "expenses"), orderBy("createdAt", "desc")), (s) => setExpenses(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    const unsubInventory = onSnapshot(query(collection(db, "inventory"), orderBy("createdAt", "desc")), (s) => setInventory(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    const unsubTasks = onSnapshot(query(collection(db, "tasks"), orderBy("createdAt", "desc")), (s) => {
      const all = s.docs.map(d => ({ id: d.id, ...d.data() }));
      setTasks({ todo: all.filter(t => t.status === "todo"), progress: all.filter(t => t.status === "progress"), done: all.filter(t => t.status === "done") });
    });

    // New Free-form Listeners
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
      {/* ... (Keep UI rendering markup exactly the same) */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header layout details */}
        <div className="flex items-center gap-4 px-6 h-16 shrink-0" style={{ borderBottom: `1px solid ${C.border}`, background: C.bg }}>
          <div className="flex items-center gap-2 px-3 py-2 border max-w-sm w-full" style={{ borderColor: C.border, background: C.surface }}>
            <Search size={14} style={{ color: C.textFaint }} />
            <input placeholder="Search projects, docs, people..." className="bg-transparent outline-none text-sm flex-1" style={{ color: C.text, fontFamily: "Inter" }} />
          </div>
          <div className="ml-auto flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <Avatar name="Shihan" size={32} />
              <div>
                <div className="text-sm font-semibold leading-none" style={{ color: C.text, fontFamily: "Rajdhani" }}>Shihan</div>
                <div className="text-[11px] mt-0.5" style={{ color: C.textFaint, fontFamily: "Inter" }}>Founder</div>
              </div>
            </div>
          </div>
        </div>
        <div key={active} className="flex-1 overflow-y-auto p-6 spx-fade">{renderSection()}</div>
      </div>
    </div>
  );
}