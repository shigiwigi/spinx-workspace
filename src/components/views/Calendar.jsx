import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Trash2, Megaphone, CalendarDays } from "lucide-react";
import { collection, addDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { C, FONT } from "../../theme";
import { Card, SectionHeader, PrimaryBtn, GhostBtn } from "../Primitives";

const inputStyle = { borderColor: C.border, background: "transparent", color: C.text, fontFamily: FONT.body };
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function toKey(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

export function CalendarView({ liveEvents = [] }) {
  const today = new Date();
  const [cursor, setCursor] = useState({ y: today.getFullYear(), m: today.getMonth() });
  const [selected, setSelected] = useState(toKey(today.getFullYear(), today.getMonth(), today.getDate()));
  const [draft, setDraft] = useState({ title: "", note: "" });

  const y = cursor.y, m = cursor.m;
  const firstDow = new Date(y, m, 1).getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();

  const eventsByDay = {};
  liveEvents.forEach(ev => {
    (eventsByDay[ev.date] = eventsByDay[ev.date] || []).push(ev);
  });

  const shiftMonth = (dir) => {
    let nm = m + dir, ny = y;
    if (nm < 0) { nm = 11; ny -= 1; }
    if (nm > 11) { nm = 0; ny += 1; }
    setCursor({ y: ny, m: nm });
  };

  const addEvent = async () => {
    if (!draft.title.trim() || !selected) return;
    await addDoc(collection(db, "calendarEvents"), {
      date: selected,
      title: draft.title.trim(),
      note: draft.note.trim(),
      createdAt: new Date()
    });
    setDraft({ title: "", note: "" });
  };

  const removeEvent = async (id) => {
    await deleteDoc(doc(db, "calendarEvents", id));
  };

  const postToNotices = async (ev) => {
    await addDoc(collection(db, "notices"), {
      title: `Reminder: ${ev.title}`,
      body: `${ev.note ? ev.note + " — " : ""}Scheduled for ${ev.date}.`,
      team: "General",
      pinned: false,
      reads: 0,
      total: 14,
      createdAt: new Date()
    });
    alert("Posted to Notices.");
  };

  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const selectedEvents = eventsByDay[selected] || [];

  return (
    <div>
      <SectionHeader title="Calendar" subtitle="Team schedule, reminders and monthly planning." />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* MAIN CALENDAR GRID */}
        <Card className="lg:col-span-2" pad="p-3 sm:p-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm sm:text-base font-semibold" style={{ color: C.text, fontFamily: FONT.head }}>
              {MONTHS[m]} {y}
            </span>
            <div className="flex items-center gap-1.5">
              <button onClick={() => shiftMonth(-1)} className="p-1.5 border hover:bg-white/5 transition-colors" style={{ borderColor: C.border }}><ChevronLeft size={14} style={{ color: C.textDim }} /></button>
              <button onClick={() => shiftMonth(1)} className="p-1.5 border hover:bg-white/5 transition-colors" style={{ borderColor: C.border }}><ChevronRight size={14} style={{ color: C.textDim }} /></button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 sm:gap-1.5 mb-1.5">
            {DOW.map(d => (
              <div key={d} className="text-center text-[9px] sm:text-[10px] uppercase tracking-wider py-1 truncate" style={{ color: C.textFaint, fontFamily: FONT.head }}>{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
            {cells.map((d, i) => {
              if (d === null) return <div key={i} />;
              const key = toKey(y, m, d);
              const dayEvents = eventsByDay[key] || [];
              const isSelected = key === selected;
              const isToday = key === toKey(today.getFullYear(), today.getMonth(), today.getDate());
              return (
                <button
                  key={i}
                  onClick={() => setSelected(key)}
                  className="relative flex flex-col items-center sm:items-start p-1 sm:p-1.5 text-center sm:text-left transition-colors"
                  style={{
                    minHeight: "48px",
                    background: isSelected ? C.goldSoft : C.surface,
                    border: `1px solid ${isSelected ? C.goldLine : C.border}`,
                  }}
                >
                  <span
                    className="text-[11px] sm:text-xs"
                    style={{
                      color: isToday ? C.gold : C.text,
                      fontFamily: FONT.mono,
                      fontWeight: isToday ? 700 : 400,
                    }}
                  >
                    {d}
                  </span>
                  {dayEvents.length > 0 && (
                    <div className="flex flex-wrap justify-center sm:justify-start gap-0.5 mt-1 sm:mt-1.5">
                      {dayEvents.slice(0, 3).map((_, idx) => (
                        <div key={idx} style={{ width: 4, height: 4, borderRadius: "50%", background: C.gold }} />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </Card>

        {/* DETAILS & FORM PANEL */}
        <Card pad="p-4">
          <div className="flex items-center gap-2 mb-1">
            <CalendarDays size={13} style={{ color: C.gold }} />
            <span className="text-[11px] uppercase tracking-wider font-semibold" style={{ color: C.textFaint, fontFamily: FONT.head }}>
              {selected}
            </span>
          </div>

          <div className="space-y-2 my-3 max-h-[250px] overflow-y-auto pr-1">
            {selectedEvents.length === 0 ? (
              <p className="text-xs py-3 text-center" style={{ color: C.textFaint, fontFamily: FONT.body }}>No reminders on this day.</p>
            ) : (
              selectedEvents.map(ev => (
                <div key={ev.id} className="p-2.5" style={{ background: C.surface3, border: `1px solid ${C.border}` }}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-xs font-semibold" style={{ color: C.text, fontFamily: FONT.head }}>{ev.title}</div>
                    <button onClick={() => removeEvent(ev.id)}><Trash2 size={12} style={{ color: C.danger }} /></button>
                  </div>
                  {ev.note && <div className="text-[11px] mt-1" style={{ color: C.textDim, fontFamily: FONT.body }}>{ev.note}</div>}
                  <div className="mt-2"><GhostBtn icon={Megaphone} onClick={() => postToNotices(ev)}>Post to Notices</GhostBtn></div>
                </div>
              ))
            )}
          </div>

          <div className="pt-3 space-y-2" style={{ borderTop: `1px solid ${C.border}` }}>
            <input placeholder="Reminder title" value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })}
              className="w-full border px-2.5 py-1.5 text-xs outline-none" style={inputStyle} />
            <textarea placeholder="Notes (optional)" rows={2} value={draft.note} onChange={e => setDraft({ ...draft, note: e.target.value })}
              className="w-full border px-2.5 py-1.5 text-xs outline-none resize-none" style={inputStyle} />
            <PrimaryBtn onClick={addEvent} icon={Plus} small disabled={!draft.title.trim()}>Add reminder</PrimaryBtn>
          </div>
        </Card>
      </div>
    </div>
  );
}