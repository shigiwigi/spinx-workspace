import React, { useState, useEffect } from "react";
import { LogOut, Award, ShieldCheck, Sparkles, X, LayoutDashboard, Menu } from "lucide-react";
import { collection, onSnapshot, query, orderBy, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { db, auth, googleProvider } from "./firebase";
import { C, FONT, useFonts } from "./theme";
import { Avatar, LogoMark, PrimaryBtn, Badge, Card, SprayStreak } from "./components/Primitives";
import { NAV } from "./data";

import { Dashboard } from "./components/views/Dashboard";
import { Meetings } from "./components/views/Meetings";
import { Notices } from "./components/views/Notices";
import { Inventory } from "./components/views/Inventory";
import { Projects } from "./components/views/Projects";
import { Team } from "./components/views/Team";
import { CalendarView } from "./components/views/Calendar";
import { Finance } from "./components/views/Finance";
import { AIFeatures } from "./components/views/AIFeatures";

export default function SpinXWorkspace() {
  useFonts();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({ role: "Presenter", points: 0 });
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);

  // Firestore Data States
  const [meetings, setMeetings] = useState([]);
  const [notices, setNotices] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [tasks, setTasks] = useState({ todo: [], progress: [], done: [], completed: [] });
  const [team, setTeam] = useState([]);
  const [docs, setDocs] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [rolesList, setRolesList] = useState([]); // Dynamic Roles State

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
            role: "Presenter",
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

  // Central Real-time Listener Hub
  useEffect(() => {
    if (!user) return;

    const unsubUsers = onSnapshot(collection(db, "users"), (s) => setAllUsers(s.docs.map(d => ({ id: d.id, ...d.data() }))));
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
    const unsubInventory = onSnapshot(query(collection(db, "inventory"), orderBy("createdAt", "desc")), (s) => setInventory(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    const unsubTeam = onSnapshot(query(collection(db, "team"), orderBy("createdAt", "asc")), (s) => setTeam(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    const unsubDocs = onSnapshot(query(collection(db, "documentation"), orderBy("createdAt", "asc")), (s) => setDocs(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    const unsubCalendar = onSnapshot(query(collection(db, "calendarEvents"), orderBy("date", "asc")), (s) => setCalendarEvents(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    const unsubExpenses = onSnapshot(query(collection(db, "expenses"), orderBy("createdAt", "desc")), (s) => setExpenses(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    const unsubRoles = onSnapshot(collection(db, "roles"), (s) => setRolesList(s.docs.map(d => ({ id: d.id, ...d.data() }))));

    return () => {
      unsubUsers(); unsubMeetings(); unsubNotices();
      unsubInventory(); unsubTasks(); unsubTeam(); unsubDocs(); unsubCalendar(); unsubExpenses(); unsubRoles();
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

  const allowedNav = (NAV || []).filter(n => {
    if (profile.role === "Owner" || profile.role === "Head Developer") return true;
    if (profile.role === "Developer" || profile.role === "Operations") return n.id !== "finance";
    if (profile.role === "Media") return ["dashboard", "notices", "team", "calendar"].includes(n.id);
    if (profile.role === "Presenter") return ["dashboard", "meetings", "notices", "calendar"].includes(n.id);
    return true;
  });

  const renderSection = () => {
    switch (active) {
      case "dashboard": return <Dashboard meetings={meetings} inventory={inventory} notices={notices} tasks={tasks} expenses={expenses} profile={profile} userId={user?.uid} team={team} />;
      case "meetings": return <Meetings liveMeetings={meetings} />;
      case "notices": return <Notices liveNotices={notices} />;
      case "calendar": return <CalendarView liveEvents={calendarEvents} />;
      case "inventory": return <Inventory liveInventory={inventory} liveDocs={docs} userRole={profile.role} />;
      case "finance": return <Finance liveExpenses={expenses} />;
      case "projects": return <Projects liveTasks={tasks} liveTeams={team} userRole={profile.role} userId={user?.uid} profile={profile} allMembers={allUsers} />;
      case "team": return <Team liveTeams={team} allUsers={allUsers} profile={profile} userId={user?.uid} />;
      default: return <Dashboard meetings={meetings} inventory={inventory} notices={notices} tasks={tasks} expenses={expenses} profile={profile} userId={user?.uid} team={team} />;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center w-screen h-screen gap-3" style={{ background: C.bg }}>
        <LogoMark size={44} />
        <div className="text-xs tracking-[0.3em]" style={{ color: C.textFaint, fontFamily: FONT.head, animation: "spinxPulse 1.4s ease-in-out infinite" }}>
          LOADING SYSTEM
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="relative flex flex-col items-center justify-center w-screen h-screen overflow-hidden p-4" style={{ background: C.bg }}>
        <SprayStreak size={420} opacity={0.05} style={{ top: -80, right: -100 }} />
        <SprayStreak size={340} opacity={0.04} style={{ bottom: -100, left: -100, transform: "rotate(180deg)" }} />
        <div className="relative max-w-sm w-full p-6 sm:p-8 text-center" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
          <div className="flex justify-center mb-5">
            <LogoMark size={56} />
          </div>
          <div className="text-2xl tracking-[0.25em] mb-1" style={{ fontFamily: FONT.display, color: C.text, fontWeight: 800 }}>
            SPIN<span style={{ color: C.gold }}>X</span>
          </div>
          <div className="text-[11px] uppercase tracking-[0.2em] mb-7" style={{ color: C.textFaint, fontFamily: FONT.head }}>
            Workspace Access
          </div>
          <PrimaryBtn onClick={handleLogin}>Authenticate via Google</PrimaryBtn>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full min-h-screen relative overflow-x-hidden" style={{ background: C.bg, fontFamily: FONT.body }}>
      {/* MOBILE BACKDROP OVERLAY */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* SIDEBAR (DESKTOP & MOBILE DRAWER) */}
      <div
        className={`fixed md:static inset-y-0 left-0 z-50 flex flex-col shrink-0 transition-transform md:transition-all duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
        style={{
          width: collapsed ? 68 : 232,
          background: C.bgRaised,
          borderRight: `1px solid ${C.border}`
        }}
      >
        <div className="flex items-center justify-between px-4 h-16 shrink-0 border-b" style={{ borderColor: C.border }}>
          <LogoMark size={collapsed ? 32 : 46} />
          <button className="md:hidden" onClick={() => setMobileOpen(false)}>
            <X size={20} style={{ color: C.textFaint }} />
          </button>
        </div>

        <div className="flex-1 py-3 px-2.5 space-y-0.5 overflow-y-auto">
          {allowedNav.map(n => {
            const isActive = active === n.id;
            const IconComponent = n.icon || LayoutDashboard;
            return (
              <button
                key={n.id}
                onClick={() => {
                  setActive(n.id);
                  setMobileOpen(false);
                }}
                className="w-full flex items-center gap-3 px-2.5 py-2.5 relative transition-colors"
                style={{
                  background: isActive ? C.goldSoft : "transparent",
                  color: isActive ? C.gold : C.textDim,
                  borderLeft: isActive ? `2px solid ${C.gold}` : "2px solid transparent",
                }}
              >
                <IconComponent size={16} />
                {(!collapsed || mobileOpen) && (
                  <span className="text-sm font-medium" style={{ fontFamily: FONT.head }}>{n.label}</span>
                )}
              </button>
            );
          })}
        </div>

        <div className="hidden md:block p-2.5 shrink-0 border-t" style={{ borderColor: C.border }}>
          <button onClick={() => setCollapsed(!collapsed)} className="w-full text-center text-[11px] py-1.5" style={{ color: C.textFaint, fontFamily: FONT.head }}>
            {collapsed ? "Expand" : "Collapse menu"}
          </button>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* TOP HEADER */}
        <div className="flex items-center gap-2 sm:gap-4 px-4 sm:px-6 h-16 shrink-0 border-b" style={{ borderColor: C.border, background: C.bg }}>
          {/* HAMBURGER TOGGLE */}
          <button className="md:hidden p-1.5" onClick={() => setMobileOpen(true)}>
            <Menu size={20} style={{ color: C.text }} />
          </button>

          {profile.role !== "Owner" && (
            <div className="flex items-center gap-2 sm:gap-3 px-2.5 py-1 sm:px-3 sm:py-1.5" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
              <Award size={14} style={{ color: C.gold }} />
              <div className="text-[11px] sm:text-xs font-medium" style={{ color: C.textDim, fontFamily: FONT.body }}>
                <span className="hidden sm:inline">Score: </span>
                <span style={{ color: C.text, fontFamily: FONT.mono }}>{profile.points || 0}</span>/5k
              </div>
              {profile.points >= 5000 && (
                <button onClick={handleRedeemPoints} className="text-[9px] sm:text-[10px] uppercase font-bold px-1.5 py-0.5" style={{ background: C.gold, color: "#15110A", fontFamily: FONT.head }}>
                  Redeem
                </button>
              )}
            </div>
          )}

          <div className="ml-auto flex items-center gap-2 sm:gap-4">
            <Badge tone="gold">{profile.role}</Badge>
            <button onClick={handleLogout} style={{ color: C.textFaint }}>
              <LogOut size={16} />
            </button>
            <div className="flex items-center gap-2">
              {user?.photoURL ? (
                <img src={user.photoURL} className="w-7 h-7 sm:w-8 sm:h-8 border" style={{ borderColor: C.border, borderRadius: "50%" }} alt="avatar" />
              ) : (
                <Avatar name={user?.displayName || "User"} size={30} />
              )}
              <div className="text-left hidden sm:block">
                <div className="text-xs font-semibold leading-none" style={{ color: C.text, fontFamily: FONT.head }}>{user?.displayName}</div>
                <div className="text-[10px] mt-0.5" style={{ color: C.textFaint, fontFamily: FONT.mono }}>{user?.email}</div>
              </div>
            </div>
          </div>
        </div>

        {/* WORKSPACE VIEW CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6" style={{ background: C.bg }}>
          {active === "team" ? (
            <div>
              <Team liveTeams={team} allUsers={allUsers} profile={profile} userId={user?.uid} />

              {["Owner", "Head Developer"].includes(profile.role) && (
                <div className="mt-8">
                  <div className="flex items-center gap-2 mb-3">
                    <ShieldCheck size={14} style={{ color: C.gold }} />
                    <div className="text-xs sm:text-sm font-semibold uppercase tracking-wider" style={{ color: C.text, fontFamily: FONT.head }}>
                      System Core Access Controls
                    </div>
                  </div>
                  <Card pad="p-0" className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs min-w-[500px]">
                      <thead>
                        <tr style={{ background: C.surface3, borderBottom: `1px solid ${C.border}` }}>
                          {["Member Name", "Email Handle", "Score Ledger", "System Access Privilege"].map(h => (
                            <th key={h} className="p-3 text-[11px] uppercase tracking-wider font-medium" style={{ color: C.textFaint, fontFamily: FONT.head }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {allUsers.map((u) => (
                          <tr key={u.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                            <td className="p-3 font-semibold" style={{ color: C.text, fontFamily: FONT.body }}>{u.name}</td>
                            <td className="p-3" style={{ color: C.textFaint, fontFamily: FONT.mono }}>{u.email}</td>
                            <td className="p-3 font-semibold" style={{ color: C.gold, fontFamily: FONT.mono }}>{u.role === "Owner" ? "—" : `${u.points || 0} pts`}</td>
                            <td className="p-3">
                              <select
                                value={u.role || "Presenter"}
                                onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                                className="border px-2 py-1 text-xs outline-none"
                                style={{ background: C.bg, borderColor: C.border, color: C.text, fontFamily: FONT.body }}
                              >
                                <option value="Owner">Owner</option>
                                {/* Maps custom roles pulled dynamically from Firestore */}
                                {rolesList.map(r => (
                                  <option key={r.id} value={r.name}>{r.name}</option>
                                ))}
                                {/* Failsafe for unmapped roles */}
                                {!rolesList.find(r => r.name === u.role) && u.role !== "Owner" && (
                                  <option value={u.role}>{u.role}</option>
                                )}
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
            renderSection()
          )}
        </div>
      </div>

      {/* FLOATING AI ASSISTANT */}
      {!aiOpen && (
        <button
          onClick={() => setAiOpen(true)}
          className="fixed z-40 flex items-center justify-center transition-transform"
          style={{
            bottom: 16, right: 16, width: 44, height: 44,
            background: C.gold, color: "#15110A",
            clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
            boxShadow: "0 4px 18px rgba(254,192,45,0.35)",
          }}
        >
          <Sparkles size={18} />
        </button>
      )}

      {aiOpen && (
        <div className="fixed z-50 flex flex-col inset-x-3 bottom-3 sm:inset-auto sm:bottom-5 sm:right-5 sm:w-[360px] max-h-[75vh]" style={{ background: C.bgRaised, border: `1px solid ${C.border}`, boxShadow: "0 10px 40px rgba(0,0,0,0.5)" }}>
          <div className="flex items-center justify-between px-4 h-11 shrink-0 border-b" style={{ borderColor: C.border }}>
            <div className="flex items-center gap-2">
              <Sparkles size={14} style={{ color: C.gold }} />
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: C.text, fontFamily: FONT.head }}>AI Assistant</span>
            </div>
            <button onClick={() => setAiOpen(false)}><X size={16} style={{ color: C.textFaint }} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <AIFeatures />
          </div>
        </div>
      )}
    </div>
  );
}