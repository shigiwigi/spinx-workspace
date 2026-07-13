import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";
import { 
  initialMeetings, initialNotices, initialExpenses, 
  initialInventory, initialTasks, teamMembers, docGroups, initialProcurement 
} from "./data";

export async function seedDatabase() {
  try {
    // ... (Keep the previous meetings, notices, expenses, inventory, and tasks loops exactly as they were)

    // 6. Seed Team Members
    for (const m of teamMembers) {
      await addDoc(collection(db, "team"), {
        name: m.name,
        role: m.role,
        attendance: m.attendance,
        log: m.log,
        createdAt: new Date()
      });
    }

    // 7. Seed Documentation
    for (const group of docGroups) {
      await addDoc(collection(db, "documentation"), {
        project: group.project,
        docs: group.docs, // Storing array of doc objects inside the project document
        createdAt: new Date()
      });
    }

    // 8. Seed Procurement
    for (const p of initialProcurement) {
      await addDoc(collection(db, "procurement"), {
        item: p.item,
        vendor: p.vendor,
        quote: p.quote,
        status: p.status,
        createdAt: new Date()
      });
    }

    console.log("Database successfully re-seeded with all collections!");
  } catch (error) {
    console.error("Error seeding database: ", error);
  }
}