import { 
  LayoutDashboard, 
  Kanban, 
  Boxes, 
  Calendar, 
  Users, 
  Bell 
} from "lucide-react";

// Navigation links (Removed Procurement, AI Features, Analytics, Finance per your setup)
export const NAV = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "projects", label: "Projects", icon: Kanban },
  { id: "inventory", label: "Inventory", icon: Boxes },
  { id: "meetings", label: "Meetings", icon: Calendar },
  { id: "team", label: "Team", icon: Users },
  { id: "notices", label: "Notices", icon: Bell }
];

// Teams data
export const TEAMS = [
  "Core Hardware",
  "Firmware & Flight Control",
  "Software & Ground Station",
  "Payload & Integration",
  "Operations & Logistics"
];

// Initial mock state exports used by seed script
export const initialMeetings = [];
export const initialNotices = [];
export const initialExpenses = [];
export const initialTasks = [];
export const teamMembers = [];
export const docGroups = [];
export const initialProcurement = [];

// Detailed Hierarchical Inventory Dataset for Seeding
export const inventoryData = [
  {
    location: "Closet",
    sections: [
      {
        name: "Shelf 1",
        items: [
          { name: "Analog FPV Goggles", quantity: "2" },
          { name: "DJI Mini 3 Drone", quantity: "1" },
          { name: "FlySky FS-i6 TX/RX Set", quantity: "1" },
          { name: "H1 Receiver", quantity: "1" },
          { name: "F450R H1 Kit (Complete)", quantity: "1" },
          { name: "F450R H2 Kit (Complete)", quantity: "1" },
          { name: "DIY Camera Drone", quantity: "1" },
          { name: "DIY Drone Kit - XYQ1 Model", quantity: "7" },
          { name: "DIY Drone Kit - XYQ2 Model", quantity: "3" },
          { name: "Toy Drone", quantity: "3" },
          { name: "DJI SIM Kit Box", quantity: "1" },
          { name: "FPV Parts Box", quantity: "1" },
          { name: "Pixhawk Flight Controller Kit", quantity: "1" }
        ]
      },
      {
        name: "Shelf 2",
        items: [
          { name: "DIY Drone Battery & Charger Box", quantity: "1" }
        ],
        subBoxes: [
          {
            boxName: "DJI SIM Kit Box",
            items: [
              { name: "Phantom Remote Controller", quantity: "2" },
              { name: "Phone Stand", quantity: "1" },
              { name: "USB-A to Micro-USB Cable", quantity: "2" },
              { name: "Phantom Remote Charger", quantity: "1" }
            ]
          },
          {
            boxName: "DIY Drone Battery & Charger Box",
            items: [
              { name: "DIY Battery Charger", quantity: "10" },
              { name: "3.75 V LiPo Battery", quantity: "5" },
              { name: "4.0 V LiPo Battery", quantity: "4" },
              { name: "3.75 V Li-ion Battery", quantity: "3" },
              { name: "4.0 V Li-ion Battery", quantity: "10" }
            ]
          }
        ]
      },
      {
        name: "Shelf 3",
        items: [
          { name: "Sticker Sheets", quantity: "9" },
          { name: "Hole Puncher", quantity: "1" },
          { name: "Reflective Safety Vest", quantity: "2" },
          { name: "Sahhridaya Memento", quantity: "1" },
          { name: "Envelope", quantity: "24" },
          { name: "Radiomaster Box", quantity: "1" },
          { name: "Tags - Yellow", quantity: "11" },
          { name: "Tags - Black", quantity: "1" },
          { name: "Transparent Files", quantity: "5" },
          { name: "Organiser Files", quantity: "3" },
          { name: "Large Notebooks", quantity: "3" },
          { name: "Small Notebook", quantity: "1" },
          { name: "Sticky Pad", quantity: "1" },
          { name: "Drone Handbook", quantity: "1" },
          { name: "Instrument / Scale Set", quantity: "1" },
          { name: "Printer Rolls", quantity: "2" },
          { name: "Receipt Printer", quantity: "1" },
          { name: "Visiting Cards", quantity: "Assorted" },
          { name: "Meteor Drone", quantity: "2" },
          { name: "GoPro Camera", quantity: "1" },
          { name: "Naked GoPro Kit", quantity: "1" },
          { name: "DIY Drone Spare Parts Box", quantity: "1" },
          { name: "Spare Cables Box", quantity: "1" },
          { name: "Goggles Power Cord", quantity: "1" },
          { name: "Wire Stripper", quantity: "1" },
          { name: "Tweezers", quantity: "3" },
          { name: "Blade", quantity: "1" },
          { name: "Stanley Allen Key Set", quantity: "1" },
          { name: "Jumper Wire Set", quantity: "1" },
          { name: "Cleaning Brush Set", quantity: "1" },
          { name: "HTC Multimeter", quantity: "1" },
          { name: "MyTLock Super Glue", quantity: "2" },
          { name: "Chalk Box - White", quantity: "1" }
        ],
        subBoxes: [
          {
            boxName: "Radiomaster Box",
            items: [
              { name: "Brochures", quantity: "Assorted" },
              { name: "Stickers", quantity: "Assorted" },
              { name: "Instagram QR Scan Cards", quantity: "Assorted" }
            ]
          }
        ]
      },
      {
        name: "Shelf 4",
        items: [
          { name: "Chalk Box - Multicolour", quantity: "1" },
          { name: "OMAX Duster", quantity: "1" },
          { name: "Permanent Marker", quantity: "3" },
          { name: "Whiteboard Marker", quantity: "3" }
        ],
        subBoxes: [
          {
            boxName: "Radiomaster Box",
            items: [
              { name: "Naked GoPro", quantity: "1" },
              { name: "GEPRC Box", quantity: "2" },
              { name: "DJI ND Filter Set", quantity: "2" }
            ]
          },
          {
            boxName: "DIY Drone Spare Parts Box",
            items: [
              { name: "Drone Controller Board", quantity: "3" },
              { name: "Remote Controller Board", quantity: "2" },
              { name: "Remote Joystick", quantity: "4" },
              { name: "Orange DIY Drone Propellers", quantity: "Assorted" },
              { name: "White DIY Drone Propellers", quantity: "Assorted" }
            ]
          }
        ]
      },
      {
        name: "Shelf 5",
        items: [
          { name: "All Screws Box", quantity: "1" },
          { name: "Hardware Cardboard Box", quantity: "1" },
          { name: "F450R Kit Tray", quantity: "1" },
          { name: "Cabinet Net", quantity: "1" },
          { name: "Zip Bags", quantity: "Assorted" },
          { name: "DIY Box", quantity: "1" },
          { name: "Adidas Bag", quantity: "1 (Contents Pending)" },
          { name: "FPV Propellers", quantity: "9" },
          { name: "DJI Propellers", quantity: "4 (3 Good + 1 Spare)" },
          { name: "Protect Frame", quantity: "1" },
          { name: "Protect Damper & Strap Set", quantity: "1" },
          { name: "Slip Elbow", quantity: "1" },
          { name: "Bush", quantity: "49" },
          { name: "Cable Clips", quantity: "5" },
          { name: "Cable Ties", quantity: "2 Packs" },
          { name: "Pump", quantity: "1" }
        ],
        subBoxes: [
          {
            boxName: "DIY Box",
            items: [
              { name: "Brochures", quantity: "Assorted" },
              { name: "Broken Parts", quantity: "Assorted" },
              { name: "Spare Frames", quantity: "Assorted" }
            ]
          },
          {
            boxName: "F450R Kit Tray",
            items: [
              { name: "Servo Motor", quantity: "1" },
              { name: "Switch", quantity: "1" },
              { name: "Prop Brush", quantity: "1" },
              { name: "F450 Legs", quantity: "5" },
              { name: "F450 Motors", quantity: "10" },
              { name: "F450 ESCs", quantity: "8 (5 Good + 3 Spare/Used)" },
              { name: "F450 Power Distribution Boards (PDB)", quantity: "2" },
              { name: "Phantom Motors", quantity: "2" },
              { name: "F450 Propellers", quantity: "7 Good + 4 Used/Damaged" },
              { name: "F450 Landing Legs", quantity: "1 Set" }
            ]
          },
          {
            boxName: "Hardware Cardboard Box",
            items: [
              { name: "LAN Cable", quantity: "1" },
              { name: "SMPS", quantity: "2" },
              { name: "Power Socket", quantity: "2" },
              { name: "Power Plug", quantity: "3" },
              { name: "Screen Wiper", quantity: "2" },
              { name: "3Way -Elbow", quantity: "4" },
              { name: "T-Elbow", quantity: "12" },
              { name: "Elbow", quantity: "14" }
            ]
          }
        ]
      }
    ]
  },
  {
    location: "Drone Grill",
    sections: [
      {
        name: "General",
        items: [
          { name: "F450 Drone", quantity: "1" },
          { name: "Meteor Drone", quantity: "1" },
          { name: "DIY Drone", quantity: "1" },
          { name: "Toy Drone", quantity: "1" },
          { name: "Pocket Drone", quantity: "2" },
          { name: "FlySky Remote", quantity: "1" },
          { name: "Phantom Remote", quantity: "1" },
          { name: "DIY Remote", quantity: "1" }
        ]
      }
    ]
  },
  {
    location: "Table 1",
    sections: [
      {
        name: "General",
        items: [
          { name: "DJI Phantom Drone", quantity: "1" },
          { name: "Phantom Remote", quantity: "1" },
          { name: "DJI Avata", quantity: "1" },
          { name: "DJI Goggles V2", quantity: "1" },
          { name: "DJI Motion Controller", quantity: "1" },
          { name: "DJI Avata Battery", quantity: "2" },
          { name: "DJI Avata Charging Hub", quantity: "1" },
          { name: "Rubber Mat", quantity: "1" },
          { name: "DJI Avata Box", quantity: "1" },
          { name: "Drone Stand", quantity: "1" }
        ]
      },
      {
        name: "Under the Table",
        items: [
          { name: "Wireless Transceiver Module", quantity: "1" },
          { name: "Ultrasonic Sensor", quantity: "4" },
          { name: "MG90S Metal Gear Micro Servo", quantity: "1" },
          { name: "Motor Driver Module", quantity: "2" },
          { name: "3.7V Li-ion Cell", quantity: "1" },
          { name: "3.7V Battery Holder", quantity: "1" }
        ],
        subBoxes: [
          {
            boxName: "Organizer Box #2",
            items: [
              { name: "ESP32 Development Board", quantity: "2" },
              { name: "Arduino Nano", quantity: "1" },
              { name: "PS2 Joystick Module", quantity: "2" },
              { name: "DC-DC Step-Up Converter (MT3608)", quantity: "1" },
              { name: "PIR Motion Sensor", quantity: "3" },
              { name: "Micro Servo", quantity: "6" },
              { name: "DC-DC Step-Up Converter (XL6009E1)", quantity: "1" },
              { name: "Flame Sensor", quantity: "3" },
              { name: "PCB (Prototype Board)", quantity: "4" },
              { name: "INMP441 Digital MEMS Microphone Module", quantity: "Stored separately" },
              { name: "40 mm Mini Speaker", quantity: "2" },
              { name: "Volt/Ammeter", quantity: "1" },
              { name: "NRF Adapter", quantity: "1" },
              { name: "Giga-Tek 23A 12V Alkaline Battery", quantity: "3" },
              { name: "23A 12V Battery Holder", quantity: "4" },
              { name: "ESP32 DevKit V1", quantity: "1" }
            ]
          },
          {
            boxName: "Organizer Box #3 (Resistor Box)",
            items: [
              { name: "47kΩ Resistor", quantity: "10" },
              { name: "22kΩ Resistor", quantity: "10" },
              { name: "4.6kΩ Resistor", quantity: "10" },
              { name: "1kΩ Resistor", quantity: "10" },
              { name: "10kΩ Resistor", quantity: "10" },
              { name: "100kΩ Resistor", quantity: "20" },
              { name: "220Ω Resistor", quantity: "10" },
              { name: "Remaining Resistors", quantity: "10" },
              { name: "LED", quantity: "10" },
              { name: "Long LED", quantity: "11" },
              { name: "Bent LED", quantity: "14" },
              { name: "Large LED", quantity: "2" },
              { name: "LDR", quantity: "5" },
              { name: "Capacitor", quantity: "11" },
              { name: "Gousheng", quantity: "2" }
            ]
          },
          {
            boxName: "Organizer Box #4",
            items: [
              { name: "Large Heat Shrink Sleeves", quantity: "13" },
              { name: "Medium Heat Shrink Sleeves", quantity: "19" },
              { name: "Small Heat Shrink Sleeves", quantity: "20" },
              { name: "Very Small Heat Shrink Sleeves", quantity: "47" },
              { name: "XT60 Male Connectors", quantity: "5" },
              { name: "XT60 Female Connectors", quantity: "5" },
              { name: "Deans (T-Plug) Connectors", quantity: "4" },
              { name: "Gold Male Bullet Connectors", quantity: "23" },
              { name: "Gold Female Bullet Connectors", quantity: "24" },
              { name: "Straight Male Pin Header Strips", quantity: "6 sets" },
              { name: "Right-Angle Male Pin Header Strips", quantity: "2 sets" },
              { name: "2-Pin Panel Power Connector", quantity: "1" }
            ]
          },
          {
            boxName: "Ziplock Bag #1",
            items: [
              { name: "SpeedyBee F405 V4 Flight Controller", quantity: "1" },
              { name: "SpeedyBee 4-in-1 ESC", quantity: "1" },
              { name: "XT60 Battery Connector with Silicone Power Leads", quantity: "1" },
              { name: "Low-ESR Capacitor", quantity: "1" },
              { name: "GPS Module", quantity: "1" },
              { name: "GPS Cable/Harness", quantity: "1" },
              { name: "2.4 GHz Receiver Antenna (T-Antenna)", quantity: "1" },
              { name: "Signal/Power Wiring Harness", quantity: "1" }
            ]
          },
          {
            boxName: "Ziplock Bag #2",
            items: [
              { name: "New AA Batteries", quantity: "3" },
              { name: "Used AA Batteries", quantity: "5" }
            ]
          },
          {
            boxName: "Ziplock Bag #3",
            items: [
              { name: "Protec FPV Frame Spare Parts", quantity: "1 set" },
              { name: "TPU Printed Frame Parts", quantity: "Assorted" },
              { name: "Camera Mounting Plates/Brackets", quantity: "Assorted" },
              { name: "Aluminum Standoffs/Spacers", quantity: "Assorted" },
              { name: "Mounting Screws", quantity: "Assorted" },
              { name: "Nuts and Washers", quantity: "Assorted" },
              { name: "Frame Hardware and Miscellaneous Spare Parts", quantity: "Assorted" }
            ]
          }
        ]
      }
    ]
  },
  {
    location: "Table 2",
    sections: [
      {
        name: "Above the Table",
        items: [],
        subBoxes: [
          {
            boxName: "Organizer Box #1",
            items: [
              { name: "ESP32", quantity: "1" },
              { name: "ESP32-CAM", quantity: "3" },
              { name: "Switch", quantity: "3" },
              { name: "Small Screw Zip Bags", quantity: "4" },
              { name: "Small RGB LED", quantity: "3" },
              { name: "Moisture/Humidity Sensor", quantity: "1" },
              { name: "Buzzer", quantity: "2" },
              { name: "Battery Charging Board", quantity: "1" },
              { name: "Propeller Lock Nut", quantity: "2" },
              { name: "Potentiometer", quantity: "1" },
              { name: "Servo Arms & Screws", quantity: "1" },
              { name: "Arduino Nano", quantity: "1" },
              { name: "Antenna Module & Antenna", quantity: "1" },
              { name: "DC Barrel M-F Extension", quantity: "3" },
              { name: "DC Barrel Male Power Plug", quantity: "1" },
              { name: "Meteor 550mAh", quantity: "4 (1 faulty)" },
              { name: "Serial Converter", quantity: "1" },
              { name: "MG90 Servo", quantity: "3" },
              { name: "1-Channel Relay Module", quantity: "1" },
              { name: "Metal Geared DC Motor", quantity: "3" },
              { name: "12V 23A Battery", quantity: "3" },
              { name: "Servo Checker", quantity: "1" },
              { name: "Servo Driver", quantity: "1" },
              { name: "Volt Checker", quantity: "1" },
              { name: "AA Cells", quantity: "8" },
              { name: "Meteor 380mAh", quantity: "2" },
              { name: "FlySky RX #2", quantity: "1" },
              { name: "450 ESC", quantity: "1" },
              { name: "LiPo Charger", quantity: "1" },
              { name: "LiPo Battery", quantity: "2" },
              { name: "Coreless DC Motor", quantity: "2" },
              { name: "Servo Single Arm", quantity: "White x9, Black x2" },
              { name: "Servo Double Arm", quantity: "White x10, Black x2" },
              { name: "Servo Cross Arm", quantity: "White x8, Black x4" }
            ]
          },
          {
            boxName: "Master Box",
            items: [
              { name: "Foam Drone Body/Frame", quantity: "1" },
              { name: "TowerPro MG90S", quantity: "2" },
              { name: "Foam Mounting/Body Parts", quantity: "2" },
              { name: "USB Type-C Cable", quantity: "2" },
              { name: "Jumper Wires", quantity: "1 bunch" },
              { name: "Mini Quadcopter Prototype", quantity: "1" },
              { name: "Li-Po Battery", quantity: "2" },
              { name: "LED Strip", quantity: "1" },
              { name: "Relay Module (2-Channel)", quantity: "1" },
              { name: "Mini Breadboard", quantity: "1" },
              { name: "Miscellaneous Electronic Modules & Wires", quantity: "1 assortment" }
            ]
          },
          {
            boxName: "Toolkit",
            items: [
              { name: "Printed Circuit Board - Small", quantity: "2" },
              { name: "Printed Circuit Board - Large", quantity: "1" },
              { name: "Wire Stripper - Small", quantity: "1" },
              { name: "Wire Stripper - Large", quantity: "1" },
              { name: "Tweezer", quantity: "1" },
              { name: "Paper Blade", quantity: "1" },
              { name: "Star Screwdriver - Small", quantity: "1" },
              { name: "Pin Connector", quantity: "5" },
              { name: "Breadboard - Small", quantity: "1" },
              { name: "Breadboard - Large", quantity: "1" },
              { name: "PCB Ruler", quantity: "1" },
              { name: "Jumper Cable", quantity: "3 sets" },
              { name: "Soldering Iron", quantity: "1" },
              { name: "Screwdriver Set", quantity: "1" }
            ]
          }
        ]
      },
      {
        name: "Individual Components",
        items: [
          { name: "Cutting Mat", quantity: "1" },
          { name: "Working Mat", quantity: "1" },
          { name: "Work Lamp", quantity: "1" },
          { name: "Multi-functional Solder Stand", quantity: "1" },
          { name: "Multimeter", quantity: "1" },
          { name: "White Soldering Iron", quantity: "1" },
          { name: "Pen Stand", quantity: "1" }
        ]
      }
    ]
  },
  {
    location: "Table 3",
    sections: [
      {
        name: "General",
        items: [
          { name: "Multimeter", quantity: "2" },
          { name: "Cutting Mat", quantity: "1" },
          { name: "Work Mat", quantity: "2" },
          { name: "Soldering Iron", quantity: "2" },
          { name: "Glue Gun", quantity: "1" },
          { name: "Toolbox", quantity: "2" }
        ]
      }
    ]
  },
  {
    location: "Table 4",
    sections: [
      {
        name: "General",
        items: [
          { name: "Laptop Stand", quantity: "3" }
        ]
      }
    ]
  },
  {
    location: "Table 5",
    sections: [
      {
        name: "On Top of Table",
        items: [
          { name: "Mug", quantity: "1" },
          { name: "Pen Box", quantity: "1" },
          { name: "Jet Scale Model", quantity: "1" },
          { name: "Spray Paint- Matte Black", quantity: "1" },
          { name: "Spray Paint - Medium Yellow", quantity: "1" },
          { name: "Spray Paint Matte White", quantity: "1" },
          { name: "Spray Paint - Bright Gold", quantity: "1" },
          { name: "Spray Paint - Silver", quantity: "1" },
          { name: "Toolbox - Pro H1 (with previously listed contents)", quantity: "1" },
          { name: "Multi-purpose L-square / Protractor Ruler", quantity: "1" },
          { name: "Turbo Table Fan", quantity: "1" },
          { name: "Binoculars", quantity: "1" },
          { name: "Speakers (Set)", quantity: "1" },
          { name: "Work Mat", quantity: "1" },
          { name: "Adjustable DC Bench Power Supply", quantity: "1" },
          { name: "Baofeng Handheld Walkie-Talkie", quantity: "2" },
          { name: "Walkie-Talkie Charging Dock", quantity: "2" },
          { name: "Extension Board / Multi-Plug Power Strip", quantity: "1" },
          { name: "WD-40", quantity: "1" },
          { name: "Super Glue", quantity: "1" }
        ]
      }
    ]
  },
  {
    location: "Table 6",
    sections: [
      {
        name: "Drawer of Table",
        items: [
          { name: "Black 4S LiPo Battery (Old)", quantity: "3" },
          { name: "3S LiPo Battery (Old)", quantity: "1" },
          { name: "3S LiPo Battery (New)", quantity: "1" },
          { name: "Turbo Fan Charger", quantity: "1" },
          { name: "Lamp Charger", quantity: "1" },
          { name: "LiPo Battery Charger", quantity: "1" },
          { name: "Meteor Battery Charger", quantity: "2" },
          { name: "Meteor Battery - 550 mAh", quantity: "2" },
          { name: "Meteor Battery - 450 mAh", quantity: "2" },
          { name: "Digital Weighing Scale", quantity: "1" },
          { name: "Xbox Controller (Old)", quantity: "1" },
          { name: "DC Motor Speed Regulator", quantity: "1" },
          { name: "Syringe", quantity: "1" },
          { name: "Goggles3", quantity: "1" },
          { name: "Motion controller", quantity: "1" }
        ],
        subBoxes: [
          {
            boxName: "Grey bag",
            items: [
              { name: "Avata charging hub small", quantity: "1" },
              { name: "Avata prop", quantity: "8" },
              { name: "Goggles v2 power cable", quantity: "2" },
              { name: "Goggles v2 antina holder", quantity: "1" }
            ]
          }
        ]
      }
    ]
  }
];