export const services = [
  [
    "Career guidance and counselling",
    "Explore career options, subject choices and study pathways with a counsellor.",
  ],
  [
    "Professional Psychological Therapy",
    "Support for adolescents, adults, couples and families.",
  ],
  [
    "Medico-Legal Services",
    "Professional assessment services for medico-legal matters.",
  ],
  [
    "Employee Assistance Program",
    "Preventative care and counselling support for organisations.",
  ],
  ["Wellness Services", "Programmes that address wellbeing in the workplace."],
  [
    "Soft Skills Training",
    "Workshops for communication, teamwork and professional development.",
  ],
  [
    "Psychometric Solutions",
    "Practitioner-led psychometric and competency assessment services.",
  ],
] as const;
export const slug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-$/, "");
export type Practitioner = {
  id: string;
  name: string;
  area: string;
  about: string;
  founder?: boolean;
  legacyProfile?: string;
  color: string;
};
export const practitioners: Practitioner[] = [
  {
    id: "letta",
    name: "Letta",
    founder: true,
    area: "Clinical Psychologist",
    about: "Letta founded Letta Consulting and leads its practitioner team.",
    color: "mint",
  },
  {
    id: "naledi",
    legacyProfile: "0",
    name: "Naledi M.",
    area: "Career guidance",
    about: "Explore interests, subject choices and possible study pathways.",
    color: "mint",
  },
  {
    id: "kabelo",
    legacyProfile: "1",
    name: "Kabelo S.",
    area: "Wellness support",
    about: "Discuss wellbeing and the kind of support you would like.",
    color: "lilac",
  },
  {
    id: "ayesha",
    legacyProfile: "2",
    name: "Ayesha D.",
    area: "Professional development",
    about:
      "Plan a workplace workshop or a professional development conversation.",
    color: "peach",
  },
];
const entries = [
  [
    "Software developer",
    "Technology",
    "Build and improve software that helps people solve everyday problems.",
    "Problem solving, teamwork, programming",
    "Mathematics, IT",
    "Computer science degree, diploma or practical software training",
    "Design a small app and test it with a friend.",
  ],
  [
    "Environmental scientist",
    "Science",
    "Investigate how human activity affects ecosystems.",
    "Fieldwork, observation, data analysis",
    "Life Sciences, Geography",
    "Environmental science or related science degree",
    "Compare two local habitats and record what you notice.",
  ],
  [
    "Occupational therapist",
    "Health",
    "Help people participate in daily activities at home, school and work.",
    "Listening, observation, collaboration",
    "Life Sciences, Mathematics",
    "Accredited occupational therapy degree and professional registration",
    "Explore how changing a classroom layout might improve access.",
  ],
  [
    "Teacher",
    "Education",
    "Plan lessons and help learners develop skills and confidence.",
    "Communication, planning, creativity",
    "Languages, relevant teaching subjects",
    "Bachelor of Education or a degree followed by a teaching qualification",
    "Explain a favourite topic in a five-minute lesson.",
  ],
  [
    "Entrepreneur",
    "Business",
    "Develop an idea into a product or service that meets a need.",
    "Budgeting, initiative, communication",
    "Business Studies, Accounting",
    "Business training, mentorship or practical experience",
    "Interview someone about a problem they would pay to solve.",
  ],
  [
    "Civil engineer",
    "Engineering",
    "Design and maintain infrastructure such as roads and water systems.",
    "Design, mathematics, project planning",
    "Mathematics, Physical Sciences",
    "Civil engineering degree or engineering technology qualification",
    "Sketch a safer pedestrian crossing near your school.",
  ],
  [
    "Graphic designer",
    "Creative industries",
    "Use typography, imagery and layout to communicate ideas.",
    "Visual communication, design, feedback",
    "Visual Arts, Design",
    "Design degree, diploma or portfolio development",
    "Create a poster for a community event.",
  ],
  [
    "Community development worker",
    "Social sciences",
    "Work with communities to plan and coordinate local initiatives.",
    "Facilitation, listening, research",
    "Languages, Geography",
    "Community development or social sciences studies",
    "Map a community need and the people already working on it.",
  ],
  [
    "Legal researcher",
    "Law",
    "Find and explain legislation and case material for legal teams.",
    "Research, reading, writing",
    "Languages, History",
    "Legal studies, often through an LLB",
    "Summarise a public court decision in plain language.",
  ],
  [
    "Agricultural technician",
    "Agriculture",
    "Support field trials, production planning and sustainable farming.",
    "Observation, practical skills, data collection",
    "Agricultural Sciences, Life Sciences",
    "Agricultural diploma or technical training",
    "Track the growth of two plants under different conditions.",
  ],
  [
    "Electrician",
    "Trades",
    "Install, maintain and test electrical systems.",
    "Precision, troubleshooting, teamwork",
    "Mathematics, Electrical Technology",
    "Vocational training, apprenticeship and trade test",
    "Explore an introductory circuit simulation.",
  ],
];
export const careers = entries.map(
  ([name, category, summary, skills, subjects, study, activity]) => ({
    id: slug(name),
    name,
    category,
    summary,
    skills,
    subjects,
    study,
    activity,
  }),
);
export const resources = [
  [
    "Managing stress",
    "Give your week a little breathing room",
    "Write down three things on your mind. Circle one you can influence today. Choose a small next step and make time for a break.",
  ],
  [
    "Building confidence",
    "Keep a strengths journal",
    "Recall a moment when you helped, learned or persisted. Write down what you did and one way to use that strength again.",
  ],
  [
    "Emotional wellbeing",
    "Find words for a feeling",
    "Choose a word that describes today. Write about one thing that influenced it and one person you could talk to.",
  ],
  [
    "Healthy relationships",
    "Prepare for a conversation",
    "Choose a quiet time, describe what happened in your own words and leave space to hear the other person's perspective.",
  ],
  [
    "Academic pressure",
    "Plan a manageable study block",
    "Pick one topic and one short task. Set a finish time, take a break and note where to start next time.",
  ],
  [
    "Study-life balance",
    "Make space for rest",
    "Sketch your week. Include study, travel and responsibilities, then reserve a little time for an activity you enjoy.",
  ],
  [
    "Personal development",
    "Try a new skill",
    "Choose something small to practise this week. After trying it, write down what surprised you.",
  ],
  [
    "Life transitions",
    "Get ready for a change",
    "List what will change, what will stay familiar and who you can ask for practical support.",
  ],
  [
    "Seeking support",
    "Prepare for a first conversation",
    "Write down what you would like to discuss and what you hope to learn about available support.",
  ],
];
export const opportunities = [
  [
    "Bursary",
    "Community study bursary",
    "For prospective first-year students exploring funding.",
  ],
  [
    "Scholarship",
    "Creative portfolio award",
    "For learners developing a creative portfolio.",
  ],
  [
    "Career event",
    "Career Discovery Day",
    "For learners and families exploring career fields.",
  ],
  [
    "Workshop",
    "Study planning workshop",
    "For learners preparing a study timetable.",
  ],
  [
    "Internship",
    "Design studio internship",
    "For aspiring designers with a sample portfolio.",
  ],
  [
    "Learnership",
    "Technical skills learnership",
    "For school leavers interested in practical training.",
  ],
  [
    "Education",
    "University readiness programme",
    "For learners considering further study.",
  ],
];
export const practiceTabs = [
  "Overview",
  "Practitioners",
  "Clients",
  "Appointments",
  "Assessments",
  "Reports",
  "Content Studio",
  "Schools",
  "Events",
  "Services",
  "Finance",
  "Settings",
];
export const youthLinks = [
  ["Dashboard", "/discover"],
  ["Discover Me", "/discover/me"],
  ["Career World", "/careers"],
  ["Future Games", "/games"],
  ["My Future", "/my-future"],
  ["Wellness Space", "/wellness"],
  ["Opportunity Hub", "/opportunities"],
  ["Career Toolkit", "/career-toolkit"],
];
export const roles = [
  ["Youth", "/discover"],
  ["Individual", "/individual/dashboard"],
  ["Parent or guardian", "/parent/dashboard"],
  ["School", "/school/dashboard"],
  ["Corporate", "/corporate/dashboard"],
  ["Practice team", "/practice"],
];
export const programs = [
  "Career Discovery Day",
  "Subject Selection Guidance",
  "Matric Future Planning",
  "University Readiness",
  "Graduate Employability",
  "Student Wellness Workshops",
];
export const pathList = [
  "services",
  "about",
  "team",
  "events",
  "contact",
  "resources",
  "privacy",
  "terms",
  "discover",
  "discover/me",
  "discover/onboarding",
  "discover/results",
  "games",
  "my-future",
  "wellness",
  "opportunities",
  "careers",
  "career-toolkit",
  "career-toolkit/cv-builder",
  "career-toolkit/cover-letter-builder",
  "booking",
  "booking/confirmation",
  "portal",
  "practice",
  ...roles.slice(1, 5).map((r) => r[1].slice(1)),
  ...practiceTabs.slice(1).map((t) => "practice/" + slug(t)),
  ...careers.map((c) => "careers/" + c.id),
  ...services.map((s) => "services/" + slug(s[0])),
];
