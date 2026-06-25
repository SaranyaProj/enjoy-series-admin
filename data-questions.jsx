/* data-questions.jsx — Question Bank data model: reusable assessment & learning
   questions across all supported formats, with tags, usage categories, parent-child
   (sub-questions) and per-question skip logic. Drives the Question Bank and the
   Diagnostic Assessment builder. */

/* supported question formats — architecture is extensible: add an entry here and a
   matching answer-editor branch in question-bank.jsx to introduce a new type. */
const QUESTION_TYPES = [
  { id: "single",  name: "Single Select",        short: "MCQ · single", icon: "IcQuiz",        desc: "One correct answer" },
  { id: "multi",   name: "Multi Select",         short: "MCQ · multi",  icon: "IcCheckCircle", desc: "Multiple correct answers" },
  { id: "text",    name: "Text Input",           short: "Text",         icon: "IcEdit",        desc: "Student types the answer" },
  { id: "match",   name: "Match the Following",  short: "Match",        icon: "IcLink",        desc: "Match items across two columns" },
  { id: "reading", name: "Reading Comprehension",short: "Passage",      icon: "IcReading",     desc: "Passage followed by sub-questions" },
  { id: "image",   name: "Image-Based",          short: "Image",        icon: "IcModule",      desc: "Question contains an image" },
  { id: "audio",   name: "Audio-Based",          short: "Audio",        icon: "IcAudio",       desc: "Question contains an audio prompt" },
];
const QTYPE_BY_ID = Object.fromEntries(QUESTION_TYPES.map(t => [t.id, t]));

/* a question may belong to multiple usage categories */
const USAGE_TYPES = [
  { id: "diagnostic", label: "Diagnostic Assessment", color: "var(--pri)" },
  { id: "inapp",      label: "In-App Learning",       color: "var(--maths)" },
  { id: "practice",   label: "Practice",              color: "var(--tamil)" },
  { id: "assessment", label: "Assessment",            color: "var(--english)" },
  { id: "video",      label: "Video-Based",           color: "var(--st-sched)" },
];
const USAGE_BY_ID = Object.fromEntries(USAGE_TYPES.map(u => [u.id, u]));

/* difficulty colour coding, consistent across the platform */
const DIFF_COLOR = { Easy: "var(--st-approve)", Medium: "var(--st-review)", Hard: "var(--st-revise)" };

/* Every question carries curriculum metadata for filtering: subject, academic
   `grade`, subject `level`, `difficulty`, learning outcome `lo`, `competency`,
   `language`, `tags` (topics), `type` and `usage`. */
const Q = (o) => Object.assign({ marks: 1, tags: [], usage: [], options: [], media: {}, children: [], skip: null, grade: null, lo: "", competency: "", language: "English" }, o);

const QUESTIONS = [
  Q({ id: "q1", title: "Count the apples", content: "How many apples are shown in the basket?", type: "image", subject: "Maths", grade: "Grade 1", level: "Level 1", difficulty: "Easy", marks: 1,
      lo: "Count objects up to 10 and match to a numeral", competency: "Counting & Cardinality", language: "English",
      usage: ["diagnostic","inapp"], tags: ["Counting","Number recognition"], media: { image: "apples.png" },
      options: [{ text: "3", correct: false }, { text: "4", correct: true }, { text: "5", correct: false }], feedback: "Count one apple at a time." }),
  Q({ id: "q2", title: "Which are even numbers?", content: "Select all the even numbers below.", type: "multi", subject: "Maths", grade: "Grade 2", level: "Level 2", difficulty: "Medium", marks: 2,
      lo: "Distinguish even and odd numbers", competency: "Number sense", language: "English",
      usage: ["assessment","practice"], tags: ["Even & odd","Number sense"],
      options: [{ text: "2", correct: true }, { text: "3", correct: false }, { text: "6", correct: true }, { text: "9", correct: false }] }),
  Q({ id: "q3", title: "Greater than", content: "Which symbol makes this true:  7 __ 4 ?", type: "single", subject: "Maths", grade: "Grade 3", level: "Level 3", difficulty: "Medium", marks: 1,
      lo: "Compare numbers using >, < and =", competency: "Comparing", language: "English",
      usage: ["diagnostic","assessment"], tags: ["Comparing"],
      options: [{ text: ">", correct: true }, { text: "<", correct: false }, { text: "=", correct: false }],
      skip: { onIncorrect: "show-easier", onCorrect: "continue" } }),
  Q({ id: "q4", title: "Type the sum", content: "What is 12 + 7 ?", type: "text", subject: "Maths", grade: "Grade 3", level: "Level 3", difficulty: "Hard", marks: 2,
      lo: "Add two two-digit numbers", competency: "Addition", language: "English",
      usage: ["assessment"], tags: ["Addition"], answer: "19" }),
  Q({ id: "q5", title: "Match number to quantity", content: "Match each numeral to the matching group of objects.", type: "match", subject: "Maths", grade: "Grade 1", level: "Level 1", difficulty: "Easy", marks: 3,
      lo: "Match numerals to quantities (one-to-one)", competency: "Counting & Cardinality", language: "English",
      usage: ["inapp","practice"], tags: ["Counting","Cardinality"],
      pairs: [{ l: "3", r: "🍎🍎🍎" }, { l: "1", r: "🍎" }, { l: "2", r: "🍎🍎" }] }),
  Q({ id: "q13", title: "Skip count by 2s", content: "What number comes next: 2, 4, 6, __ ?", type: "single", subject: "Maths", grade: "Grade 2", level: "Level 2", difficulty: "Medium", marks: 1,
      lo: "Skip count by 2s", competency: "Ordering", language: "English",
      usage: ["diagnostic","practice"], tags: ["Skip counting","Patterns"],
      options: [{ text: "7", correct: false }, { text: "8", correct: true }, { text: "10", correct: false }] }),
  Q({ id: "q14", title: "Place value — tens", content: "How many tens are in 36?", type: "single", subject: "Maths", grade: "Grade 4", level: "Level 4", difficulty: "Hard", marks: 2,
      lo: "Identify place value of digits", competency: "Place value", language: "English",
      usage: ["diagnostic","assessment"], tags: ["Place value"],
      options: [{ text: "3", correct: true }, { text: "6", correct: false }, { text: "36", correct: false }] }),

  Q({ id: "q6", title: "Pick the vowel", content: "Which letter is a vowel?", type: "single", subject: "English", grade: "Grade 1", level: "Level 1", difficulty: "Easy", marks: 1,
      lo: "Identify vowels among letters", competency: "Phonics", language: "English",
      usage: ["diagnostic","inapp"], tags: ["Phonics","Letter recognition"],
      options: [{ text: "b", correct: false }, { text: "a", correct: true }, { text: "t", correct: false }] }),
  Q({ id: "q7", title: "Say the word", content: "Listen to the audio and select the word you heard.", type: "audio", subject: "English", grade: "Grade 2", level: "Level 2", difficulty: "Medium", marks: 1,
      lo: "Recognise spoken words", competency: "Listening", language: "English",
      usage: ["video","inapp"], tags: ["Listening","Vocabulary"], media: { audio: "cat.mp3" },
      options: [{ text: "cat", correct: true }, { text: "cap", correct: false }, { text: "cup", correct: false }] }),
  Q({ id: "q8", title: "The Lost Kitten — passage", content: "Read the passage, then answer the questions that follow.", type: "reading", subject: "English", grade: "Grade 3", level: "Level 3", difficulty: "Hard", marks: 3,
      lo: "Comprehend a short narrative passage", competency: "Reading Comprehension", language: "English",
      usage: ["assessment"], tags: ["Reading Comp.","Comprehension"],
      passage: "Mia had a small grey kitten named Smoke. One rainy day, Smoke ran out of the house and got lost. Mia searched everywhere and finally found Smoke hiding under the car, wet and afraid.",
      children: [
        Q({ id: "q8a", title: "What colour was the kitten?", type: "single", difficulty: "Easy", marks: 1, options: [{ text: "Grey", correct: true }, { text: "Black", correct: false }, { text: "White", correct: false }] }),
        Q({ id: "q8b", title: "Where did Mia find Smoke?", type: "single", difficulty: "Medium", marks: 1, options: [{ text: "Under the car", correct: true }, { text: "On the roof", correct: false }, { text: "In a tree", correct: false }] }),
        Q({ id: "q8c", title: "Type one word that describes how Smoke felt.", type: "text", difficulty: "Medium", marks: 1, answer: "afraid" }),
      ] }),
  Q({ id: "q12", title: "Complete the sentence", content: "The sun rises in the ____.", type: "text", subject: "English", grade: "Grade 2", level: "Level 2", difficulty: "Easy", marks: 1,
      lo: "Complete sentences with the correct word", competency: "Grammar", language: "English",
      usage: ["practice","inapp"], tags: ["Grammar","Vocabulary"], answer: "east" }),
  Q({ id: "q15", title: "Choose the noun", content: "Which word is a naming word (noun)?", type: "single", subject: "English", grade: "Grade 3", level: "Level 3", difficulty: "Medium", marks: 1,
      lo: "Identify nouns in a sentence", competency: "Grammar", language: "English",
      usage: ["diagnostic","practice"], tags: ["Grammar","Parts of speech"],
      options: [{ text: "run", correct: false }, { text: "garden", correct: true }, { text: "quickly", correct: false }] }),

  Q({ id: "q9", title: "Tamil uyir letter", content: "எழுத்துகளில் உயிர் எழுத்து எது? (Which is a Tamil vowel?)", type: "single", subject: "Tamil", grade: "Grade 1", level: "Level 1", difficulty: "Easy", marks: 1,
      lo: "Identify Tamil uyir (vowel) letters", competency: "Letter recognition", language: "Tamil",
      usage: ["diagnostic","inapp"], tags: ["Letter recognition"],
      options: [{ text: "அ", correct: true }, { text: "க", correct: false }, { text: "ம", correct: false }] }),
  Q({ id: "q10", title: "Blend the sounds", content: "Listen and choose the blended word.", type: "audio", subject: "Tamil", grade: "Grade 2", level: "Level 2", difficulty: "Medium", marks: 1,
      lo: "Blend Tamil phonemes into a word", competency: "Phonics", language: "Tamil",
      usage: ["inapp","practice"], tags: ["Phonics","Blending"], media: { audio: "blend.mp3" },
      options: [{ text: "பல்", correct: true }, { text: "பள்", correct: false }] }),
  Q({ id: "q11", title: "Match opposites", content: "Match each word to its opposite.", type: "match", subject: "Tamil", grade: "Grade 3", level: "Level 3", difficulty: "Hard", marks: 2,
      lo: "Identify antonyms (opposite words)", competency: "Vocabulary", language: "Tamil",
      usage: ["assessment","practice"], tags: ["Vocabulary","Antonyms"],
      pairs: [{ l: "பெரிது", r: "சிறிது" }, { l: "உயரம்", r: "தாழ்வு" }] }),
  Q({ id: "q16", title: "Tamil sight word", content: "படத்திற்கு ஏற்ற சொல்லைத் தேர்ந்தெடு. (Choose the word for the picture.)", type: "image", subject: "Tamil", grade: "Grade 1", level: "Level 1", difficulty: "Easy", marks: 1,
      lo: "Read common Tamil sight words", competency: "Reading", language: "Tamil",
      usage: ["diagnostic","inapp"], tags: ["Sight words","Reading"], media: { image: "tamil-word.png" },
      options: [{ text: "பூ", correct: true }, { text: "மா", correct: false }] }),
];

/* count a question's marks incl. sub-questions */
function questionMarks(q) { return (q.children && q.children.length) ? q.children.reduce((a, c) => a + (c.marks || 0), 0) : (q.marks || 0); }

/* distinct filter option lists, derived from the bank (top-level questions only) */
function questionFilterOptions(key) { return Array.from(new Set(QUESTIONS.flatMap(q => Array.isArray(q[key]) ? q[key] : [q[key]]).filter(Boolean))).sort(); }
const LANGUAGES = ["English", "Tamil"];

/* per-subject diagnostic configs — selected questions + score→level placement bands.
   Bands depend on subject level ceiling (Maths 5, English/Tamil 3). */
function defaultBands(subject) {
  const max = (window.SUBJECT_LEVELS && window.SUBJECT_LEVELS[subject]) || 3;
  if (max >= 5) return [
    { min: 0, max: 30, level: "Level 1" }, { min: 31, max: 50, level: "Level 2" },
    { min: 51, max: 70, level: "Level 3" }, { min: 71, max: 85, level: "Level 4" }, { min: 86, max: 100, level: "Level 5" },
  ];
  return [
    { min: 0, max: 40, level: "Level 1" }, { min: 41, max: 70, level: "Level 2" }, { min: 71, max: 100, level: "Level 3" },
  ];
}

Object.assign(window, {
  QUESTION_TYPES, QTYPE_BY_ID, USAGE_TYPES, USAGE_BY_ID, DIFF_COLOR, QUESTIONS, questionMarks, defaultBands,
  questionFilterOptions, LANGUAGES,
});
