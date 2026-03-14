/* Subjects Online V2 — data.js
   All subjects + sections + content in one file.
   Edit this file to add new lectures, chapters, etc.
   No build step needed — just refresh the browser!
*/

const SUBJECTS = [
  {
    id: "accounting",
    name: "Accounting",
    nameAr: "Accounting",
    icon: "📒",
    color: "#3b82f6",
    grad: "135deg,#3b82f6,#4f46e5",
    desc: "Financial Statements, Journal Entries & Cost Accounting",
  },
  {
    id: "eco",
    name: "Economics",
    nameAr: "Eco",
    icon: "📈",
    color: "#10b981",
    grad: "135deg,#10b981,#0d9488",
    desc: "Micro & Macroeconomics – Supply, Demand, Market Structures",
  },
  {
    id: "english",
    name: "English",
    nameAr: "English",
    icon: "📝",
    color: "#f59e0b",
    grad: "135deg,#f59e0b,#ea580c",
    desc: "Academic Writing, Grammar & Business Communication",
  },
  {
    id: "political-science",
    name: "Political Science",
    nameAr: "علوم سياسية",
    icon: "🏛️",
    color: "#8b5cf6",
    grad: "135deg,#8b5cf6,#7c3aed",
    desc: "International Relations, Political Theory & Systems",
  },
  {
    id: "marketing",
    name: "Marketing",
    nameAr: "Marketing",
    icon: "📣",
    color: "#ec4899",
    grad: "135deg,#ec4899,#e11d48",
    desc: "Market Research, Consumer Behavior & Digital Marketing",
  },
  {
    id: "statistics",
    name: "Statistics",
    nameAr: "Stat",
    icon: "📉",
    color: "#06b6d4",
    grad: "135deg,#06b6d4,#0284c7",
    desc: "Probability, Regression Analysis & Statistical Methods",
  },
  {
    id: "ais",
    name: "AIS",
    nameAr: "AIS",
    icon: "💻",
    color: "#f97316",
    grad: "135deg,#f97316,#dc2626",
    desc: "Accounting Information Systems & Database Management",
  },
  {
    id: "public-finance",
    name: "Public Finance",
    nameAr: "Public Finance",
    icon: "🏦",
    color: "#8b5cf6",
    grad: "135deg,#8b5cf6,#6d28d9",
    desc: "Government Budgets, Taxation & Public Expenditure",
  },
];

const SECTIONS = [
  {
    id: "course-content",
    title: "Course Content",
    icon: "🎓",
    desc: "شرح تفصيلي للمادة – مش تلخيص",
    color: "#7c3aed",
  },
  {
    id: "quizzes",
    title: "Quizzes",
    icon: "✏️",
    desc: "كل كويز مع حله بالتفصيل",
    color: "#2563eb",
  },
  {
    id: "sections",
    title: "Sections",
    icon: "📋",
    desc: "حل السيكشن مع شرح كل سؤال",
    color: "#059669",
  },
  {
    id: "summaries",
    title: "Summaries & Keywords",
    icon: "🔑",
    desc: "Key Words و Summaries لكل Chapter ومحاضرة",
    color: "#d97706",
  },
  {
    id: "qa",
    title: "Questions & Answers",
    icon: "❓",
    desc: "Test Bank محلول + أسئلة إضافية",
    color: "#db2777",
  },
  {
    id: "final-review",
    title: "Final Review",
    icon: "🏆",
    desc: "ملخص الترم كامل – جداول وتنظيم",
    color: "#0891b2",
  },
  {
    id: "videos",
    title: "Videos",
    icon: "🎬",
    desc: "فيديوهات شرح المادة وحل المسائل",
    color: "#7c3aed",
  },
];

// ================================================================
// CONTENT — Edit each subject's chapters & lectures here
// Structure: CONTENT[subjectId][sectionId][chapterIndex] = [lectures]
// Lecture: { id, title, type: "file"|"video", content: "/path/to/file" }
// ================================================================
const CONTENT = {
  // ============================
  // ACCOUNTING
  // ============================
  accounting: {
    "course-content": [
      // Chapter 1
      [
        {
          id: "lec1",
          title: "Lect 1-2",
          type: "file",
          content:
            "../pdfs/accounting/Acquisition__Disposition_of_Property_Plant_and_Equipment.pdf",
        },
        {
          id: "lec2",
          title: "Lect 3",
          type: "file",
          content: "../pdfs/accounting/Non-Monetary_Asset_Exchanges.pdf",
        },
        {
          id: "lec3",
          title: "Lects 'HandWriting'",
          type: "file",
          content: "./pdfs/accounting/Lects(Acc.) (S.O).pdf",
        },
      ],
      [
        {
          id: "lec4",
          title: "Lect 4",
          type: "file",
          content: "./pdfs/accounting/Lect4 (Acc.) (S.O).pdf",
        },
      ], // Chapter 2
      [], // Chapter 3
      [], // Chapter 4
    ],
    videos: [
      // Chapter 1
      [
        {
          id: "vid1",
          title: "Lect 1-2 Dr.MZ",
          type: "video",
          content: "./pdfs/accounting/تحديد_تكلفة_الأصول_الثابتة.mp4",
        },
        {
          id: "vid2",
          title: "Lect 3 Dr.MZ",
          type: "video",
          content: "./pdfs/accounting/Lect 3 .mp4",
        },
        {
          id: "vid3",
          title: "Ch1 Dr.MZ",
          type: "video",
          content: "./pdfs/accounting/Ch1.mp4",
        },
      ],
      [
        {
          id: "vid3",
          title: "Lect 4 Dr.MZ",
          type: "video",
          content: "./pdfs/accounting/Lect 4 (Acc.) (S.O).mp4",
        },
        {
          id: "vid3",
          title: "Lect 5 Dr.MZ",
          type: "video",
          content: "./pdfs/accounting/Lect 5 (Accounting) (S.O).mp4",
        },
        {
          id: "vid3",
          title: "Lect 6 Dr.MZ",
          type: "video",
          content: "./pdfs/accounting/Lect 6 (Accounting) (S.O).mp4",
        },
      ], // Chapter 2
      [], // Chapter 3
      [], // Chapter 4
    ],
    sections: [
      // Chapter 1
      [
        {
          id: "lec2",
          title: "Section 1-2 'HandWriting'",
          type: "file",
          content: "./pdfs/accounting/Sections1-2 (Acc.) (S.O).pdf",
        },
      ],
      [], // Chapter 2
      [], // Chapter 3
      [], // Chapter 4
    ],
  },

  // ============================
  // OTHER SUBJECTS — add content below same way
  // ============================
  eco: {
    "course-content": [
      // Chapter 1
      [
        {
          id: "lec1",
          title: "Lect 1 Dr.Hannan",
          type: "file",
          content: "../pdfs/economics/Lect_1_Cardinal_Utility_Theory.pdf",
        },
        {
          id: "lec2",
          title: "Lect 2 Dr.Hannan",
          type: "file",
          content: "./pdfs/economics/Lect_2_Ordinalist_Approach.pdf",
        },
        {
          id: "lec3",
          title: "Lect 3 Dr.Hannan",
          type: "file",
          content:
            "./pdfs/economics/Price_Consumption_Curve_(PCC)__Lecture_3 1.pdf",
        },
        {
          id: "lec3",
          title: "Lect 3 Dr.Hannan",
          type: "file",
          content:
            "./pdfs/economics/Price_Consumption_Curve_(PCC)__Lecture_3 2.pdf",
        },
      ],
      [
        {
          id: "lec4",
          title: "Lect 4 Dr.Hannan",
          type: "file",
          content: "./pdfs/economics/Lect 4 (ECO) (S.O).pdf",
        },
        {
          id: "lec5",
          title: "Lect 5 Dr.Hannan",
          type: "file",
          content: "./pdfs/economics/Lect 5 (ECO) (S.O).pdf",
        },
        {
          id: "lec5",
          title: "Lects 'HandWriting' Dr.Hannan",
          type: "file",
          content: "./pdfs/economics/Lect 1 - Lect 5.pdf",
        },
      ], // Chapter 2
      [], // Chapter 3
    ],
    videos: [
      // Chapter 1
      [
        {
          id: "vid1",
          title: "Lect 1-2 Dr.MZ",
          type: "video",
          content: "./pdfs/economics/lect 1 .mp4",
        },
        {
          id: "vid2",
          title: "Lect 3 Dr.MZ",
          type: "video",
          content: "./pdfs/economics/Lect 2 .mp4",
        },
        {
          id: "vid3",
          title: "Ch1 Dr.MZ",
          type: "video",
          content: "./pdfs/economics/lect 3 .mp4",
        },
      ],
      [
        {
          id: "vid3",
          title: "Lect 4 Dr.MZ",
          type: "video",
          content: "./pdfs/accounting/Lect 4 (Acc.) (S.O).mp4",
        },
        {
          id: "vid3",
          title: "Lect 5 Dr.MZ",
          type: "video",
          content: "./pdfs/accounting/Lect 5 (Accounting) (S.O).mp4",
        },
        {
          id: "vid3",
          title: "Lect 6 Dr.MZ",
          type: "video",
          content: "./pdfs/accounting/Lect 6 (Accounting) (S.O).mp4",
        },
      ], // Chapter 2
      [], // Chapter 3
    ],
    sections: [
      // Chapter 1
      [
        {
          id: "lec2",
          title: "Section 1-2 'HandWriting'",
          type: "file",
          content: "./pdfs/economics/Section1-2(Eco) (S.O).pdf",
        },
      ],
      [], // Chapter 2
      [], // Chapter 3
    ],
  },
  //-------------------------------------------------------------
  english: {
    "course-content": [
      // Chapter 1
      [
        {
          id: "lec1",
          title: "Lect 1-2 Dr.Eman",
          type: "file",
          content: "./pdfs/english/Macroeconomics Lect 1 - 2.pdf",
        },
        {
          id: "lec2",
          title: "Lect 3 Dr.Eman",
          type: "file",
          content: "./pdfs/english/Lect 3 (English) (S.O).pdf",
        },
        {
          id: "lec3",
          title: "Lect 4 ",
          type: "file",
          content: "./pdfs/english/Lect 4 (English) (S.O).pdf",
        },
        {
          id: "lec3",
          title: "Lect5 'HandWriting'",
          type: "file",
          content: "./pdfs/english/Lect 5 (English) (S.O).pdf",
        },
      ],
      [], // Chapter 2
      [], // Chapter 3
      [], // Chapter 4
    ],
    videos: [
      // Chapter 1
      [
        {
          id: "vid1",
          title: "Lect 1-2 Dr.Eman",
          type: "video",
          content: "./pdfs/english/Lect 1-2.mp4",
        },
        {
          id: "vid2",
          title: "Lect 3 Dr.Eman",
          type: "video",
          content: "./pdfs/english/Lect 3 (English) (S.O).mp4",
        },
        {
          id: "vid3",
          title: "Lect 4 Dr.Eman",
          type: "video",
          content: "./pdfs/english/Lect 4 (English) (S.O).mp4",
        },
      ],
      [], // Chapter 2
      [], // Chapter 3
    ],
    summaries: [
      // Chapter 1
      [
        {
          id: "lec4",
          title: "Lect4 Dr.Eman",
          type: "file",
          content: "./pdfs/english/Summary of lect 4 (English) (S.O)pdf.pdf",
        },
      ],
      [], // Chapter 2
      [], // Chapter 3
      [], // Chapter 4
    ],
  },
  //-------------------------------------------------------------
  "political-science": {},
  //-------------------------------------------------------------
  marketing: {
    "course-content": [
      // Chapter 1
      [
        {
          id: "lec1",
          title: "Lect 1 Dr.HM",
          type: "file",
          content: "./pdfs/marketing/Lect 1 Marketing.pdf",
        },
        {
          id: "lec2",
          title: "Lect 2 Dr.HM",
          type: "file",
          content: "./pdfs/marketing/Lect_2_(Cont.).pdf",
        },
        {
          id: "lec3",
          title: "Lect3 Dr.HM'",
          type: "file",
          content: "./pdfs/marketing/Lect 3 (Marketing) (S.O).pdf",
        },
      ],
      [
        {
          id: "lec4",
          title: "Lect 4 Dr.HM",
          type: "file",
          content: "./pdfs/marketing/Lect4 (Marketing) (S.O).pdf",
        },
      ], // Chapter 2
      [], // Chapter 3
      [], // Chapter 4
    ],
    videos: [
      // Chapter 1
      [
        {
          id: "vid1",
          title: "Lect 1 Dr.HM",
          type: "video",
          content: "./pdfs/marketing/What_is_Marketing,_Really_.mp4",
        },
        {
          id: "vid2",
          title: "Lect 2 Dr.HM",
          type: "video",
          content: "./pdfs/marketing/Lect 2.mp4",
        },
        {
          id: "vid3",
          title: "Lect 3 Dr.HM",
          type: "video",
          content: "./pdfs/marketing/Lect 3 (Marketing) (S.O) .mp4",
        },
      ],
      [
        {
          id: "vid4",
          title: "Lect 4 Dr.HM",
          type: "video",
          content: "./pdfs/marketing/Lect 4 (Marketing) (S.O).mp4",
        },
      ], // Chapter 2
      [], // Chapter 3
    ],
    summaries: [
      // Chapter 1
      [
        {
          id: "lec1",
          title: "Lect 1 Dr.HM",
          type: "file",
          content: "./pdfs/marketing/Marketing_Lect_1 summary.pdf",
        },
      ],
      [
        {
          id: "lec2",
          title: "Lect 2 Dr.HM",
          type: "file",
          content: "./pdfs/marketing/Lect 2 summary .pdf",
        },
      ], // Chapter 2
      [], // Chapter 3
      [], // Chapter 4
    ],
  },
  //-------------------------------------------------------------
  statistics: {},
  //----------------------------------------------
  ais: {
    "course-content": [
      // Chapter 1
      [
        {
          id: "lec1",
          title: "Lect 1 DR.S.R",
          type: "file",
          content: "./pdfs/ais/Explain of lect 1.pdf",
        },
        {
          id: "lec2",
          title: "Lect 2 DR.S.R",
          type: "file",
          content: "./pdfs/ais/Lecture_No._2_.pdf",
        },
        {
          id: "lec3",
          title: "Lect 3 DR.S.R",
          type: "file",
          content: "./pdfs/ais/Lect 3.pdf",
        },
      ],
      [
        {
          id: "lec4",
          title: "Lects 'HandWriting'",
          type: "file",
          content: "./pdfs/ais/Lects (AIS) (S.O).pdf",
        },
      ], // Chapter 3
      [], // Chapter 4
      //------
    ],
    videos: [
      // Chapter 1
      [
        {
          id: "vid1",
          title: "Lect 1 Dr.S.R",
          type: "video",
          content: "./pdfs/ais/الشرح__الفرق_بين_البيانات_والمعلومات.mp4",
        },
        {
          id: "vid2",
          title: "Lect 2 Dr.S.R",
          type: "video",
          content: "./pdfs/ais/إزاي_تنظم_حسابات_البيزنس؟.mp4",
        },
        {
          id: "vid3",
          title: "Lect 3 Dr.S.R",
          type: "video",
          content: "./pdfs/ais/Lect 3.mp4",
        },
      ],
      [
        {
          id: "vid4",
          title: "Lect 4 Dr.S.R",
          type: "video",
          content: "./pdfs/ais/Lect 4 (AIS) (S.O).mp4",
        },
        {
          id: "vid5",
          title: "Lect 5 Dr.S.R",
          type: "video",
          content: "./pdfs/ais/Lect 5 (AIS) (S.O).mp4",
        },
      ], // Chapter 2

      [], // Chapter 3

      [], // Chapter 4
    ],
    //------
    summaries: [
      // Chapter 1
      [
        {
          id: "lec1",
          title: "Lect 1 Dr.S.R",
          type: "file",
          content: "/pdfs/ais/lect_1 summary.pdf",
        },
        {
          id: "lec2",
          title: "Lect 2 Dr.S.R",
          type: "file",
          content: "./pdfs/ais/Lecture_No._2 summary.pdf",
        },
        {
          id: "lec3",
          title: "Lect 3 Dr.S.R",
          type: "file",
          content: "./pdfs/ais/Lect 3 Sum..pdf",
        },
      ],

      [], // Chapter 2

      [], // Chapter 3

      [], // Chapter 4
    ],
  },
  "public-finance": {},
};

// Helper: get chapters for a subject+section
function getChapters(subjectId, sectionId) {
  const raw = (CONTENT[subjectId] || {})[sectionId] || [];
  return [
    { id: "ch1", title: "Chapter 1", lectures: raw[0] || [] },
    { id: "ch2", title: "Chapter 2", lectures: raw[1] || [] },
    { id: "ch3", title: "Chapter 3", lectures: raw[2] || [] },
    { id: "ch4", title: "Chapter 4", lectures: raw[3] || [] },
  ];
}
