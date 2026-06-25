/* data.jsx — mock content data for the Content Studio */

const SUBJECTS = {
  Maths:   { key: "Maths",   cls: "subj-maths",   color: "var(--maths)" },
  English: { key: "English", cls: "subj-english", color: "var(--english)" },
  Tamil:   { key: "Tamil",   cls: "subj-tamil",   color: "var(--tamil)" },
};

/* 14 game types from the spec */
const GAME_TYPES = [
  { n: "01", id: "dragdrop",  name: "Drag & Drop / Fill",        subjects: ["Maths","English","Tamil"], ages: "6–11", levels: "All",   mech: "Drag objects into target zones",         icon: "GgDragDrop" },
  { n: "02", id: "tapspeak",  name: "Tap and Speak",             subjects: ["English","Tamil"],         ages: "6–11", levels: "All",   mech: "Tap image, record spoken word",         icon: "GgTapSpeak" },
  { n: "03", id: "spotit",    name: "Spot It",                   subjects: ["Maths","English","Tamil"], ages: "6–11", levels: "All",   mech: "Tap all matching items in grid",        icon: "GgSpotIt" },
  { n: "04", id: "match",     name: "Match the Following",       subjects: ["Maths","English"],         ages: "6–10", levels: "L1–L3", mech: "Draw lines between pairs",               icon: "GgMatch" },
  { n: "05", id: "trace",     name: "Trace It",                  subjects: ["Maths","English","Tamil"], ages: "6–9",  levels: "L1–L2", mech: "Finger-trace dotted paths",             icon: "GgTrace" },
  { n: "06", id: "balloon",   name: "Pop the Balloon",           subjects: ["Maths"],                   ages: "6–8",  levels: "L1",    mech: "Pop exact count of balloons",           icon: "GgBalloon" },
  { n: "07", id: "numline",   name: "Number Line",               subjects: ["Maths"],                   ages: "6–11", levels: "All",   mech: "Drag numbers into sequence slots",      icon: "GgNumberLine" },
  { n: "08", id: "signdrop",  name: "Sign Drop",                 subjects: ["Maths"],                   ages: "8–11", levels: "L3–L5", mech: "Drag >, <, = between numbers",          icon: "GgSignDrop" },
  { n: "09", id: "bottle",    name: "Fill the Bottle / Sort It", subjects: ["English","Tamil"],         ages: "7–11", levels: "L2–L3", mech: "Sort words into category jars",         icon: "GgBottle" },
  { n: "10", id: "letters",   name: "Reorder Jumbled Letters",   subjects: ["English"],                 ages: "9–11", levels: "L3",    mech: "Unscramble letters to spell word",      icon: "GgLetters" },
  { n: "11", id: "sentence",  name: "Reorder Jumbled Sentence",  subjects: ["English","Tamil"],         ages: "7–11", levels: "L2–L3", mech: "Arrange word cards into sentence",       icon: "GgSentence" },
  { n: "12", id: "fillblank", name: "Drag & Drop — Fill Blank",  subjects: ["English","Tamil"],         ages: "7–11", levels: "L2–L3", mech: "Drag missing word into sentence",        icon: "GgFillBlank" },
  { n: "13", id: "blending",  name: "Blending Game",             subjects: ["Tamil"],                   ages: "6–10", levels: "L1–L2", mech: "Blend phonemes, match to image",        icon: "GgBlending" },
  { n: "14", id: "crossword", name: "Crossword / Syn-Antonyms",  subjects: ["Tamil"],                   ages: "9–11", levels: "L3",    mech: "Identify synonyms / antonyms",          icon: "GgCrossword" },
];
const TYPE_BY_ID = Object.fromEntries(GAME_TYPES.map(t => [t.id, t]));

/* ============================================================================
   GAME VARIANTS — scalable authoring schema
   Every game TYPE can expose multiple VARIANTS and a set of INTERACTION SIZES.
   A variant declares the input FIELDS the authoring form must render, so the
   builder is fully data-driven: adding a new type/variant here requires NO code
   changes in game-builder.jsx. Field `kind` drives the editor affordance.
   kinds: image | text | number | audio | bool | choice(+opts)
   ========================================================================== */
const F = (k, label, kind, opts) => ({ k, label, kind, opts }); // field helper

const GAME_VARIANTS = {
  dragdrop: { unit: "pairs", sizes: [2,3,4,5,6], defaultSize: 4, variants: [
    { id: "img-img", name: "Image → Image", desc: "Drag an image onto a matching image", fields: [F("src","Draggable image","image"), F("tgt","Target image","image"), F("dist","Distractors","number")] },
    { id: "img-txt", name: "Image → Text",  desc: "Drag an image onto a text label",     fields: [F("src","Draggable image","image"), F("tgt","Target label","text"),  F("dist","Distractors","number")] },
    { id: "txt-txt", name: "Text → Text",   desc: "Drag a word onto a matching word",     fields: [F("src","Draggable word","text"),  F("tgt","Target word","text"),   F("dist","Distractors","number")] },
    { id: "num-num", name: "Number → Number",desc: "Drag a numeral onto its match",       fields: [F("src","Draggable number","number"),F("tgt","Target number","number"),F("dist","Distractors","number")] },
    { id: "aud-txt", name: "Audio → Text",  desc: "Play audio, drag onto the right word", fields: [F("src","Prompt audio","audio"),   F("tgt","Answer text","text"),   F("dist","Distractors","number")] },
    { id: "aud-img", name: "Audio → Image", desc: "Play audio, drag onto the right image",fields: [F("src","Prompt audio","audio"),   F("tgt","Answer image","image"), F("dist","Distractors","number")] },
  ]},
  tapspeak: { unit: "prompts", sizes: [3,4,5,6], defaultSize: 4, variants: [
    { id: "img-say",    name: "Image → Speak",     desc: "See an image, say the word",   fields: [F("img","Image","image"), F("word","Expected word","text"), F("tol","Tolerance","choice",["Lenient","Standard","Strict"])] },
    { id: "txt-read",   name: "Text → Read aloud", desc: "Read the shown text aloud",    fields: [F("txt","Text prompt","text"), F("word","Expected reading","text"), F("tol","Tolerance","choice",["Lenient","Standard","Strict"])] },
    { id: "letter-snd", name: "Letter → Sound",    desc: "Say the letter's sound",       fields: [F("ltr","Letter","text"), F("snd","Expected sound","audio"), F("tol","Tolerance","choice",["Lenient","Standard","Strict"])] },
  ]},
  spotit: { unit: "grid items", sizes: [4,6,9,12], defaultSize: 6, variants: [
    { id: "by-image",  name: "Spot by Image",  desc: "Tap every matching picture", fields: [F("item","Image","image"),  F("tgt","Is target?","bool"), F("aud","Audio prompt","audio")] },
    { id: "by-letter", name: "Spot by Letter", desc: "Tap every matching letter",  fields: [F("item","Letter","text"),  F("tgt","Is target?","bool"), F("aud","Audio prompt","audio")] },
    { id: "by-number", name: "Spot by Number", desc: "Tap every matching numeral", fields: [F("item","Number","number"),F("tgt","Is target?","bool"), F("aud","Audio prompt","audio")] },
    { id: "by-word",   name: "Spot by Word",   desc: "Tap every matching word",    fields: [F("item","Word","text"),    F("tgt","Is target?","bool"), F("aud","Audio prompt","audio")] },
  ]},
  match: { unit: "pairs", sizes: [2,3,4,5], defaultSize: 4, variants: [
    { id: "img-txt", name: "Image ↔ Text",      desc: "Connect images to labels",        fields: [F("l","Left — image","image"), F("r","Right — text","text")] },
    { id: "txt-txt", name: "Text ↔ Text",       desc: "Connect related words",           fields: [F("l","Left — text","text"),   F("r","Right — text","text")] },
    { id: "img-img", name: "Image ↔ Image",     desc: "Connect related pictures",        fields: [F("l","Left — image","image"), F("r","Right — image","image")] },
    { id: "num-qty", name: "Number ↔ Quantity", desc: "Connect numeral to a quantity",   fields: [F("l","Left — number","number"),F("r","Right — quantity","image")] },
    { id: "aud-img", name: "Audio ↔ Image",     desc: "Connect a sound to a picture",    fields: [F("l","Left — audio","audio"), F("r","Right — image","image")] },
  ]},
  trace: { unit: "strokes", sizes: [1,2,3,4], defaultSize: 2, variants: [
    { id: "letter", name: "Trace Letter", desc: "Finger-trace a letter", fields: [F("g","Letter","text"),   F("guide","Guide style","choice",["Dotted","Arrows","Ghost"]), F("aud","Audio","audio")] },
    { id: "number", name: "Trace Number", desc: "Finger-trace a numeral",fields: [F("g","Number","number"), F("guide","Guide style","choice",["Dotted","Arrows","Ghost"]), F("aud","Audio","audio")] },
    { id: "shape",  name: "Trace Shape",  desc: "Finger-trace a shape",  fields: [F("g","Shape","image"),   F("guide","Guide style","choice",["Dotted","Arrows","Ghost"]), F("aud","Audio","audio")] },
    { id: "word",   name: "Trace Word",   desc: "Finger-trace a word",   fields: [F("g","Word","text"),     F("guide","Guide style","choice",["Dotted","Arrows","Ghost"]), F("aud","Audio","audio")] },
  ]},
  balloon: { unit: "rounds", sizes: [3,4,5], defaultSize: 3, variants: [
    { id: "count",   name: "Count to Number", desc: "Pop the exact count",      fields: [F("tgt","Target count","number"), F("total","Total balloons","number"), F("spd","Float speed","choice",["Slow","Medium","Fast"])] },
    { id: "numeral", name: "Pop the Numeral", desc: "Pop balloons with numeral",fields: [F("tgt","Target numeral","number"),F("total","Total balloons","number"), F("spd","Float speed","choice",["Slow","Medium","Fast"])] },
    { id: "color",   name: "Pop by Color",    desc: "Pop balloons of a color",  fields: [F("tgt","Target color","text"),   F("total","Total balloons","number"), F("spd","Float speed","choice",["Slow","Medium","Fast"])] },
    { id: "letter",  name: "Pop the Letter",  desc: "Pop balloons with letter", fields: [F("tgt","Target letter","text"),   F("total","Total balloons","number"), F("spd","Float speed","choice",["Slow","Medium","Fast"])] },
  ]},
  numline: { unit: "blanks", sizes: [1,2,3], defaultSize: 1, variants: [
    { id: "missing", name: "Fill Missing",     desc: "Drop numbers into blanks",   fields: [F("seq","Sequence (use _)","text"), F("blk","Blank slots","number"), F("pool","Number pool","text")] },
    { id: "skip",    name: "Skip Count",       desc: "Continue a skip pattern",    fields: [F("start","Start","number"), F("step","Step","number"), F("blk","Blank slots","number")] },
    { id: "place",   name: "Place the Number", desc: "Place a value on the line",  fields: [F("val","Value","number"), F("min","Range min","number"), F("max","Range max","number")] },
    { id: "compare", name: "Compare on Line",  desc: "Locate two values & compare",fields: [F("a","Value A","number"), F("b","Value B","number"), F("pool","Number pool","text")] },
  ]},
  signdrop: { unit: "rounds", sizes: [3,4,5], defaultSize: 4, variants: [
    { id: "glt",     name: "Greater / Less / Equal", desc: "Drop >, <, = between numbers", fields: [F("l","Left number","number"), F("r","Right number","number"), F("ans","Correct sign","choice",[">","<","="])] },
    { id: "balance", name: "Balance Equation",       desc: "Compare two expressions",      fields: [F("l","Left expression","text"), F("r","Right expression","text"), F("ans","Correct sign","choice",[">","<","="])] },
  ]},
  bottle: { unit: "items", sizes: [6,8,10], defaultSize: 8, variants: [
    { id: "sort2", name: "Sort — 2 Categories", desc: "Sort items into two jars",  fields: [F("item","Item","text"), F("cat","Category","choice",["A","B"]), F("aud","Audio","audio")] },
    { id: "sort3", name: "Sort — 3 Categories", desc: "Sort items into three jars",fields: [F("item","Item","text"), F("cat","Category","choice",["A","B","C"]), F("aud","Audio","audio")] },
    { id: "fill",  name: "Fill to Level",       desc: "Fill a bottle to a mark",   fields: [F("item","Item","text"), F("lvl","Target level","number"), F("aud","Audio","audio")] },
  ]},
  letters: { unit: "letters", sizes: [3,4,5,6], defaultSize: 4, variants: [
    { id: "from-image", name: "Spell from Image", desc: "Unscramble to name a picture", fields: [F("word","Target word","text"), F("hint","Hint image","image")] },
    { id: "from-audio", name: "Spell from Audio", desc: "Unscramble a spoken word",     fields: [F("word","Target word","text"), F("hint","Hint audio","audio")] },
    { id: "from-clue",  name: "Spell from Clue",  desc: "Unscramble from a definition",  fields: [F("word","Target word","text"), F("hint","Clue text","text")] },
  ]},
  sentence: { unit: "words", sizes: [3,4,5,6], defaultSize: 4, variants: [
    { id: "from-audio", name: "From Audio",       desc: "Order words to match a sentence read aloud", fields: [F("sen","Sentence","text"), F("prompt","Prompt audio","audio")] },
    { id: "from-image", name: "From Picture",     desc: "Order words to describe a picture",          fields: [F("sen","Sentence","text"), F("prompt","Prompt image","image")] },
    { id: "from-trans", name: "From Translation", desc: "Order words to translate a phrase",          fields: [F("sen","Sentence","text"), F("prompt","Prompt text","text")] },
  ]},
  fillblank: { unit: "options", sizes: [2,3,4], defaultSize: 3, variants: [
    { id: "single",   name: "Single Blank", desc: "One blank, drag the right word",  fields: [F("sen","Sentence (use _)","text"), F("ans","Answer","text"), F("dist","Distractors","number")] },
    { id: "double",   name: "Two Blanks",   desc: "Two blanks in one sentence",      fields: [F("sen","Sentence (use _)","text"), F("ans","Answers (comma)","text"), F("dist","Distractors","number")] },
    { id: "wordbank", name: "Word Bank",    desc: "Passage with a shared word bank", fields: [F("sen","Passage (use _)","text"), F("ans","Answers (comma)","text"), F("dist","Distractors","number")] },
  ]},
  blending: { unit: "parts", sizes: [2,3,4], defaultSize: 2, variants: [
    { id: "phoneme",  name: "Phoneme → Word", desc: "Blend phonemes into a word",   fields: [F("parts","Parts (comma)","text"), F("word","Target word","text"), F("img","Image","image")] },
    { id: "syllable", name: "Syllable → Word",desc: "Blend syllables into a word",  fields: [F("parts","Parts (comma)","text"), F("word","Target word","text"), F("img","Image","image")] },
    { id: "word-img", name: "Word → Image",   desc: "Blend & match to a picture",   fields: [F("word","Word","text"), F("img","Image","image"), F("aud","Audio","audio")] },
  ]},
  crossword: { unit: "pairs", sizes: [3,4,5], defaultSize: 4, variants: [
    { id: "synonyms", name: "Synonyms",        desc: "Tap the synonym",            fields: [F("word","Word","text"), F("ans","Synonym","text"), F("clue","Clue","text")] },
    { id: "antonyms", name: "Antonyms",        desc: "Tap the antonym",            fields: [F("word","Word","text"), F("ans","Antonym","text"), F("clue","Clue","text")] },
    { id: "clues",    name: "Crossword Clues", desc: "Solve clues into a grid",    fields: [F("ans","Answer","text"), F("clue","Clue","text"), F("dir","Direction","choice",["Across","Down"])] },
  ]},
};

/* resolve a type's variant spec, with a safe generic fallback for new types */
function variantSpec(typeId) {
  return GAME_VARIANTS[typeId] || { unit: "items", sizes: [3,4,5,6], defaultSize: 4, variants: [
    { id: "standard", name: "Standard", desc: "Single template", fields: [F("item","Content item","text"), F("ans","Answer / target","text"), F("opts","Options","text")] },
  ]};
}

/* Levels per subject — Maths runs 1–5, English & Tamil run 1–3 (see spec C2).
   "Level" replaces the older "Grade" terminology across the platform. */
const SUBJECT_LEVELS = { Maths: 5, English: 3, Tamil: 3 };
function levelsForSubject(subject) { return Array.from({ length: SUBJECT_LEVELS[subject] || 3 }, (_, i) => "Level " + (i + 1)); }

/* Content-level difficulty terminology — L1/L2/L3 are surfaced as Easy/Medium/Hard. */
const DIFFICULTY = ["Easy", "Medium", "Hard", "Harder", "Hardest"];
/* a game spanning N content levels covers Easy → DIFFICULTY[N-1] */
function difficultySpan(n) { return n <= 1 ? "Easy" : "Easy – " + DIFFICULTY[Math.min(n, DIFFICULTY.length) - 1]; }

/* Repository games — `level` is the subject-specific learner Level (was "grade"),
   `lo` = learning outcome, `lesson` = where it sits in the lesson flow, `tags` = metadata. */
const GAMES = [
  { id: "g1",  name: "Count the Mangoes",     type: "dragdrop",  subject: "Maths",   level: "Level 1", levels: 3, items: 34, uses: 12, status: "pub",    author: "Priya R.",  updated: "2d ago",  plays: 4820, avgLevel: 2.3, lo: "Count objects up to 20 and match them to numerals", lesson: "Numbers 1–20 · Lesson 2", tags: ["Counting","Number recognition"] },
  { id: "g2",  name: "Say the Animal",        type: "tapspeak",  subject: "English", level: "Level 2", levels: 3, items: 28, uses: 9,  status: "pub",    author: "Anand K.",  updated: "5d ago",  plays: 3110, avgLevel: 1.9, lo: "Name common animals aloud with correct pronunciation", lesson: "Naming Animals · Lesson 1", tags: ["Vocabulary","Speaking"] },
  { id: "g3",  name: "Spot the Vowels",       type: "spotit",    subject: "English", level: "Level 2", levels: 3, items: 40, uses: 7,  status: "pub",    author: "Priya R.",  updated: "1w ago",  plays: 2740, avgLevel: 2.1, lo: "Identify vowels within familiar words", lesson: "Phonics · Lesson 3", tags: ["Phonics","Letter recognition"] },
  { id: "g4",  name: "Shapes & Numerals",     type: "match",     subject: "Maths",   level: "Level 1", levels: 3, items: 22, uses: 5,  status: "review", author: "Meera S.",  updated: "3h ago",  plays: 0,    avgLevel: 0,   lo: "Match basic shapes and numerals to their names", lesson: "Shapes & Numbers · Lesson 1", tags: ["Shapes","Number recognition"] },
  { id: "g5",  name: "Trace Tamil Uyir",      type: "trace",     subject: "Tamil",   level: "Level 1", levels: 2, items: 12, uses: 4,  status: "pub",    author: "Karthik V.",updated: "2w ago",  plays: 1890, avgLevel: 1.5, lo: "Trace and form Tamil uyir letters", lesson: "Uyir Eluthukkal · Lesson 2", tags: ["Handwriting","Letter formation"] },
  { id: "g6",  name: "Balloon Pop 1–5",       type: "balloon",   subject: "Maths",   level: "Level 1", levels: 1, items: 10, uses: 14, status: "pub",    author: "Priya R.",  updated: "4d ago",  plays: 6230, avgLevel: 1.0, lo: "Count quantities from 1 to 5", lesson: "Counting Play · Lesson 1", tags: ["Counting","Cardinality"] },
  { id: "g7",  name: "Skip Count by 2s",      type: "numline",   subject: "Maths",   level: "Level 3", levels: 3, items: 26, uses: 6,  status: "draft",  author: "Anand K.",  updated: "1h ago",  plays: 0,    avgLevel: 0,   lo: "Skip count by 2s along a number line", lesson: "Number Patterns · Lesson 2", tags: ["Skip counting","Number line"] },
  { id: "g8",  name: "Greater or Less",       type: "signdrop",  subject: "Maths",   level: "Level 4", levels: 3, items: 30, uses: 8,  status: "pub",    author: "Meera S.",  updated: "6d ago",  plays: 2050, avgLevel: 3.8, lo: "Compare numbers using >, < and =", lesson: "Comparing Numbers · Lesson 3", tags: ["Comparing","Place value"] },
  { id: "g9",  name: "Sort: Fruits & Veg",    type: "bottle",    subject: "English", level: "Level 3", levels: 2, items: 18, uses: 5,  status: "pub",    author: "Priya R.",  updated: "1w ago",  plays: 1670, avgLevel: 2.4, lo: "Classify words into the correct category", lesson: "Sorting Words · Lesson 2", tags: ["Classification","Vocabulary"] },
  { id: "g10", name: "Unscramble Animals",    type: "letters",   subject: "English", level: "Level 3", levels: 3, items: 24, uses: 3,  status: "review", author: "Anand K.",  updated: "5h ago",  plays: 0,    avgLevel: 0,   lo: "Spell animal names by reordering letters", lesson: "Spelling · Lesson 4", tags: ["Spelling","Vocabulary"] },
  { id: "g11", name: "Build the Sentence",    type: "sentence",  subject: "Tamil",   level: "Level 3", levels: 2, items: 20, uses: 6,  status: "pub",    author: "Karthik V.",updated: "3d ago",  plays: 1420, avgLevel: 2.2, lo: "Arrange words into a grammatical sentence", lesson: "Sentence Building · Lesson 3", tags: ["Grammar","Sentence structure"] },
  { id: "g12", name: "Fill the Missing Word", type: "fillblank", subject: "English", level: "Level 3", levels: 2, items: 16, uses: 7,  status: "pub",    author: "Meera S.",  updated: "1w ago",  plays: 2380, avgLevel: 2.5, lo: "Complete sentences with the correct word", lesson: "Comprehension · Lesson 2", tags: ["Comprehension","Vocabulary"] },
  { id: "g13", name: "Tamil Phoneme Blend",   type: "blending",  subject: "Tamil",   level: "Level 1", levels: 2, items: 14, uses: 4,  status: "pub",    author: "Karthik V.",updated: "2w ago",  plays: 980,  avgLevel: 1.6, lo: "Blend phonemes to read Tamil words", lesson: "Blending · Lesson 1", tags: ["Phonics","Blending"] },
  { id: "g14", name: "Synonym Hunt",          type: "crossword", subject: "Tamil",   level: "Level 3", levels: 1, items: 12, uses: 2,  status: "draft",  author: "Karthik V.",updated: "30m ago", plays: 0,    avgLevel: 0,   lo: "Identify synonyms and antonyms", lesson: "Word Meanings · Lesson 4", tags: ["Vocabulary","Synonyms"] },
  { id: "g15", name: "Place Value Baskets",   type: "dragdrop",  subject: "Maths",   level: "Level 3", levels: 3, items: 32, uses: 10, status: "pub",    author: "Priya R.",  updated: "5d ago",  plays: 3540, avgLevel: 2.7, lo: "Group numbers into tens and ones", lesson: "Place Value · Lesson 2", tags: ["Place value","Grouping"] },
  { id: "g16", name: "Number Line to 20",     type: "numline",   subject: "Maths",   level: "Level 2", levels: 3, items: 28, uses: 9,  status: "pub",    author: "Anand K.",  updated: "1w ago",  plays: 2900, avgLevel: 2.0, lo: "Locate and order numbers up to 20", lesson: "Number Line · Lesson 1", tags: ["Number line","Ordering"] },
];

/* Content blocks available in the module builder palette */
const BLOCK_TYPES = [
  { id: "video",  name: "Video",    icon: "IcVideo",   color: "var(--maths)",   desc: "Upload or embed a lesson clip" },
  { id: "game",   name: "Game",     icon: "IcGame",    color: "var(--pri)",     desc: "Pull an adaptive game from the repository" },
  { id: "quiz",   name: "Quiz",     icon: "IcQuiz",    color: "var(--english)", desc: "MCQ, T/F, fill-in, ordering & more" },
  { id: "reading",name: "Reading",  icon: "IcReading", color: "var(--tamil)",   desc: "Rich-text passage with images" },
  { id: "audio",  name: "Audio",    icon: "IcAudio",   color: "var(--st-sched)",desc: "Narration or listening exercise" },
  { id: "doc",    name: "Document", icon: "IcDoc",     color: "var(--ink-3)",   desc: "PDF or worksheet attachment" },
];
const BLOCK_BY_ID = Object.fromEntries(BLOCK_TYPES.map(b => [b.id, b]));

/* A starter module canvas (blocks placed in sequence) */
const STARTER_BLOCKS = [
  { uid: "b1", type: "video", title: "Intro: What is a Number?", mins: 4, meta: "Watch 80% · captions on" },
  { uid: "b2", type: "game",  title: "Count the Mangoes",         mins: 6, meta: "Adaptive · starts L1", gameId: "g1" },
  { uid: "b3", type: "quiz",  title: "Quick Check",               mins: 3, meta: "5 questions · 1 attempt" },
  { uid: "b4", type: "game",  title: "Balloon Pop 1–5",           mins: 5, meta: "Adaptive · starts L1", gameId: "g6" },
];

/* Lesson modules list */
const MODULES = [
  { id: "m1", title: "Numbers 1 to 10", subject: "Maths", grade: "Level 1", blocks: 4, mins: 22, status: "draft",   updated: "1h ago", author: "Priya R." },
  { id: "m2", title: "Naming Animals",  subject: "English",grade: "Level 2", blocks: 5, mins: 24, status: "review",  updated: "3h ago", author: "Anand K." },
  { id: "m3", title: "Uyir Eluthukkal", subject: "Tamil",  grade: "Level 1", blocks: 4, mins: 21, status: "pub",     updated: "2d ago", author: "Karthik V." },
  { id: "m4", title: "Place Value",     subject: "Maths",  grade: "Level 3", blocks: 6, mins: 25, status: "approve", updated: "1d ago", author: "Meera S." },
  { id: "m5", title: "Sentence Basics", subject: "English",grade: "Level 3", blocks: 5, mins: 23, status: "revise",  updated: "4h ago", author: "Anand K." },
];

/* Learning journeys
   Flow: every student first takes the Level Diagnostic Assessment; their result
   places them on a level and the matching per-subject Level journey is triggered.
   Maths runs 5 levels; English & Tamil run 3 levels each. */
const JOURNEYS = [
  {
    id: "j0", name: "Level Diagnostic Assessment", subject: null, diagnostic: true,
    grade: "Placement", mode: "Adaptive", modules: 1, weeks: 1, status: "pub", mastery: 0, stages: [],
  },

  /* Maths — Level 1 to Level 5 */
  {
    id: "j1", name: "Early Numeracy Foundations", subject: "Maths", grade: "Level 1",
    mode: "Linear", modules: 9, weeks: 6, status: "pub", mastery: 80,
    stages: [
      { name: "Counting & Cardinality", modules: ["Numbers 1 to 10","Numbers 11 to 20","Compare Quantities"], qualifier: 70 },
      { name: "Number Operations",      modules: ["Add within 10","Subtract within 10","Number Line Play"],    qualifier: 70 },
      { name: "Place Value",            modules: ["Tens & Ones","Place Value","Bundle & Count"],               qualifier: 75 },
    ],
  },
  { id: "jm2", name: "Operations & Number Sense",  subject: "Maths", grade: "Level 2", mode: "Linear", modules: 8, weeks: 6, status: "pub",    mastery: 80, stages: [] },
  { id: "jm3", name: "Place Value & Measurement",  subject: "Maths", grade: "Level 3", mode: "Linear", modules: 8, weeks: 6, status: "review", mastery: 80, stages: [] },
  { id: "jm4", name: "Multiplication & Division",  subject: "Maths", grade: "Level 4", mode: "Linear", modules: 9, weeks: 7, status: "draft",  mastery: 80, stages: [] },
  { id: "jm5", name: "Fractions & Problem Solving",subject: "Maths", grade: "Level 5", mode: "Linear", modules: 9, weeks: 7, status: "draft",  mastery: 85, stages: [] },

  /* English — Level 1 to Level 3 */
  { id: "j2",  name: "Phonics & First Words",      subject: "English", grade: "Level 1", mode: "Flexible", modules: 7, weeks: 5, status: "review", mastery: 75, stages: [] },
  { id: "je2", name: "Sentences & Comprehension",  subject: "English", grade: "Level 2", mode: "Flexible", modules: 8, weeks: 6, status: "draft",  mastery: 75, stages: [] },
  { id: "je3", name: "Reading Fluency & Writing",  subject: "English", grade: "Level 3", mode: "Flexible", modules: 8, weeks: 6, status: "draft",  mastery: 80, stages: [] },

  /* Tamil — Level 1 to Level 3 */
  { id: "j3",  name: "Tamil Reading Readiness",    subject: "Tamil", grade: "Level 1", mode: "Linear", modules: 8, weeks: 6, status: "draft", mastery: 80, stages: [] },
  { id: "jt2", name: "Words & Sentences",          subject: "Tamil", grade: "Level 2", mode: "Linear", modules: 8, weeks: 6, status: "draft", mastery: 80, stages: [] },
  { id: "jt3", name: "Reading & Composition",      subject: "Tamil", grade: "Level 3", mode: "Linear", modules: 8, weeks: 6, status: "draft", mastery: 80, stages: [] },
];

/* Activation workflow items */
const WORKFLOW = {
  draft:   [ { id:"w1", title:"Skip Count by 2s", kind:"Game",    subject:"Maths",   author:"Anand K.",   updated:"1h ago" },
             { id:"w2", title:"Synonym Hunt",      kind:"Game",    subject:"Tamil",   author:"Karthik V.", updated:"30m ago" } ],
  submit:  [ { id:"w3", title:"Naming Animals",    kind:"Module",  subject:"English", author:"Anand K.",   updated:"3h ago" } ],
  review:  [ { id:"w4", title:"Shapes & Numerals", kind:"Game",    subject:"Maths",   author:"Meera S.",   updated:"3h ago", reviewer:"Program Team" },
             { id:"w5", title:"Unscramble Animals",kind:"Game",    subject:"English", author:"Anand K.",   updated:"5h ago", reviewer:"Program Team" } ],
  revise:  [ { id:"w6", title:"Sentence Basics",   kind:"Module",  subject:"English", author:"Anand K.",   updated:"4h ago", note:"Add audio to options on L2" } ],
  approve: [ { id:"w7", title:"Place Value",       kind:"Module",  subject:"Maths",   author:"Meera S.",   updated:"1d ago" } ],
  sched:   [ { id:"w8", title:"Early Numeracy Foundations", kind:"Journey", subject:"Maths", author:"Priya R.", updated:"2d ago", date:"Jun 3" } ],
  pub:     [ { id:"w9", title:"Numbers 1 to 10",   kind:"Module",  subject:"Maths",   author:"Priya R.",   updated:"2d ago" },
             { id:"w10",title:"Uyir Eluthukkal",   kind:"Module",  subject:"Tamil",   author:"Karthik V.", updated:"3d ago" } ],
};

const WF_COLS = [
  { key:"draft",  label:"Draft",           cls:"s-draft" },
  { key:"submit", label:"Submitted",       cls:"s-submit" },
  { key:"review", label:"In Review",       cls:"s-review" },
  { key:"revise", label:"Revision Needed", cls:"s-revise" },
  { key:"approve",label:"Approved",        cls:"s-approve" },
  { key:"sched",  label:"Scheduled",       cls:"s-sched" },
  { key:"pub",    label:"Published",       cls:"s-pub" },
];

const STATUS_LABEL = { draft:"Draft", submit:"Submitted", review:"In Review", revise:"Revision", approve:"Approved", sched:"Scheduled", pub:"Published" };
const STATUS_CLS   = { draft:"s-draft", submit:"s-submit", review:"s-review", revise:"s-revise", approve:"s-approve", sched:"s-sched", pub:"s-pub" };

Object.assign(window, {
  SUBJECTS, GAME_TYPES, TYPE_BY_ID, GAME_VARIANTS, variantSpec, GAMES, BLOCK_TYPES, BLOCK_BY_ID, STARTER_BLOCKS,
  MODULES, JOURNEYS, WORKFLOW, WF_COLS, STATUS_LABEL, STATUS_CLS,
  SUBJECT_LEVELS, levelsForSubject, DIFFICULTY, difficultySpan,
});
