import { db } from "./firebase";
import { collection, doc, setDoc, addDoc } from "firebase/firestore";
import { 
  initialMeetings, 
  initialNotices, 
  initialExpenses, 
  initialInventory, 
  initialTasks 
} from "./data";

export async function seedDatabase() {
  try {
    // 1. Seed Meetings
    for (const m of initialMeetings) {
      await addDoc(collection(db, "meetings"), {
        title: m.title,
        date: m.date,
        time: m.time,
        attendees: m.attendees,
        status: m.status,
        notes: m.notes,
        actions: m.actions,
        createdAt: new Date()
      });
    }

    // 2. Seed Notices
    for (const n of initialNotices) {
      await addDoc(collection(db, "notices"), {
        title: n.title,
        body: n.body,
        team: n.team,
        pinned: n.pinned,
        reads: n.reads,
        total: n.total,
        createdAt: new Date()
      });
    }

    // 3. Seed Expenses
    for (const e of initialExpenses) {
      await addDoc(collection(db, "expenses"), {
        desc: e.desc,
        cat: e.cat,
        amt: e.amt,
        date: e.date,
        createdAt: new Date()
      });
    }

    // 4. Seed Inventory
    for (const i of initialInventory) {
      await addDoc(collection(db, "inventory"), {
        name: i.name,
        qty: i.qty,
        low: i.low,
        supplier: i.supplier,
        date: i.date,
        createdAt: new Date()
      });
    }

    // 5. Seed Tasks (Kanban)
    // For Kanban, we'll store tasks in a unified collection with a 'status' field
    const statusMap = { todo: "todo", progress: "progress", done: "done" };
    for (const [columnKey, taskArray] of Object.entries(initialTasks)) {
      for (const t of taskArray) {
        await addDoc(collection(db, "tasks"), {
          title: t.title,
          tag: t.tag,
          due: t.due,
          people: t.people,
          status: statusMap[columnKey],
          createdAt: new Date()
        });
      }
    }

    console.log("Database successfully seeded!");
  } catch (error) {
    console.error("Error seeding database: ", error);
  }
}