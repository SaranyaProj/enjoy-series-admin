/* org-data.jsx — organizational hierarchy + users mock data (Admin & Program flows) */

const STATES = [
  { id: "s1", name: "Tamil Nadu",   code: "TN", region: "South",  cities: 6, schools: 48, students: 12840, teachers: 612, status: "active" },
  { id: "s2", name: "Karnataka",    code: "KA", region: "South",  cities: 4, schools: 31, students: 8120,  teachers: 402, status: "active" },
  { id: "s3", name: "Maharashtra",  code: "MH", region: "West",   cities: 5, schools: 39, students: 10450, teachers: 511, status: "active" },
  { id: "s4", name: "Delhi NCR",    code: "DL", region: "North",  cities: 3, schools: 22, students: 6230,  teachers: 298, status: "active" },
  { id: "s5", name: "West Bengal",  code: "WB", region: "East",   cities: 3, schools: 18, students: 4870,  teachers: 241, status: "archived" },
];

const CITIES = [
  { id: "c1", name: "Chennai",    code: "MAA", state: "Tamil Nadu",  district: "Chennai",     schools: 18, students: 4920, status: "active" },
  { id: "c2", name: "Coimbatore", code: "CJB", state: "Tamil Nadu",  district: "Coimbatore",  schools: 11, students: 2810, status: "active" },
  { id: "c3", name: "Madurai",    code: "IXM", state: "Tamil Nadu",  district: "Madurai",     schools: 9,  students: 2240, status: "active" },
  { id: "c4", name: "Bengaluru",  code: "BLR", state: "Karnataka",   district: "Bengaluru U", schools: 16, students: 4310, status: "active" },
  { id: "c5", name: "Mysuru",     code: "MYS", state: "Karnataka",   district: "Mysuru",      schools: 7,  students: 1680, status: "active" },
  { id: "c6", name: "Mumbai",     code: "BOM", state: "Maharashtra", district: "Mumbai City", schools: 21, students: 5640, status: "active" },
  { id: "c7", name: "Pune",       code: "PNQ", state: "Maharashtra", district: "Pune",        schools: 12, students: 3110, status: "active" },
  { id: "c8", name: "New Delhi",  code: "DEL", state: "Delhi NCR",   district: "New Delhi",   schools: 14, students: 3980, status: "active" },
];

const SCHOOLS = [
  { id: "sc1", name: "Vidya Mandir Mylapore",     city: "Chennai",   classes: 24, students: 642, teachers: 31, calendar: "TN 2026", status: "active" },
  { id: "sc2", name: "Bharathi Vidyalaya",        city: "Chennai",   classes: 18, students: 488, teachers: 24, calendar: "TN 2026", status: "active" },
  { id: "sc3", name: "St. Joseph's Coimbatore",   city: "Coimbatore",classes: 20, students: 531, teachers: 27, calendar: "TN 2026", status: "active" },
  { id: "sc4", name: "National PS Bengaluru",     city: "Bengaluru", classes: 22, students: 604, teachers: 29, calendar: "KA 2026", status: "active" },
  { id: "sc5", name: "Smt. Sulochana Vidyalaya",  city: "Mysuru",    classes: 14, students: 372, teachers: 18, calendar: "KA 2026", status: "active" },
  { id: "sc6", name: "Greenfield International",   city: "Mumbai",    classes: 26, students: 712, teachers: 34, calendar: "MH 2026", status: "active" },
  { id: "sc7", name: "DAV Public School",         city: "New Delhi", classes: 19, students: 522, teachers: 25, calendar: "DL 2026", status: "active" },
];

const CLASSES = [
  { id: "cl1", name: "Grade 1 — A", grade: "Grade 1", subject: "All", term: "Term 1", school: "Vidya Mandir Mylapore", students: 32, capacity: 35, teacher: "Lakshmi N.", status: "active" },
  { id: "cl2", name: "Grade 1 — B", grade: "Grade 1", subject: "All", term: "Term 1", school: "Vidya Mandir Mylapore", students: 30, capacity: 35, teacher: "Ravi Kumar", status: "active" },
  { id: "cl3", name: "Grade 2 — A", grade: "Grade 2", subject: "All", term: "Term 1", school: "Vidya Mandir Mylapore", students: 33, capacity: 35, teacher: "Divya S.", status: "active" },
  { id: "cl4", name: "Grade 3 — A", grade: "Grade 3", subject: "All", term: "Term 1", school: "Bharathi Vidyalaya",     students: 28, capacity: 32, teacher: "Anbu Selvan", status: "active" },
  { id: "cl5", name: "Grade 2 — C", grade: "Grade 2", subject: "All", term: "Term 1", school: "National PS Bengaluru",  students: 31, capacity: 34, teacher: "Meena R.", status: "active" },
  { id: "cl6", name: "Grade 4 — A", grade: "Grade 4", subject: "All", term: "Term 1", school: "Greenfield International",students: 29, capacity: 34, teacher: "Sahil V.", status: "active" },
  { id: "cl7", name: "Grade 1 — C", grade: "Grade 1", subject: "All", term: "Term 3", school: "Vidya Mandir Mylapore", students: 0,  capacity: 35, teacher: "—", status: "archived" },
];

const TEACHERS = [
  { id: "t1", name: "Lakshmi Narayanan", email: "lakshmi.n@vidyamandir.edu", subjects: ["Tamil","English"], classes: 3, role: "Primary", status: "active" },
  { id: "t2", name: "Ravi Kumar",        email: "ravi.k@vidyamandir.edu",    subjects: ["Maths"],            classes: 2, role: "Primary", status: "active" },
  { id: "t3", name: "Divya Srinivasan",  email: "divya.s@vidyamandir.edu",   subjects: ["English","Maths"],  classes: 4, role: "Primary", status: "active" },
  { id: "t4", name: "Anbu Selvan",       email: "anbu.s@bharathi.edu",       subjects: ["Tamil"],            classes: 2, role: "Co-Teacher", status: "active" },
  { id: "t5", name: "Meena Rajan",       email: "meena.r@nps.edu",           subjects: ["Maths","English"],  classes: 3, role: "Primary", status: "pending" },
  { id: "t6", name: "Sahil Verma",       email: "sahil.v@greenfield.edu",    subjects: ["English"],          classes: 2, role: "Primary", status: "active" },
];

/* Academic Years — students & journeys are managed per academic year */
const ACADEMIC_YEARS = ["2026–27", "2027–28", "2028–29"];

/* Academic Grades — the school-grade ladder (distinct from subject learning Levels).
   Grade Promotion advances a student up this ladder at the end of an academic year. */
const GRADES = ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5"];
const TOP_GRADE = GRADES[GRADES.length - 1];

/* A fuller, grade-organised student roster so bulk Grade Promotion is meaningful.
   Each student carries an academic `grade` (the promotion ladder) AND a subject
   learning `level` (their placement within a subject — untouched by promotion). */
const STUDENT_SEED = [
  // [name, grade, school, subject, level, parent, completion, percentile, avgLevel, risk]
  ["Aarav Menon",    "Grade 1", "Vidya Mandir Mylapore",   "Tamil",   "Level 1", "Suresh Menon",  78, 84, 2.3, false],
  ["Isha Pillai",    "Grade 1", "St. Joseph's Coimbatore", "English", "Level 1", "Maya Pillai",   73, 71, 2.2, false],
  ["Rohan Das",      "Grade 1", "Vidya Mandir Mylapore",   "Maths",   "Level 1", "Amit Das",      66, 58, 1.9, false],
  ["Tara Nair",      "Grade 1", "Bharathi Vidyalaya",      "Tamil",   "Level 1", "Lata Nair",     81, 79, 2.4, false],
  ["Zoya Khan",      "Grade 1", "St. Joseph's Coimbatore", "English", "Level 1", "Imran Khan",    49, 31, 1.4, true],
  ["Aditya Rao",     "Grade 1", "National PS Bengaluru",   "Maths",   "Level 1", "Sunil Rao",     70, 64, 2.1, false],
  ["Diya Sharma",    "Grade 2", "Vidya Mandir Mylapore",   "English", "Level 2", "Nisha Sharma",  91, 96, 2.8, false],
  ["Ananya Iyer",    "Grade 2", "Bharathi Vidyalaya",      "Tamil",   "Level 2", "Geetha Iyer",   86, 88, 2.6, false],
  ["Arjun Pillai",   "Grade 2", "St. Joseph's Coimbatore", "Maths",   "Level 2", "Vinod Pillai",  62, 47, 1.8, false],
  ["Meera Joshi",    "Grade 2", "Vidya Mandir Mylapore",   "English", "Level 2", "Rekha Joshi",   88, 90, 2.7, false],
  ["Sahil Verma",    "Grade 2", "National PS Bengaluru",   "Tamil",   "Level 2", "Pooja Verma",   54, 36, 1.6, true],
  ["Nisha Reddy",    "Grade 2", "Bharathi Vidyalaya",      "Maths",   "Level 2", "Kiran Reddy",   77, 73, 2.3, false],
  ["Kabir Anand",    "Grade 3", "Vidya Mandir Mylapore",   "Maths",   "Level 3", "Rohit Anand",   42, 22, 1.4, true],
  ["Riya Gupta",     "Grade 3", "St. Joseph's Coimbatore", "English", "Level 2", "Anil Gupta",    84, 81, 2.5, false],
  ["Dev Mehta",      "Grade 3", "Bharathi Vidyalaya",      "Tamil",   "Level 3", "Hardik Mehta",  79, 76, 2.4, false],
  ["Sara Thomas",    "Grade 3", "National PS Bengaluru",   "Maths",   "Level 3", "Jacob Thomas",  90, 93, 2.9, false],
  ["Ishaan Bose",    "Grade 3", "Vidya Mandir Mylapore",   "English", "Level 3", "Sourav Bose",   58, 41, 1.7, true],
  ["Vivaan Reddy",   "Grade 4", "Bharathi Vidyalaya",      "Maths",   "Level 4", "Kiran Reddy",   55, 38, 1.7, true],
  ["Aisha Sheikh",   "Grade 4", "St. Joseph's Coimbatore", "English", "Level 3", "Yusuf Sheikh",  87, 89, 2.6, false],
  ["Karan Malhotra", "Grade 4", "National PS Bengaluru",   "Maths",   "Level 4", "Raj Malhotra",  72, 68, 2.2, false],
  ["Pari Desai",     "Grade 4", "Vidya Mandir Mylapore",   "Tamil",   "Level 3", "Nilesh Desai",  83, 80, 2.5, false],
  ["Reyansh Jain",   "Grade 5", "Bharathi Vidyalaya",      "Maths",   "Level 5", "Manoj Jain",    94, 97, 3.0, false],
  ["Anvi Kapoor",    "Grade 5", "St. Joseph's Coimbatore", "English", "Level 3", "Deepak Kapoor", 89, 91, 2.7, false],
  ["Vihaan Shetty",  "Grade 5", "National PS Bengaluru",   "Maths",   "Level 5", "Ganesh Shetty", 76, 70, 2.3, false],
];
const STUDENTS = STUDENT_SEED.map((r, i) => {
  const [name, grade, school, subject, level, parent, completion, percentile, avgLevel, risk] = r;
  const section = "A";
  return { id: "st" + (i + 1), name, ay: "2026–27", grade, school, subject, level, section,
    cls: grade + " — " + section, parent, completion, percentile, avgLevel, risk };
});

/* next academic grade, capped at the top grade (Grade 5 = graduating cohort) */
function nextGrade(grade) {
  const i = GRADES.indexOf(grade);
  return (i < 0 || i >= GRADES.length - 1) ? null : GRADES[i + 1];
}

/* next-level suggestion, capped at the subject ceiling (Maths 5, English/Tamil 3) */
function nextLevel(subject, level) {
  const max = (window.SUBJECT_LEVELS && window.SUBJECT_LEVELS[subject]) || 3;
  const n = parseInt(String(level).replace(/\D/g, ""), 10) || 1;
  return n >= max ? null : "Level " + (n + 1);
}

/* sample promotion audit trail (history log) — now grade transitions */
const PROMOTION_HISTORY = [
  { id: "ph1", student: "Leela Krishnan", fromAY: "2025–26", toAY: "2026–27", fromGrade: "Grade 2", toGrade: "Grade 2", date: "12 Apr 2026", by: "Aravind Rao", note: "Held back — repeating grade" },
  { id: "ph2", student: "Rahul Varma",    fromAY: "2025–26", toAY: "2026–27", fromGrade: "Grade 1", toGrade: "Grade 2", date: "12 Apr 2026", by: "Aravind Rao" },
];

const TEAM = [
  { id: "tm1", name: "Priya Raman",     email: "priya@enjoyseries.org",   phone: "+91 98400 11223", login: "Content Team", scope: "All subjects",         status: "active",  last: "2h ago" },
  { id: "tm2", name: "Anand Krishnan",  email: "anand@enjoyseries.org",   phone: "+91 98401 33445", login: "Content Team", scope: "English, Tamil",       status: "active",  last: "1d ago" },
  { id: "tm3", name: "Karthik Venkat",  email: "karthik@enjoyseries.org", phone: "+91 98402 55667", login: "Content Team", scope: "Tamil · G1–G5",        status: "active",  last: "3h ago" },
  { id: "tm4", name: "Meera Suresh",    email: "meera@enjoyseries.org",   phone: "+91 98403 77889", login: "Content Team", scope: "Maths",                status: "active",  last: "5h ago" },
  { id: "tm5", name: "Rajesh Pillai",   email: "rajesh@enjoyseries.org",  phone: "+91 98404 99001", login: "Program Team", scope: "Tamil Nadu, Karnataka",status: "active",  last: "30m ago" },
  { id: "tm6", name: "Fatima Khan",     email: "fatima@enjoyseries.org",  phone: "+91 98405 22113", login: "Program Team", scope: "All chapters",         status: "active",  last: "1h ago" },
  { id: "tm7", name: "Vikram Nair",     email: "vikram@enjoyseries.org",  phone: "+91 98406 44225", login: "Program Team", scope: "Maharashtra",          status: "pending", last: "—" },
];

/* bulk-upload validation preview rows */
const BULK_PREVIEW = [
  { row: 1, name: "Salem",       code: "SXV", parent: "Tamil Nadu", ok: true,  err: null },
  { row: 2, name: "Tiruchirapalli", code: "TRZ", parent: "Tamil Nadu", ok: true, err: null },
  { row: 3, name: "Erode",       code: "",    parent: "Tamil Nadu", ok: false, err: "Missing City Code" },
  { row: 4, name: "Vellore",     code: "VLR", parent: "Tamil Naadu", ok: false, err: "Unknown parent state 'Tamil Naadu'" },
  { row: 5, name: "Thanjavur",   code: "TJV", parent: "Tamil Nadu", ok: true,  err: null },
  { row: 6, name: "Tirunelveli", code: "TEN", parent: "Tamil Nadu", ok: true,  err: null },
];

/* program-team: curriculum assignments to classes */
const ASSIGNMENTS = [
  { id: "a1", cls: "Grade 1 — A", school: "Vidya Mandir Mylapore", item: "Early Numeracy Foundations", kind: "Journey", start: "May 26", status: "live",      progress: 64 },
  { id: "a2", cls: "Grade 1 — B", school: "Vidya Mandir Mylapore", item: "Early Numeracy Foundations", kind: "Journey", start: "May 26", status: "live",      progress: 58 },
  { id: "a3", cls: "Grade 2 — A", school: "Vidya Mandir Mylapore", item: "Phonics & First Words",      kind: "Journey", start: "Jun 02", status: "scheduled", progress: 0 },
  { id: "a4", cls: "Grade 3 — A", school: "Bharathi Vidyalaya",     item: "Place Value",                kind: "Module",  start: "May 28", status: "live",      progress: 41 },
  { id: "a5", cls: "Grade 2 — C", school: "National PS Bengaluru",  item: "Tamil Reading Readiness",    kind: "Journey", start: "Jun 03", status: "scheduled", progress: 0 },
];

/* badges */
const BADGES = [
  { id: "b1", name: "Module Master",   trigger: "Complete 5 modules",        rarity: "Common",    xp: 50,  awarded: 3210, icon: "IcCheckCircle", color: "var(--st-approve)" },
  { id: "b2", name: "Level Climber",   trigger: "Reach Level 3 in any game", rarity: "Rare",      xp: 120, awarded: 1840, icon: "IcLayers",      color: "var(--maths)" },
  { id: "b3", name: "Streak Star",     trigger: "7-day learning streak",     rarity: "Epic",      xp: 200, awarded: 920,  icon: "IcSparkle",     color: "var(--st-sched)" },
  { id: "b4", name: "Sharp Shooter",   trigger: "100% on a quiz",            rarity: "Common",    xp: 40,  awarded: 4120, icon: "IcTarget",      color: "var(--english)" },
];

/* announcements */
const ANNOUNCEMENTS = [
  { id: "an1", title: "Term 1 assessment window opens", scope: "Platform",            channels: ["In-app","Email"],  by: "Admin",        when: "2d ago", reach: 31200 },
  { id: "an2", title: "New Tamil journey live for G1",  scope: "Tamil Nadu · G1",     channels: ["In-app","Push"],   by: "Program Team", when: "4d ago", reach: 4920 },
  { id: "an3", title: "Parent-teacher meet schedule",   scope: "Vidya Mandir Mylapore",channels: ["Email"],          by: "Program Team", when: "1w ago", reach: 642 },
];

/* permission matrix (editable in settings) */
const PERMISSIONS = [
  { cap: "Manage States / Cities / Schools", admin: "Full CRUD", program: "View only",      content: "No access" },
  { cap: "Manage Classes",                   admin: "Full CRUD", program: "View + assign",  content: "No access" },
  { cap: "Manage Teachers & Students",       admin: "Full CRUD", program: "View only",      content: "No access" },
  { cap: "Create Lesson Modules",             admin: "View only", program: "View only",      content: "Full CRUD" },
  { cap: "Create / Edit Games",              admin: "View only", program: "View only",      content: "Full CRUD" },
  { cap: "Build Learning Journeys",          admin: "View only", program: "View only",      content: "Full CRUD" },
  { cap: "Review & Approve Content",         admin: "Yes",       program: "Yes",            content: "Submit only" },
  { cap: "Assign Curriculum to Classes",     admin: "Yes",       program: "Yes",            content: "No" },
  { cap: "View Analytics & Reports",         admin: "All levels",program: "All levels",     content: "Usage only" },
  { cap: "Manage Settings / Branding",       admin: "Full",      program: "No access",      content: "No access" },
  { cap: "Send Announcements",               admin: "All scopes",program: "School / class", content: "No access" },
];

Object.assign(window, { STATES, CITIES, SCHOOLS, CLASSES, TEACHERS, STUDENTS, TEAM, BULK_PREVIEW, ASSIGNMENTS, BADGES, ANNOUNCEMENTS, PERMISSIONS, ACADEMIC_YEARS, GRADES, TOP_GRADE, nextGrade, nextLevel, PROMOTION_HISTORY });
