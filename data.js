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
    id: "ais",
    name: "AIS",
    nameAr: "AIS",
    icon: "💻",
    color: "#f97316",
    grad: "135deg,#f97316,#dc2626",
    desc: "Accounting Information Systems & Database Management",
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
    id: "public-finance",
    name: "Public Finance",
    nameAr: "Public Finance",
    icon: "🏦",
    color: "#8b5cf6",
    grad: "135deg,#8b5cf6,#6d28d9",
    desc: "Government Budgets, Taxation & Public Expenditure",
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
          title: "Lect 1-2 Dr.MZ",
          type: "file",
          content:
            "./pdfs/accounting/Acquisition__Disposition_of_Property_Plant_and_Equipment.pdf",
          // interactive: [
          //   {
          //     title: "What is PPE?",
          //     content:
          //       "Property, Plant, and Equipment (PPE) are tangible assets used in business operations for more than one period.",
          //   },
          //   {
          //     title: "Initial Measurement",
          //     content:
          //       "PPE is initially measured at cost, including purchase price and any directly attributable costs.",
          //   },
          //   {
          //     title: "Subsequent Costs",
          //     content:
          //       "Day-to-day servicing costs are recognized in profit or loss, while major replacements are capitalized.",
          //   },
          // ],
        },
        {
          id: "lec2",
          title: "Lect 3 Dr.MZ",
          type: "file",
          content: "./pdfs/accounting/Non-Monetary_Asset_Exchanges.pdf",
          interactive: [
            {
              title: "Non-Monetary Exchanges",
              content:
                "Occurs when an asset is acquired in exchange for a non-monetary asset or a combination of monetary and non-monetary assets.",
            },
            {
              title: "Commercial Substance",
              content:
                "An exchange has commercial substance if the future cash flows of the entity are expected to change significantly as a result of the transaction.",
            },
          ],
        },
        {
          id: "lec3",
          title: "HandWriting Notes",
          type: "file",
          content: "./pdfs/accounting/Lects(Acc.) (S.O).pdf",
        },
      ],
      [
        {
          id: "lec4",
          title: "Lect 4 Dr.MZ",
          type: "file",
          content: "./pdfs/accounting/Lect4 (Acc.) (S.O).pdf",
        },
        {
          id: "lec5",
          title: "Lect 5 Dr.MZ",
          type: "file",
          content: "./pdfs/accounting/Lect 5 (Acc.) (S.O V2).pdf",
        },
        {
          id: "lec6",
          title: "Lect 6 Dr.MZ",
          type: "file",
          content: "./pdfs/accounting/Lect 6 (Acc.) (S.O V2).pdf",
        },
      ], // Chapter 2
      [
        {
          id: "lec7",
          title: "Lect 7 part 2 Dr.Saeed",
          type: "file",
          content: "./pdfs/accounting/Lect 7 (Acc.) (S.O V2).pdf",
        },
        {
          id: "lec8",
          title: "Lect 8 part 2 Dr.Saeed",
          type: "file",
          content: "./pdfs/accounting/Lect 8 Accounting (S.O V2).pdf",
        },
        {
          id: "lec9",
          title: "Lect 9 part 2 Dr.Saeed",
          type: "file",
          content: "./pdfs/accounting/Lect 9 Accounting (S.O V2).pdf",
        },
      ], // Chapter 3

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
          id: "vid1",
          title: "Sum Of Lect 1",
          type: "video",
          content: "./pdfs/accounting/Sum of Lect 1.mp4",
        },
        {
          id: "vid1",
          title: "Sum Of Lect 2",
          type: "video",
          content: "./pdfs/accounting/Sum of Lect 2 Accounting.mp4",
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
          id: "vid4",
          title: "Lect 6 Dr.MZ",
          type: "video",
          content: "./pdfs/accounting/Lect 6 (Accounting) (S.O).mp4",
        },
      ], // Chapter 2
      [
        {
          id: "vid8",
          title: "Part 1 Dr.MZ",
          type: "video",
          content: "./pdfs/accounting/Part 1 Acc. (S.O V2).mp4",
        },
        {
          id: "vid7",
          title: "Lect 7 Dr.Saeed",
          type: "video",
          content: "./pdfs/accounting/Lect 7 (Acc.) (S.O V2).mp4",
        },
        {
          id: "vid8",
          title: "Lect 8 Dr.Saeed",
          type: "video",
          content: "./pdfs/accounting/Lect 8 Part 2 (ACC) (S.O V2).mp4",
        },
         {
          id: "vid9",
          title: "Lect 9 Dr.Saeed",
          type: "video",
          content: "./pdfs/accounting/Lect 9 Accounting (S.O V2).mp4",
        },
      ], // Chapter 3
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
        {
          id: "lec3",
          title: "Section 7 'HandWriting'",
          type: "file",
          content: "./pdfs/accounting/Sections 7 (Acc.) (S.O).pdf",
        },
      ],
      [], // Chapter 2
      [], // Chapter 3
      [], // Chapter 4
    ],
    quizzes: [
      // Chapter 1
      [
        {
          id: "lec1",
          title: "Quiz 1",
          type: "file",
          content: "./pdfs/accounting/Quiz 1 Accounting.pdf",
        },
      ],
      [], // Chapter 2
      [], // Chapter 3
      [], // Chapter 4
    ],
    summaries: [
      // Chapter 1
      [
        {
          id: "lec1",
          title: "Summary of lect 1",
          type: "file",
          content: "./pdfs/accounting/Sum Of Lect 1 (Acc.) (S.O V2).pdf",
        },
        {
          id: "lec2",
          title: "Summary of lect 2",
          type: "file",
          content: "./pdfs/accounting/Sum Of Lect 2 (Acc.) (S.O V2).pdf",
        },
        {
          id: "lec3",
          title: "Summary of lect 3",
          type: "file",
          content: "./pdfs/accounting/Sum Of Lect 3 (Acc.) (S.O V2).pdf",
        },
      ],
      [
        {
          id: "lec4",
          title: "Summary of lect 4",
          type: "file",
          content: "./pdfs/accounting/Sum Of Lect 4 (Acc.) (S.O V2).pdf",
        },
        {
          id: "lec5",
          title: "Summary of lect 5-6",
          type: "file",
          content: "./pdfs/accounting/Sum Of Lect 5-6 (Acc.) (S.O V2).pdf",
        },
      ], // Chapter 2
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
          title: "Cardinal Utility Theory",
          type: "file",
          content: "./pdfs/economics/Lect_1_Cardinal_Utility_Theory.pdf",
          interactive: [
            {
              title: "What is Utility?",
              content:
                "Utility is the satisfaction or benefit derived from consuming a product.",
            },
            {
              title: "Law of Diminishing Marginal Utility",
              content:
                "As more of a good is consumed, the additional satisfaction from another unit decreases.",
            },
          ],
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
          title: "Lect 1-2 Dr.Hannan",
          type: "video",
          content: "./pdfs/economics/lect 1 .mp4",
        },
        {
          id: "vid2",
          title: "Lect 3 Dr.Hannan",
          type: "video",
          content: "./pdfs/economics/Lect 2 .mp4",
        },
        {
          id: "vid3",
          title: "Ch1 Dr.Hannan",
          type: "video",
          content: "./pdfs/economics/lect 3 .mp4",
        },
      ],
      [
        {
          id: "vid4",
          title: "Lect 4 Dr.Hannan",
          type: "video",
          content: "./pdfs/economics/Lect 4 (Eco) (S.O).mp4",
        },
        {
          id: "vid4",
          title: "Lect 5 Dr.Hannan",
          type: "video",
          content: "./pdfs/economics/Lect 5 (Eco) (S.O).mp4",
        },
        {
          id: "vid5",
          title: "Lect 6 Dr.Hannan",
          type: "video",
          content: "./pdfs/economics/Lect 6 (Eco) (S.O).mp4",
        },
      ], // Chapter 2
      [
        {
          id: "vid6",
          title: "Lect 7 Dr.Eman Part 2 ",
          type: "video",
          content: "./pdfs/economics/Lect 7 Eco Part 2 (S.O V2).mp4",
        },
      ], // Chapter 3
    ],
    sections: [
      // Chapter 1
      [
        {
          id: "lec1",
          title: "Section 1-2 'HandWriting'",
          type: "file",
          content: "./pdfs/economics/Section1-2(Eco) (S.O).pdf",
        },
        {
          id: "lec2",
          title: "Section 3 'HandWriting'",
          type: "file",
          content: "./pdfs/economics/Section 3 (Eco) Susbjects Online V2 .pdf",
        },
        {
          id: "lec3",
          title: "Section 4 'Hand Writing'",
          type: "file",
          content: "./pdfs/economics/Eco section 4 .pdf",
        },
        {
          id: "lec5",
          title: "Section 5 'Hand Writing'",
          type: "file",
          content: "./pdfs/economics/Section 5 Eco (S.O V2) .pdf",
        },
        {
          id: "lec7",
          title: "Section 7 'Hand Writing'",
          type: "file",
          content: "./pdfs/economics/Section 7 Eco (S.O V2) .pdf",
        },
      ],
      [], // Chapter 2
      [], // Chapter 3
    ],
    quizzes: [
      // Chapter 1
      [
        {
          id: "lec1",
          title: "Quiz 1",
          type: "file",
          content: "./pdfs/economics/Eco Quiz1.pdf",
        },
        {
          id: "lec1",
          title: "Quiz 2",
          type: "file",
          content: "./pdfs/economics/Eco Quiz2.pdf",
        },
      ],
      [], // Chapter 2
      [], // Chapter 3
    ],
    summaries: [
      // Chapter 1
      [
        {
          id: "lec1",
          title: "Sum of Lect 5",
          type: "file",
          content: "./pdfs/economics/Sum of Lect 5 Eco (S.O V2).pdf",
        },
        {
          id: "lec2",
          title: "Sum of Lect 5 رسومات",
          type: "file",
          content:
            "./pdfs/economics/📊 ملخص رسومات Lecture 5 - Microeconomics (S.O V2).pdf",
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
          id: "lec4",
          title: "Lect5 'HandWriting'",
          type: "file",
          content: "./pdfs/english/Lect 5 (English) (S.O).pdf",
        },
        {
          id: "lec4",
          title: "Lect6 'HandWriting'",
          type: "file",
          content: "./pdfs/english/Lect 6 (English) (S.O V2).pdf",
        },
        {
          id: "lec5",
          title: "Lect 8 'HandWriting' Dr.Wesam",
          type: "file",
          content: "./pdfs/english/Lect  8 (English) (S.O V2) Hand Writing.pdf",
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
        {
          id: "vid4",
          title: "Lect 5 Dr.Reham",
          type: "video",
          content: "./pdfs/english/Lect 5 (English) (S.O V2).mp4",
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
    quizzes: [
      // Chapter 1
      [
        {
          id: "lec1",
          title: "Quiz 1",
          type: "file",
          content: "./pdfs/english/business English Quiz 1.pdf",
        },
      ],
      [], // Chapter 2
      [], // Chapter 3
      [], // Chapter 4
    ],
  },
  //-------------------------------------------------------------
  "political-science": {
    "course-content": [
      [
        {
          id: "pol1",
          title: "Lect 1-2 Dr.Ashraf",
          type: "file",
          content:
            "./pdfs/political-science/Political_Science_Lectures_1__2.pdf",
        },
      ],
      [
        {
          id: "pol2",
          title: "Lect 3-4 Dr.Ashraf",
          type: "file",
          content: "./pdfs/political-science/Lect 3-4 (Political) (S.O).pdf",
        },
        {
          id: "pol3",
          title: "Lect 5 Dr.Ashraf",
          type: "file",
          content: "./pdfs/political-science/Lect 5 (Political) (S.O).pdf",
        },
      ],
      [
        {
          id: "pol6",
          title: "Lect 6 Dr.Ashraf",
          type: "file",
          content: "./pdfs/political-science/Lect 6 (Political) (S.O V2).pdf",
        },
      ],
    ],
    quizzes: [
      [
        {
          id: "pol1",
          title: "Quiz 1 Dr.Ashraf",
          type: "file",
          content: "./pdfs/political-science/Quiz 1 Political Science.pdf",
        },
        {
          id: "pol2",
          title: "Quiz 1 Dr.Ashraf حل بالتفصيل",
          type: "file",
          content: "./pdfs/political-science/Quiz 1 (Political) (S.O).pdf",
        },
      ],
    ],
    videos: [
      [
        {
          id: "vid1",
          title: "Lect 1-2 Dr.Ashraf",
          type: "video",
          content: "./pdfs/political-science/Lect 1-2.mp4",
        },
      ],
      [
        {
          id: "vid2",
          title: "Lect 3-4 Dr.Ashraf ",
          type: "video",
          content: "./pdfs/political-science/Lect 3-4 (Political) (S.O).mp4",
        },
        {
          id: "vid3",
          title: "Lect 5 Dr.Ashraf ",
          type: "video",
          content: "./pdfs/political-science/Lect 5 (Political) (S.O).mp4",
        },
      ],
      [
        {
          id: "vid6",
          title: "Lect 6 Dr.Ashraf ",
          type: "video",
          content: "./pdfs/political-science/Lect 6 (Political) (S.O V2).mp4",
        },
        
      ],
    ],
    qa: [
      [
        {
          id: "Lec1",
          title: "70 Q on Ch1",
          type: "file",
          content: "./pdfs/political-science/70 Q On Ch1.pdf",
        },
      ],
    ],
    summaries: [
      [
        {
          id: "Lec1",
          title: "Sum. Lect 1-2",
          type: "file",
          content:
            "./pdfs/political-science/Political_Science summary __Lectures_1__2_.pdf",
        },
      ],
    ],
  },
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
      [
        {
          id: "lec5",
          title: "Lect 5 Dr.Heba Mostafa 45 Page 💀",
          type: "file",
          content: "./pdfs/marketing/Lect 5 (Marketing) (S.O V2).pdf",
        },
        {
          id: "lec5",
          title: "Lect 5 Dr.Heba Mostafa Compressed",
          type: "file",
          content: "./pdfs/marketing/Lect 5 Marketing.pdf",
        },
      ], // Chapter 3
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
      [
        {
          id: "vid5",
          title: "Lect 5 Dr.HM",
          type: "video",
          content: "./pdfs/marketing/Lect 5 (Marketing) (S.O V2).mp4",
        },
        {
          id: "vid6",
          title: "Lect 6 Dr.HM",
          type: "video",
          content: "./pdfs/marketing/Lect 6 Marketing (S.O V2).mp4",
        },
      ], // Chapter 3
      [
        {
          id: "vid7",
          title: "Lect 7 Dr.HM",
          type: "video",
          content: "./pdfs/marketing/Lect 7 Marketing (S.O V2).mp4",
        },
        {
          id: "vid8",
          title: "Lect 8 Dr.HM",
          type: "video",
          content: "./pdfs/marketing/Lect 8 Marketing (S.O V2).mp4",
        },
      ]
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
  statistics: {
    "course-content": [
      // Chapter 1
      [
        {
          id: "lec1",
          title: "Lect 1 Dr.Magda",
          type: "file",
          content: "./pdfs/statistics/Lect 1 (Stat) (S.O).pdf",
        },
        {
          id: "lec3",
          title: "Lect 3 Dr.Magda",
          type: "file",
          content: "./pdfs/statistics/Lect 3 (Stat) (S.O).pdf",
        },
        {
          id: "lec4",
          title: "Lect 4 Dr.Magda",
          type: "file",
          content: "./pdfs/statistics/Lect 4pdf.pdf",
        },
        {
          id: "lec5",
          title: "Lect 5 Dr.Magda",
          type: "file",
          content: "./pdfs/statistics/Lect 5 (Stat) (S.O V2).pdf",
        },
        {
          id: "lec6",
          title: "Lect 6 Dr.Magda",
          type: "file",
          content: "./pdfs/statistics/Lect 6 (Stat) (S.O V2).pdf",
        },
        {
          id: "lec7",
          title: "Lect1-4 'HandWriting' Dr.Magda",
          type: "file",
          content: "./pdfs/statistics/Lect1-4(Stat) (S.O).pdf",
        },
      ],
      [
        {
          id: "lec8",
          title: "Lect 8 'HandWriting' Dr.Ahmed",
          type: "file",
          content: "./pdfs/statistics/Lect 8 (stat) (S.O V2) Hand Writing.pdf",
        },
        {
          id: "lec19",
          title: "Lects 'HandWriting' Dr.Ahmed",
          type: "file",
          content: "./pdfs/statistics/Lect 1-2 Stat (S.O V2) .pdf",
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
          title: "Lect 1 Dr.Magda",
          type: "video",
          content: "./pdfs/statistics/Lect 1.mp4",
        },
        {
          id: "vid2",
          title: "Lect 2 Dr.Magda",
          type: "video",
          content: "./pdfs/statistics/Lect 2.mp4",
        },
        {
          id: "vid3",
          title: "Lect 3 Dr.Magda",
          type: "video",
          content: "./pdfs/statistics/Lect 3.mp4",
        },
        {
          id: "vid4",
          title: "Lect 4 Dr.Magda",
          type: "video",
          content: "./pdfs/statistics/Lect 4 (Stat) (S.O).mp4",
        },
        {
          id: "vid5",
          title: "Lect 5 Dr.Magda",
          type: "video",
          content: "./pdfs/statistics/Lect 5 (Stat) (S.O V2).mp4",
        },
        {
          id: "vid6",
          title: "Lect 6 Dr.Magda",
          type: "video",
          content: "./pdfs/statistics/Lect 6 (Stat) (S.O V2).mp4",
        },
      ],
      [
        {
          id: "vid7",
          title: "Lect 7-8 Dr.Ahmed",
          type: "video",
          content: "./pdfs/statistics/Lect 7-8 Part 2 (stat) (S.O V2).mp4",
        },
      ], // Chapter 2
      [], // Chapter 3
    ],
    qa: [
      // Chapter 1
      [
        {
          id: "lec1",
          title: "All Assignments Dr.Magda",
          type: "file",
          content: "./pdfs/statistics/All Assignments For Dr Magda.pdf",
        },
      ],
      [], // Chapter 2
      [], // Chapter 3
      [], // Chapter 4
    ],
    summaries: [
      // Chapter 1
      [
        // {
        //   id: "lec1",
        //   title: "All Assignments Dr.Magda",
        //   type: "file",
        //   content: "./pdfs/statistics/All Assignments For Dr Magda.pdf",
        // },
      ],
      [], // Chapter 2
      [], // Chapter 3
      [], // Chapter 4
    ],
    quizzes: [
      [
        {
          id: "lec1",
          title: "Quiz 1 ",
          type: "file",
          content: "./pdfs/statistics/Quiz 1 (stat) (S.O V2).pdf",
        },
        {
          id: "lec2",
          title: "Quiz 2 ",
          type: "file",
          content: "./pdfs/statistics/Inferential_Statistics Quiz 2.pdf",
        },
      ],
    ],
  },

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
          id: "lec6",
          title: "Lect 4 DR.S.R",
          type: "file",
          content: "./pdfs/ais/Lect 4  (AIS) (S.O V2).pdf",
        },
        {
          id: "lec4",
          title: "Lects 'HandWriting'",
          type: "file",
          content: "./pdfs/ais/Lects (AIS) (S.O).pdf",
        },
        {
          id: "lec5",
          title: "Lect 6 'HandWriting'",
          type: "file",
          content: "./pdfs/ais/Notes On Lect 6 (AIS) (S.O V2).pdf",
        },
        {
          id: "lec6",
          title: "Lect 8 'HandWriting'",
          type: "file",
          content: "./pdfs/ais/Lect 8 AIS (S.O V2) Hand Writing.pdf",
        },
        
      ], // Chapter 3
      [
        {
          id: "lec7",
          title: "Lect 7 Dr.MZ",
          type: "file",
          content: "./pdfs/ais/Lect 7 AIS (S.O V2).pdf",
        },
        {
          id: "lec9",
          title: "Lect 9 Dr.MZ",
          type: "file",
          content: "./pdfs/ais/Lect 9 AIS (S.O V2).pdf",
        },
        {
          id: "lec10",
          title: "Lect 10 'HandWriting'",
          type: "file",
          content: "./pdfs/ais/Lect 10 AIS (S.O V2) Hand Writing.pdf",
        },
      ], // Chapter 4
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
        {
          id: "vid6",
          title: "Lect 6 Dr.S.R",
          type: "video",
          content: "./pdfs/ais/Lect 6 (AIS) (S.O V2).mp4",
        },
      ], // Chapter 2

      [
        {
          id: "vid7",
          title: "Lect 7 Part 2 Dr.M.Z",
          type: "video",
          content: "./pdfs/ais/Lect 1 Part 2 (Ais) (S.O V2).mp4",
        },
        {
          id: "vid8",
          title: "Lect 8 Part 2 Dr.M.Z",
          type: "video",
          content: "./pdfs/ais/Lect 8 AIS (S.O V2).mp4",
        },
      ], // Chapter 3

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
          id: "lec1",
          title: "Lect 1 Dr.S.R 'best'",
          type: "file",
          content: "/pdfs/ais/Lecture 1 (AIS) (S.O V2) summary.pdf",
        },
        {
          id: "lec2",
          title: "Lect 2 Dr.S.R",
          type: "file",
          content: "./pdfs/ais/Lecture_No._2 summary.pdf",
        },
        {
          id: "lec2",
          title: "Lect 2 Dr.S.R 'best'",
          type: "file",
          content: "./pdfs/ais/Lecture 2 summary AIS (S.O V2).pdf",
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
    quizzes: [
      // Chapter 1
      [
        {
          id: "lec1",
          title: "Quiz 1 ",
          type: "file",
          content: "./pdfs/ais/AIS Quiz 1.pdf",
        },
        {
          id: "lec2",
          title: "Quiz 2 from 3/4 8 A.M to 4/4 11:59 P.M",
          type: "file",
          content: "./pdfs/ais/AIS_Questions_and_Answers (َQuiz 2) .pdf",
        },
      ],

      [], // Chapter 2

      [], // Chapter 3

      [], // Chapter 4
    ],
  },
  "public-finance": {
    "course-content": [
      [
        {
          id: "lec1",
          title: "Lect 1 Dr.Abeer",
          type: "file",
          content: "./pdfs/Puplic/Lect 1 (Public).pdf",
        },
        {
          id: "lec2",
          title: "Lect 2 Dr.Abeer",
          type: "file",
          content: "./pdfs/Puplic/Lect 2 (Public).pdf",
        },
        {
          id: "lec3",
          title: "Lect 3 Dr.Abeer",
          type: "file",
          content: "./pdfs/Puplic/Lect 3(Public) (S.O).pdf",
        },
        {
          id: "lec4",
          title: "Lect 4 Dr.Abeer",
          type: "file",
          content: "./pdfs/Puplic/Lect 4 (Public) (S.O).pdf",
        },
        {
          id: "lec5",
          title: "Lect 5 Dr.Abeer",
          type: "file",
          content: "./pdfs/Puplic/Lect 5 (Public) (S.O).pdf",
        },
        {
          id: "lec5",
          title: "Lect 2-5 Dr.Abeer 'HandWriting'",
          type: "file",
          content: "./pdfs/Puplic/Lect2-5 (Public) (S.O).pdf",
        },
        {
          id: "lec6",
          title: "Lect 6 Dr.Abeer 'HandWriting'",
          type: "file",
          content: "./pdfs/Puplic/Lect 6 (Public) (S.O V2).pdf",
        },
        {
          id: "lec7",
          title: "Lect 7-8-9 Dr.Ahmed",
          type: "file",
          content: "./pdfs/Puplic/Lect 7-8-9 Part 2 (Public) (S.O V2).pdf",
        },
      ],
    ],
    videos: [
      [
        {
          id: "vid1",
          title: "Lect 1 Dr.Abeer",
          type: "video",
          content: "./pdfs/Puplic/Lect 1.mp4",
        },
        {
          id: "vid2",
          title: "Lect 2 Dr.Abeer",
          type: "video",
          content: "./pdfs/Puplic/Lect 2 (Public).pdf",
        },
        {
          id: "vid3",
          title: "Lect 3 Dr.Abeer",
          type: "video",
          content: "./pdfs/Puplic/Lect 3.mp4",
        },
        {
          id: "vid4",
          title: "Lect 4 Dr.Abeer",
          type: "video",
          content: "./pdfs/Puplic/Lect 4 (Public) (S.O).mp4",
        },
        {
          id: "vid5",
          title: "Lect 5 Dr.Abeer",
          type: "video",
          content: "./pdfs/Puplic/Lect 1.mp4",
        },
        {
          id: "vid6",
          title: "Lect 7-8-9 Dr.Ahmed",
          type: "video",
          content: "./pdfs/Puplic/Public loans first pdf part 2 19 page.mp4",
        },
      ],
    ],
    sections: [
      [
        {
          id: "lec1",
          title: "section 1 Full_QA_with_Explanations Dr.Abeer ",
          type: "file",
          content:
            "./pdfs/Puplic/Section_(1)__Public_Finance_(2)__Full_QA_with_Explanations_.pdf",
        },
        {
          id: "lec2",
          title: "section 1 Dr.Abeer اخطاء معدلة",
          type: "file",
          content:
            "./pdfs/Puplic/Section 1 Public Finance 2 الاخطاء متعدلة .pdf",
        },
        {
          id: "lec3",
          title: "section 1-2 'HandWriting' Dr.Abeer  ",
          type: "file",
          content: "./pdfs/Puplic/Sections1-2(Public) (S.O).pdf",
        },
        {
          id: "lec4",
          title: "section 3 'HandWriting' Dr.Abeer  ",
          type: "file",
          content: "./pdfs/Puplic/Section 3 (Public) Subjects Online V2.pdf",
        },
        {
          id: "lec5",
          title: "section 4 'HandWriting' ",
          type: "file",
          content: "./pdfs/Puplic/Puplic section 4.pdf",
        },
        {
          id: "lec6",
          title: "section 7 'HandWriting' ",
          type: "file",
          content: "./pdfs/Puplic/Sections 7 (Public) (S.O).pdf",
        },
      ],
    ],
    summaries: [
      [
        {
          id: "lec1",
          title: "Sum. Ch1 Dr.Abeer ",
          type: "file",
          content: "./pdfs/Puplic/Summary of Ch 1 (Public).pdf",
        },
      ],
    ],
  },
};

// statistics: {
//   "course-content": [
//     [
//       {
//         id: "stat1",
//         title: "Probability Distribution",
//         type: "file",
//         content: "./pdfs/statistics/Prob_Dist.pdf",
//         interactive: [
//           {
//             title: "Random Variables",
//             content:
//               "A random variable is a numerical description of the outcome of an experiment.",
//           },
//           {
//             title: "Discrete vs Continuous",
//             content:
//               "Discrete variables have countable outcomes, while continuous variables can take any value in an interval.",
//           },
//           {
//             title: "Expected Value",
//             content:
//               "The mean or expected value of a random variable is the weighted average of all possible values.",
//           },
//         ],
//       },
//     ],
//   ],
// },
//----------------------------------------------
const SPECIAL_CONTENT = {
  accounting: [
    // {
    //   id: "sp-acc-1",
    //   title: "PPE Discovery",
    //   interactive: [
    //     {
    //       title: "The Concept",
    //       content:
    //         "Property, Plant, and Equipment (PPE) are the physical foundations of a business. They aren't for sale; they are for use.",
    //     },
    //     {
    //       title: "Cost Components",
    //       content:
    //         "The cost of PPE includes everything needed to get it ready—purchase price, taxes, and even the platform it sits on.",
    //     },
    //   ],
    // },
  ],
  eco: [
    // {
    //   id: "sp-eco-1",
    //   title: "Utility Journey",
    //   interactive: [
    //     {
    //       title: "Satisfying Needs",
    //       content:
    //         "In economics, utility is the measure of happiness. But be careful—happiness fades with every extra unit you consume.",
    //     },
    //     {
    //       title: "The Curve",
    //       content:
    //         "Diminishing marginal utility explains why your second pizza slice is never as exciting as the first.",
    //     },
    //   ],
    // },
  ],
  statistics: [
    // {
    //   id: "sp-stat-1",
    //   title: "Probability Masterclass",
    //   interactive: [
    //     {
    //       title: "Randomness",
    //       content:
    //         "A random variable maps outcomes to numbers. It's the bridge between raw data and mathematical models.",
    //     },
    //     {
    //       title: "Distributions",
    //       content:
    //         "How data is spread—discrete or continuous—defines which statistical tools we use to predict the future.",
    //     },
    //   ],
    // },
  ],
  "political-science": [
    // {
    //   id: "sp-pol-1",
    //   title: "Power & Systems",
    //   interactive: [
    //     {
    //       title: "Political Entities",
    //       content:
    //         "States, governments, and international organizations are the actors on the global stage.",
    //     },
    //     {
    //       title: "Governance",
    //       content:
    //         "How power is distributed—democracy, autocracy, or oligarchy—shapes the destiny of nations.",
    //     },
    //   ],
    // },
  ],
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

// Add closeViewer reset to main.js if needed - I'll do it separately or here if I find it.
// Actually I'll update closeViewer in main.js.
