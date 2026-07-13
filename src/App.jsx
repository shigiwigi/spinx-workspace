import React, { useState, useEffect } from "react";
import { Search, Bell, ChevronRight, ChevronLeft, Sparkles, LogOut, Award } from "lucide-react";
import { collection, onSnapshot, query, orderBy, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { db, auth, googleProvider } from "./firebase";
import { C, useFonts } from "./theme";
import { Avatar, XMark, PrimaryBtn, Badge } from "./components/Primitives";
import { NAV } from "./data";

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
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({ role: "Presenter", points: 0 });
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);

  const [meetings, setMeetings] = useState([]);
  const [notices, setNotices] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [tasks, setTasks] = useState({ todo: [], progress: [], done: [], completed: [] });
  const [team, setTeam] = useState([]);
  const [docs, setDocs] = useState([]);
  const [procurement, setProcurement] = useState([]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const uDocRef = doc(db, "users", currentUser.uid);
        const uSnap = await getDoc(uDocRef);
        
        if (uSnap.exists()) {
          setProfile(uSnap.data());
        } else {
          // Default baseline setup for new team profiles
          const initialData = {
            name: currentUser.displayName || "Anonymous",
            email: currentUser.email,
            role: currentUser.email === "SHIGIWIGI@arch.localdomain" ? "Head Developer" : "Presenter", 
            points: 0,
            createdAt: new Date()
          };
          await setDoc(uDocRef, initialData);
          setProfile(initialData);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) return;

    // Real-time task syncing mapping out all four columns explicitly
    const unsubTasks = onSnapshot(query(collection(db, "tasks"), orderBy("createdAt", "desc")), (s) => {
      const all = s.docs.map(d => ({ id: d.id, ...d.data() }));
      setTasks({
        todo: all.filter(t => t.status === "todo"),
        progress: all.filter(t => t.status === "progress"),
        done: all.filter(t => t.status === "done"),
        completed: all.filter(t => t.status === "completed")
      });
    });

    const unsubMeetings = onSnapshot(query(collection(db, "meetings"), orderBy("createdAt", "desc")), (s) => setMeetings(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    const unsubNotices = onSnapshot(query(collection(db, "notices"), orderBy("createdAt", "desc")), (s) => setNotices(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    const unsubExpenses = onSnapshot(query(collection(db, "expenses"), orderBy("createdAt", "desc")), (s) => setExpenses(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    const unsubInventory = onSnapshot(query(collection(db, "inventory"), orderBy("createdAt", "desc")), (s) => setInventory(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    const unsubTeam = onSnapshot(query(collection(db, "team"), orderBy("createdAt", "asc")), (s) => setTeam(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    const unsubDocs = onSnapshot(query(collection(db, "documentation"), orderBy("createdAt", "asc")), (s) => setDocs(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    const unsubProcure = onSnapshot(query(collection(db, "procurement"), orderBy("createdAt", "desc")), (s) => setProcurement(s.docs.map(d => ({ id: d.id, ...d.data() }))));

    return () => {
      unsubMeetings(); unsubNotices(); unsubExpenses(); unsubInventory(); 
      unsubTasks(); unsubTeam(); unsubDocs(); unsubProcure();
    };
  }, [user]);

  const handleRedeemPoints = async () => {
    if (profile.points < 5000) return;
    await updateDoc(doc(db, "users", user.uid), { points: 0 });
    setProfile(prev => ({ ...prev, points: 0 }));
    alert("Redemption Request Submitted to Owner!");
  };

  const handleLogin = async () => { try { await signInWithPopup(auth, googleProvider); } catch (e) { console.error(e); } };
  const handleLogout = async () => { try { await signOut(auth); setActive("dashboard"); } catch (e) { console.error(e); } };

  // Filter sidebar tabs dynamically based on user role parameters
  const allowedNav = NAV.filter(n => {
    if (profile.role === "Owner" || profile.role === "Head Developer") return true;
    if (profile.role === "Developer") return !["finance"].includes(n.id);
    if (profile.role === "Operations") return !["finance", "docs"].includes(n.id);
    if (profile.role === "Media") return ["dashboard", "notices", "team"].includes(n.id);
    if (profile.role === "Presenter") return ["dashboard", "meetings", "notices"].includes(n.id);
    return false;
  });

  const renderSection = () => {
    switch (active) {
      case "dashboard": return <Dashboard meetings={meetings} inventory={inventory} notices={notices} tasks={tasks} expenses={expenses} />;
      case "meetings": return <Meetings liveMeetings={meetings} />;
      case "notices": return <Notices liveNotices={notices} />;
      case "finance": return <Finance liveExpenses={expenses} />;
      case "inventory": return <Inventory liveInventory={inventory} />;
      case "projects": return <Projects liveTasks={tasks} userRole={profile.role} userId={user.uid} />;
      case "team": return <Team liveTeam={team} />;
      case "docs": return <Documentation liveDocs={docs} />;
      case "procurement": return <Procurement liveProcurement={procurement} />;
      case "analytics": return <Analytics expenses={expenses} tasks={tasks} inventory={inventory} />;
      case "ai": return <AIFeatures />;
      default: return <Dashboard meetings={meetings} inventory={inventory} notices={notices} tasks={tasks} expenses={expenses} />;
    }
  };

  if (loading) return <div className="flex items-center justify-center w-screen h-screen text-white bg-black">LOADING SYSTEM...</div>;

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center w-screen h-screen bg-black">
        <div className="max-w-md w-full border border-neutral-800 p-8 text-center bg-neutral-900">
          <div className="text-xl font-bold tracking-widest text-white mb-6">SPINX WORKSPACE</div>
          <PrimaryBtn onClick={handleLogin}>AUTHENTICATE VIA GOOGLE</PrimaryBtn>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full" style={{ height: "100vh", background: C.bg, fontFamily: "Inter" }}>
      {/* SIDEBAR */}
      <div className="flex flex-col shrink-0" style={{ width: collapsed ? 68 : 232, background: C.surface, borderRight: `1px solid ${C.border}` }}>
        <div className="flex items-center gap-2.5 px-4 h-16 shrink-0 border-b" style={{ borderColor: C.border }}>
          <XMark size={20} strokeWidth={4} />
          {!collapsed && <span className="text-white font-bold text-sm tracking-wider">SPINX ENGINE</span>}
        </div>

        <div className="flex-1 py-3 px-2.5 space-y-0.5 overflow-y-auto">
          {allowedNav.map(n => {
            const isActive = active === n.id;
            return (
              <button key={n.id} onClick={() => setActive(n.id)} className="w-full flex items-center gap-3 px-2.5 py-2.5 relative text-neutral-400 hover:text-white"
                style={{ background: isActive ? C.goldSoft : "transparent", color: isActive ? C.gold : "" }}>
                <n.icon size={16} />
                {!collapsed && <span className="text-sm font-semibold">{n.label}</span>}
              </button>
            );
          })}
        </div>

        <div className="p-2.5 shrink-0 border-t" style={{ borderColor: C.border }}>
          <button onClick={() => setCollapsed(!collapsed)} className="w-full text-center text-xs text-neutral-500">
            {collapsed ? "Expand" : "Collapse menu"}
          </button>
        </div>
      </div>

      {/* MAIN LAYOUT HEADER CONTAINING PERFORMANCE POINTS BAR */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center gap-4 px-6 h-16 shrink-0 border-b" style={{ borderColor: C.border, background: C.bg }}>
          
          {/* Performance Points Tracker Engine */}
          <div className="flex items-center gap-3 bg-neutral-900 px-3 py-1.5 border border-neutral-800 rounded">
            <Award size={14} className="text-amber-400" />
            <div className="text-xs font-semibold text-neutral-300">
              Score: <span className="text-white font-mono">{profile.points || 0}</span> / 5000 PTS
            </div>
            {profile.points >= 5000 && (
              <button 
                onClick={handleRedeemPoints}
                className="text-[10px] uppercase font-bold px-2 py-0.5 bg-amber-500 hover:bg-amber-600 text-black transition-colors rounded ml-1"
              >
                Redeem ₹5k
              </button>
            )}
          </div>

          <div className="ml-auto flex items-center gap-4 text-white">
            <Badge tone="gold">{profile.role}</Badge>
            <button onClick={handleLogout} className="text-neutral-400 hover:text-white"><LogOut size={16} /></button>
            <div className="flex items-center gap-2">
              <img src={user.photoURL} className="w-8 h-8 rounded-full border border-neutral-800" alt="avatar" />
              <div className="text-left">
                <div className="text-xs font-bold leading-none">{user.displayName}</div>
                <div className="text-[10px] text-neutral-500">{user.email}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-black">{renderSection()}</div>
      </div>
    </div>
  );
}