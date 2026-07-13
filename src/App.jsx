import React, { useState, useEffect } from "react";
import { Search, Bell, ChevronRight, ChevronLeft, Sparkles, LogOut, Award, Users } from "lucide-react";
import { collection, onSnapshot, query, orderBy, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { db, auth, googleProvider } from "./firebase";
import { C, useFonts } from "./theme";
import { Avatar, XMark, PrimaryBtn, Badge, Card } from "./components/Primitives";
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
  const [allUsers, setAllUsers] = useState([]);
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
          const initialData = {
            uid: currentUser.uid,
            name: currentUser.displayName || "Anonymous",
            email: currentUser.email,
            role: currentUser.email === "shigiwigi@gmail.com" ? "Head Developer" : "Presenter", 
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

    // Stream all authenticated site members dynamically
    const unsubUsers = onSnapshot(collection(db, "users"), (s) => {
      setAllUsers(s.docs.map(d => ({ id: d.id, ...d.data() })));
    });

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
      unsubUsers(); unsubMeetings(); unsubNotices(); unsubExpenses(); 
      unsubInventory(); unsubTasks(); unsubTeam(); unsubDocs(); unsubProcure();
    };
  }, [user]);

  const handleUpdateRole = async (targetUid, newRole) => {
    if (profile.role !== "Owner" && profile.role !== "Head Developer") return;
    await updateDoc(doc(db, "users", targetUid), { role: newRole });
  };

  const handleRedeemPoints = async () => {
    if (profile.role === "Owner" || profile.points < 5000) return;
    await updateDoc(doc(db, "users", user.uid), { points: 0 });
    setProfile(prev => ({ ...prev, points: 0 }));
    alert("₹5,000 cash payment redemption flag triggered to Owner!");
  };

  const handleLogin = async () => { try { await signInWithPopup(auth, googleProvider); } catch (e) { console.error(e); } };
  const handleLogout = async () => { try { await signOut(auth); setActive("dashboard"); } catch (e) { console.error(e); } };

  const allowedNav = NAV.filter(n => {
    if (profile.role === "Owner" || profile.role === "Head Developer") return true;
    if (profile.role === "Developer") return !["finance"].includes(n.id);
    if (profile.role === "Operations") return !["finance", "docs"].includes(n.id);
    if (profile.role === "Media") return ["dashboard", "notices", "team"].includes(n.id);
    if (profile.role === "Presenter") return ["dashboard", "meetings", "notices"].includes(n.id);
    return false;
  });

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

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center gap-4 px-6 h-16 shrink-0 border-b" style={{ borderColor: C.border, background: C.bg }}>
          
          {/* Dynamic Score Indicator (Hidden for Owner) */}
          {profile.role !== "Owner" && (
            <div className="flex items-center gap-3 bg-neutral-900 px-3 py-1.5 border border-neutral-800 rounded">
              <Award size={14} className="text-amber-400" />
              <div className="text-xs font-semibold text-neutral-300">
                Score: <span className="text-white font-mono">{profile.points || 0}</span> / 5000 PTS
              </div>
              {profile.points >= 5000 && (
                <button onClick={handleRedeemPoints} className="text-[10px] uppercase font-bold px-2 py-0.5 bg-amber-500 text-black rounded ml-1">
                  Redeem ₹5k
                </button>
              )}
            </div>
          )}

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

        {/* Dynamic System Subview Active Router */}
        <div className="flex-1 overflow-y-auto p-6 bg-black">
          {active === "team" ? (
            <div>
              <Team liveTeam={team} />
              
              {/* Site Member Administrative Matrix Panel */}
              {["Owner", "Head Developer"].includes(profile.role) && (
                <div className="mt-8">
                  <div className="text-white font-bold text-sm uppercase tracking-wider mb-3 font-mono">System Core Access Controls</div>
                  <Card className="p-0 overflow-hidden border border-neutral-800">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-neutral-900 text-neutral-400 border-b border-neutral-800 font-mono">
                          <th className="p-3">Member Name</th>
                          <th className="p-3">Email Handle</th>
                          <th className="p-3">Score Ledger</th>
                          <th className="p-3">System Access Privilege</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-800 text-neutral-300">
                        {allUsers.map((u) => (
                          <tr key={u.id} className="hover:bg-neutral-900/50">
                            <td className="p-3 font-semibold text-white">{u.name}</td>
                            <td className="p-3 font-mono text-neutral-500">{u.email}</td>
                            <td className="p-3 font-mono text-amber-400 font-semibold">{u.role === "Owner" ? "—" : `${u.points || 0} PTS`}</td>
                            <td className="p-3">
                              <select 
                                value={u.role || "Presenter"}
                                onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                                className="bg-neutral-950 border border-neutral-800 px-2 py-1 text-white text-xs outline-none"
                              >
                                <option value="Owner">Owner</option>
                                <option value="Head Developer">Head Developer</option>
                                <option value="Developer">Developer</option>
                                <option value="Operations">Operations</option>
                                <option value="Media">Media</option>
                                <option value="Presenter">Presenter</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Card>
                </div>
              )}
            </div>
          ) : (
            active === "projects" ? <Projects liveTasks={tasks} userRole={profile.role} userId={user.uid} allMembers={allUsers} /> : renderSection()
          )}
        </div>
      </div>
    </div>
  );
}