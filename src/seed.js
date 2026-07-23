import { db } from "./firebase";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { 
  initialMeetings, 
  initialNotices, 
  initialExpenses, 
  inventoryData, 
  initialTasks, 
  teamMembers, 
  docGroups, 
  initialProcurement 
} from "./data";

export async function seedDatabase() {
  try {
    // 1. Seed Meetings
    if (initialMeetings) {
      for (const item of initialMeetings) {
        await addDoc(collection(db, "meetings"), { ...item, createdAt: new Date() });
      }
    }

    // 2. Seed Notices
    if (initialNotices) {
      for (const item of initialNotices) {
        await addDoc(collection(db, "notices"), { ...item, createdAt: new Date() });
      }
    }

    // 3. Seed Expenses
    if (initialExpenses) {
      for (const item of initialExpenses) {
        await addDoc(collection(db, "expenses"), { ...item, createdAt: new Date() });
      }
    }

    // 4. Seed Detailed Hierarchical Inventory (Clears old flat items first)
    const invRef = collection(db, "inventory");
    const existingInv = await getDocs(invRef);
    for (const d of existingInv.docs) {
      await deleteDoc(doc(db, "inventory", d.id));
    }
    
    if (inventoryData) {
      for (const locationObj of inventoryData) {
        await addDoc(collection(db, "inventory"), {
          ...locationObj,
          createdAt: new Date()
        });
      }
    }

    // 5. Seed Tasks
    if (initialTasks) {
      for (const item of initialTasks) {
        await addDoc(collection(db, "tasks"), { ...item, createdAt: new Date() });
      }
    }

    // 6. Seed Team Members
    if (teamMembers) {
      for (const m of teamMembers) {
        await addDoc(collection(db, "team"), {
          name: m.name,
          role: m.role,
          attendance: m.attendance,
          log: m.log,
          createdAt: new Date()
        });
      }
    }

    // 7. Seed Documentation
    if (docGroups) {
      for (const group of docGroups) {
        await addDoc(collection(db, "documentation"), {
          project: group.project,
          docs: group.docs,
          createdAt: new Date()
        });
      }
    }

    // 8. Seed Procurement
    if (initialProcurement) {
      for (const item of initialProcurement) {
        await addDoc(collection(db, "procurement"), { ...item, createdAt: new Date() });
      }
    }

    console.log("Database successfully re-seeded with all dynamic inventory collections!");
  } catch (error) {
    console.error("Error seeding database: ", error);
  }
}