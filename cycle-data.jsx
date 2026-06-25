/* cycle-data.jsx — real instructional-cycle skeletons transcribed from the research CSVs.
   Structure: SUBJECT → Level (grade) → Week (themed) → Session (S3 = Revision) →
   ordered blocks. Video/anchor blocks carry an anchor key; games carry a mechanic key.
   Every block: domain/strand + learning outcome + competency tags. */

/* --- competency frameworks --- */
const MATHS_FW = ["Number Recognition","Counting & Cardinality","Comparing","Ordering","Place value","Addition","Subtraction","Multiplication","Division"];
const LANG_FW = [
  { k: "L",  n: "Listening" }, { k: "LC", n: "Listening Comp." }, { k: "S", n: "Speaking" },
  { k: "R",  n: "Reading" },   { k: "Rc", n: "Reading Comp." },   { k: "W", n: "Writing" }, { k: "G", n: "Grammar" },
];

/* --- anchor (instructional / video) activity types --- */
const ANCHORS = {
  rhyme:  { name: "Rhyme Time",            icon: "IcVideo",   color: "var(--maths)" },
  story:  { name: "Story Time",            icon: "IcVideo",   color: "var(--english)" },
  letter: { name: "Letter–Sound",          icon: "IcAudio",   color: "var(--tamil)" },
  blend:  { name: "Blending",              icon: "IcAudio",   color: "var(--st-sched)" },
  write:  { name: "Let us Write",          icon: "IcEdit",    color: "var(--st-revise)" },
  read:   { name: "Read With Me",          icon: "IcReading", color: "var(--pri)" },
  learn:  { name: "Let us Learn",          icon: "IcVideo",   color: "var(--maths)" },
  arrange:{ name: "Arranging Numbers",     icon: "IcVideo",   color: "var(--st-sched)" },
  sight:  { name: "Sight Words",           icon: "IcReading", color: "var(--pri)" },
  recap:  { name: "Recap / Revision",      icon: "IcVideo",   color: "var(--ink-3)" },
};

/* --- game mechanics → glyph type (maps onto the 14-type catalog, + cycle variants) --- */
const MECH = {
  spotit:    { name: "Spot It",            type: "spotit" },
  dragdrop:  { name: "Drag & Drop",        type: "dragdrop" },
  dragfill:  { name: "Drag & Fill",        type: "dragdrop" },
  match:     { name: "Match It",           type: "match" },
  numline:   { name: "Number Line",        type: "numline" },
  trace:     { name: "Trace It",           type: "trace" },
  balloon:   { name: "Pop the Balloon",    type: "balloon" },
  signdrop:  { name: "Sign Drop",          type: "signdrop" },
  sortit:    { name: "Sort It",            type: "bottle" },
  bottle:    { name: "Fill the Bottle",    type: "bottle" },
  tapspeak:  { name: "Tap & Speak",        type: "tapspeak" },
  blending:  { name: "Blending Game",      type: "blending" },
  letters:   { name: "Reorder Letters",    type: "letters" },
  sentence:  { name: "Reorder Sentence",   type: "sentence" },
  crossword: { name: "Crossword / Syn-Ant",type: "crossword" },
  fillblank: { name: "Fill in the Blank",  type: "fillblank" },
  balance:   { name: "Balance",            type: "signdrop" },
  countfill: { name: "Count & Fill",       type: "dragdrop" },
  colorseeds:{ name: "Color the Seeds",    type: "spotit" },
  numbuilder:{ name: "Number Builder",     type: "dragdrop" },
  convert:   { name: "Convert First",      type: "dragdrop" },
  clue:      { name: "Clue Words",         type: "match" },
};

/* compact block builders */
const V = (a, title, d, lo, tags) => ({ t: "v", a, title, d: d || "", lo: lo || "", tags: tags || [] });
const G = (g, title, d, lo, tags) => ({ t: "g", g, title, d: d || "", lo: lo || "", tags: tags || [] });

/* ============================ MATHS ============================ */
const M_L1 = { level: "Level 1", grade: "Grade 1", weeks: [
  { week: "Week 1", theme: "Numbers 1–9", sessions: [
    { session: "Session 1", type: "Teaching", blocks: [
      V("rhyme","Introduction — Numbers 1 to 5","Number Recognition","Associate number names with concrete objects/quantities",["Number Recognition"]),
      G("spotit","Spot It — Spot 3","Number Recognition","Recognize & select written digits from audio cues",["Number Recognition"]),
      G("dragdrop","Drag & Drop — Count the objects","Counting & Cardinality","Count objects and link to the correct numeral",["Counting & Cardinality"]),
      V("story","Story Time — Chikku & Chinni (1–5)","Counting & Cardinality","Associate number names with concrete quantities",["Counting & Cardinality"]),
      G("balloon","Pop the Balloon","Counting & Cardinality","Associate spoken number names with concrete quantities",["Number Recognition","Counting & Cardinality"]),
      G("dragfill","Drag & Fill — Baskets of roses","Counting & Cardinality","Represent a given number using a collection of objects",["Counting & Cardinality"]),
      G("match","Match It — pictures ↔ numbers","Counting & Cardinality","One-to-one correspondence between pictures and numbers",["Counting & Cardinality"]),
      V("arrange","Missing Numbers — Arranging in order","Ordering","Sequence numbers and identify missing numbers",["Ordering"]),
      G("numline","Number Line — fish cards","Ordering","Sequence numbers and identify missing numbers in a series",["Ordering"]),
      V("write","Tracing — Explanation video","Number Formation","Show how to trace numbers, start & end points",["Number Recognition"]),
      G("trace","Trace It — numerals","Number Formation","Master correct formation & writing of numerals",["Number Recognition"]),
    ]},
    { session: "Session 2", type: "Teaching", blocks: [
      V("rhyme","Introduction — Numbers 6 to 9","Number Recognition","Associate number names with concrete objects/quantities",["Number Recognition"]),
      G("spotit","Spot It — Spot 7","Number Recognition","Recognize & select written digits from audio cues",["Number Recognition"]),
      G("dragdrop","Drag & Drop — Count the objects","Counting & Cardinality","Count objects and link to the correct numeral",["Counting & Cardinality"]),
      V("story","Story Time — Chikku & Chinnu (6–9)","Counting & Cardinality","Associate number names with concrete quantities",["Counting & Cardinality"]),
      G("balloon","Pop the Balloon","Counting & Cardinality","Associate spoken number names with quantities",["Number Recognition","Counting & Cardinality"]),
      G("dragfill","Drag & Fill — Baskets (6,7,9)","Counting & Cardinality","Represent a given number with objects",["Counting & Cardinality"]),
      G("match","Match It — pictures ↔ numbers","Counting & Cardinality","One-to-one correspondence",["Counting & Cardinality"]),
      V("arrange","Arranging the numbers — Missing Numbers","Ordering","Sequence numbers and identify missing numbers",["Comparing","Ordering"]),
      G("numline","Number Line — fish cards","Ordering","Identify missing numbers in a series",["Ordering"]),
      V("write","Tracing","Number Formation","How to trace numbers, start & end",[]),
      G("trace","Trace It — numerals","Number Formation","Master numeral formation",[]),
    ]},
    { session: "Session 3", type: "Revision", blocks: [
      V("recap","Revision video — Numbers 1 to 9","Number Recognition","Consolidate numbers 1–9",["Number Recognition"]),
      G("dragdrop","Drag & Drop","Mixed","Revision practice",[]),
      G("dragfill","Drag & Fill","Mixed","Revision practice",[]),
      G("match","Match It","Mixed","Revision practice",[]),
      G("numline","Number Line","Mixed","Revision practice",[]),
    ]},
  ]},
]};

const M_L2 = { level: "Level 2", grade: "Grade 2", weeks: [
  { week: "Week 1", theme: "Numbers to 50 · Tens & Ones", sessions: [
    { session: "Session 1", type: "Teaching", blocks: [
      V("rhyme","Introduction — Numbers 1 to 9","Number Recognition","Associate number names with quantities",["Number Recognition"]),
      G("spotit","Spot It — Spot 3","Number Recognition","Recognize digits from audio cues",["Number Recognition"]),
      G("dragdrop","Drag & Drop — Count","Counting & Cardinality","Count objects, link to numeral",["Counting & Cardinality"]),
      V("story","Story Time (1–9)","Counting & Cardinality","Associate names with quantities",["Counting & Cardinality"]),
      G("balloon","Pop the Balloon","Counting & Cardinality","Spoken names ↔ quantities",["Number Recognition","Counting & Cardinality"]),
      G("dragfill","Drag & Fill — Baskets","Counting & Cardinality","Represent number with objects",["Counting & Cardinality"]),
      G("match","Match It","Counting & Cardinality","One-to-one correspondence",[]),
      V("arrange","Arranging the numbers","Ordering","Identify missing numbers",["Ordering"]),
      G("numline","Number Line","Ordering","Missing numbers in a series",["Ordering"]),
      V("write","Tracing","Number Formation","How to trace numbers",[]),
      G("trace","Trace It","Number Formation","Numeral formation",[]),
    ]},
    { session: "Session 2", type: "Teaching", blocks: [
      V("rhyme","Introduction — Numbers 10 to 50 (bundles of ten)","Number Recognition","Identify & recite numbers; 10 sticks → 1 bundle",["Number Recognition"]),
      G("spotit","Spot It — Spot 13","Number Recognition","Recognize 2-digit numbers from audio",["Number Recognition"]),
      V("story","Story Time — Multiples of ten","Counting & Cardinality","Associate names with quantities",["Counting & Cardinality"]),
      G("dragdrop","Drag & Drop — Skip count tens","Place value","Skip-count in tens, find total value",["Counting & Cardinality"]),
      V("learn","Let us Learn — Explanation video","Place value","Count bundles as 10s and sticks as 1s",[]),
      G("dragdrop","Drag & Drop — Compose value","Place value","Count total: bundles (10s) + sticks (1s)",[]),
      G("dragfill","Drag & Fill — Decompose (26,37,49)","Place value","Fill baskets with ten-bundles & loose sticks",["Counting & Cardinality"]),
      G("match","Match It — bundles ↔ 2-digit number","Place value","Match bundle sets to numbers 10–50",["Counting & Cardinality"]),
      V("arrange","Arranging the numbers — Missing Numbers","Ordering","Sequence & find missing numbers",["Comparing","Ordering"]),
      G("numline","Number Line","Ordering","Missing numbers in a series",["Ordering"]),
    ]},
    { session: "Session 3", type: "Revision", blocks: [
      V("recap","Revision video — Numbers 21 to 50","Number Recognition","Consolidate 21–50",["Number Recognition"]),
      G("dragdrop","Drag & Drop","Mixed","Revision practice",[]),
      G("dragfill","Drag & Fill","Mixed","Revision practice",[]),
      G("match","Match It","Mixed","Revision practice",[]),
      G("numline","Number Line","Mixed","Revision practice",[]),
    ]},
  ]},
]};

const M_L3 = { level: "Level 3", grade: "Grade 3", weeks: [
  { week: "Week 1", theme: "Numbers 100–999 (H-T-O)", sessions: [
    { session: "Session 1", type: "Teaching", blocks: [
      V("rhyme","Introduction — Multiples of 100 (100–500)","Number Recognition","Connect quantity counts to 3-digit number names",["Number Recognition"]),
      G("spotit","Spot It — Spot 130","Number Recognition","Recognize 3-digit numbers from audio",["Number Recognition"]),
      V("story","Story Time — Number 100–500 (Zero Guard)","Place value","Conceptualize H-T-O & role of zero",["Ordering"]),
      G("dragdrop","Drag & Drop — Skip count hundreds","Place value","Skip-count in hundreds, total value",["Counting & Cardinality"]),
      V("learn","Let us Learn — Explanation video","Place value","Place value composition",[]),
      G("dragfill","Drag & Fill — Decompose (e.g. 452)","Place value","Hundreds/Tens/Ones baskets",["Ordering"]),
      G("match","Match It — bundles ↔ 3-digit number","Place value","Match bundle sets to numbers 100–500",["Counting & Cardinality"]),
      V("arrange","Arranging the numbers — Missing Numbers","Ordering","Sequence & find missing numbers",["Comparing","Ordering"]),
      G("numline","Number Line","Ordering","Missing numbers in a series",["Ordering"]),
    ]},
  ]},
  { week: "Week 2", theme: "Place Value & Comparison", sessions: [
    { session: "Session 1", type: "Teaching", blocks: [
      V("rhyme","Introduction","Place value","Introduce place-value week",[]),
      G("balance","Balance — drag to balance scale","Place value","Drag correct pouches/sacks to balance",["Place value"]),
      V("story","Story Time — Animated video","Place value","Place value in context",[]),
      G("numbuilder","Number Builder — Count, Pick, Drop","Place value","Form a 3-digit number from place values",["Place value"]),
      G("colorseeds","Color the Seeds","Place value","Color correct seeds per H-T-O position",["Place value"]),
      G("dragfill","Place Value Drag & Fill","Place value","Fill H/T/O to match target number",["Place value"]),
      V("learn","Let us Learn — Place value & Zero placeholder","Place value","Zero as placeholder",[]),
      G("dragdrop","Drag & Drop — identify total value","Place value","Match number card to filled trays",["Place value"]),
      G("dragfill","Drag & Fill — placeholder card","Place value","Use placeholder for empty place value",["Place value"]),
      V("learn","Comparison — Explanation video","Comparing","Compare numbers by place value",[]),
      G("signdrop","Sign Drop — >, <, =","Comparing","Drop correct comparison symbol",["Comparing"]),
    ]},
  ]},
  { week: "Week 3", theme: "Addition", sessions: [
    { session: "Session 1", type: "Teaching", blocks: [
      V("rhyme","Introduction","Addition","Introduce addition week",[]),
      G("dragdrop","Drag & Drop — total across place values","Addition","Count total value, drag 3-digit number",["Addition"]),
      V("story","Story Time — Addition","Addition","Addition in context",[]),
      G("countfill","Count & Fill — Type 1 (no regrouping)","Addition","Add without regrouping",["Addition"]),
      G("countfill","Count & Fill — Type 2 (with regrouping)","Addition","Add with regrouping",["Addition"]),
      V("learn","Let us Learn — Placeholder Zero","Addition","Addressing placeholder zero",[]),
      G("convert","Convert First — 10 ones → 1 ten","Addition","Regroup ones into a ten",["Addition"]),
      V("learn","Solve It — Addition using numbers","Addition","Add using numerals",[]),
      G("countfill","Count & Fill (no regrouping)","Addition","Add without regrouping",["Addition"]),
      G("countfill","Count & Fill (with regrouping)","Addition","Add with regrouping",["Addition"]),
    ]},
  ]},
]};

const M_L4 = { level: "Level 4", grade: "Grade 4", weeks: [
  { week: "Week 1", theme: "4-digit Numbers (Th-H-T-O)", sessions: [
    { session: "Session 1", type: "Teaching", blocks: [
      V("rhyme","Introduction — 100, 1000, 9999","Place value","Connect counts to 4-digit number names",["Number Recognition"]),
      G("dragdrop","Drag & Drop — thousand bundles","Place value","Regroup units to represent larger number",["Place value"]),
      V("story","Story Time — 1000 to 5000 (Zero Guard)","Place value","Conceptualize Th-H-T-O & zero",["Place value"]),
      G("dragfill","Drag & Fill — Expansion (4562)","Place value","Represent each digit's value",["Place value"]),
      G("match","Match It — 4-digit representation","Place value","Translate quantities to numbers",["Place value"]),
      V("learn","Comparison — Explanation video","Comparing","Compare 4-digit values by place",[]),
      G("balloon","Pop the Balloon — discriminate (3013 vs 3031)","Comparing","Distinguish similar-looking numbers from audio",["Number Recognition","Comparing"]),
      G("signdrop","Sign Drop — compare 4-digit","Comparing","Compare with >, <, =",["Comparing","Ordering"]),
      V("arrange","Arrange the numbers — Explanation","Ordering","Order 4-digit numbers",[]),
      G("numline","Number Line — missing numbers","Ordering","Identify missing numbers",["Ordering"]),
      G("numline","Number Line — order smallest→largest","Ordering","Order 4-digit numbers",["Ordering"]),
    ]},
  ]},
]};

const M_L5 = { level: "Level 5", grade: "Grade 5", weeks: [
  { week: "Week 1", theme: "5-digit Numbers (up to 1,00,000)", sessions: [
    { session: "Session 1", type: "Teaching", blocks: [
      V("rhyme","Introduction — 10,000 to 1,00,000","Place value","Connect counts to 5-digit names",["Number Recognition"]),
      G("dragdrop","Drag & Drop — ten-thousand bundles","Place value","Regroup to represent larger number",["Place value"]),
      V("story","Story Time — 10,000 to 50,000","Place value","Conceptualize L-TTh-Th-H-T-O & zero",["Place value"]),
      G("dragfill","Drag & Fill — Expansion (14,562)","Place value","Represent each digit's value",["Place value"]),
      G("match","Match It — 5-digit representation","Place value","Translate quantities to numbers",["Place value"]),
      V("learn","Comparison — Explanation video","Comparing","Compare 5-digit values by place",[]),
      G("balloon","Pop the Balloon — discriminate (33,013 vs 33,103)","Comparing","Distinguish similar numbers from audio",["Comparing"]),
      G("signdrop","Sign Drop — compare 5-digit","Comparing","Compare with >, <, =",["Comparing","Ordering"]),
      V("arrange","Arrange the numbers","Ordering","Order 5-digit numbers",[]),
      G("numline","Number Line — missing numbers","Ordering","Identify missing numbers",["Ordering"]),
      G("numline","Number Line — order by value","Ordering","Order 5-digit numbers",["Ordering"]),
    ]},
  ]},
]};

/* ============================ ENGLISH ============================ */
const EN_L1 = { level: "Level 1", grade: "Grade 1/2", weeks: [
  { week: "Week 1", theme: "Focus Words · Letter Sounds", sessions: [
    { session: "Session 1", type: "Teaching", blocks: [
      V("rhyme","Introduction to Focus Words + Rhyme Time","Vocabulary","Name core objects from everyday themes",["L","S"]),
      G("dragdrop","Drag & Drop — match picture to word","Vocabulary","Identify picture matching a focus word",["L"]),
      G("spotit","Spot It — find all the ___","Vocabulary","Identify pictures matching a focus word",["L"]),
      G("trace","Trace It — theme picture","Pre-writing","Associate visual forms with vocabulary",["W"]),
      V("story","Animated Story Time","Comprehension","Follow a story sequence; main idea",["LC"]),
      G("dragdrop","Drag & Drop — pause-point questions","Comprehension","Recall key details at pause points",["LC"]),
      V("letter","Letter–Sound Correspondence","Phonics","Link a sound to its written letter (caps & small)",["L","S","R","W"]),
      G("dragdrop","Drag & Drop — same starting letter","Phonics","Group pictures by starting sound",["R"]),
      V("write","Let us Write — letter strokes","Writing","Write capital & small letters with correct strokes",["W"]),
      G("spotit","Spot It — tap all the letters","Writing","Find a target letter among distractors",["R","G"]),
      G("trace","Trace It — letters","Writing","Produce correct strokes for letters",["W","G"]),
    ]},
    { session: "Session 2", type: "Teaching", blocks: [
      V("recap","Recap on the Focus Words (slideshow)","Vocabulary","Recognize & name focus words quickly",["L","S"]),
      G("dragdrop","Drag & Drop — audio ↔ picture","Vocabulary","Identify picture matching a focus word",["L"]),
      G("spotit","Spot It — select all ___","Vocabulary","Identify all pictures matching a focus word",["L"]),
      V("sight","Sight Words","Reading","Read sight words with repetition",["L","S"]),
      G("spotit","Spot It — tap the sight word","Reading","Find a target sight word when heard",["R","Rc"]),
      G("trace","Trace It — sight words","Writing","Trace the sight words",[]),
      V("read","Read With Me","Reading","Read & comprehend simple phrases",["R","Rc"]),
      G("dragdrop","Drag & Drop — choose the answer","Comprehension","Answer comprehension questions",["Rc"]),
      G("tapspeak","Tap & Speak","Speaking","Read aloud the phrase",["S"]),
      V("write","Let us Write — letter strokes","Writing","Write letters with correct strokes",["W"]),
      G("trace","Trace It — letters & words","Writing","Produce correct strokes",["W","G"]),
    ]},
  ]},
]};

const EN_L2 = { level: "Level 2", grade: "Grade 3", weeks: [
  { week: "Week 1", theme: "Phonics Blends · Read With Me", sessions: [
    { session: "Session 1", type: "Teaching", blocks: [
      V("rhyme","Introduction to Focus Words + Rhyme Time","Vocabulary","Name core objects from everyday themes",["L","S"]),
      G("dragdrop","Drag & Drop — match picture to word","Vocabulary","Identify picture matching a focus word",["L"]),
      G("crossword","Crossword — Find the Word","Vocabulary","Identify words from a letter jumble",["L"]),
      G("trace","Trace It — write the word","Pre-writing","Associate visual forms with vocabulary",["W"]),
      V("story","Animated Story Time","Comprehension","Follow a story sequence; main idea",["LC"]),
      G("dragdrop","Drag & Drop — pause-point questions","Comprehension","Recall key details at pause points",["LC"]),
      V("letter","Letter–Sound Correspondence (blends)","Phonics","CVC, CCVC, CVCC, silent-e",["L","S","R","W"]),
      G("fillblank","Drag & Drop — fill the blank blend","Phonics","Place the correct blend into the blank",["R"]),
      G("bottle","Fill the Bottle — sort by blend","Phonics","Sort words by starting/ending sound",["R","G"]),
      G("trace","Trace It — blend + word","Writing","Form the words learnt",["W","G"]),
    ]},
    { session: "Session 2", type: "Teaching", blocks: [
      V("recap","Recap on the Focus Words (slideshow)","Vocabulary","Recognize & name focus words quickly",["L","S"]),
      G("dragdrop","Drag & Drop — audio ↔ picture","Vocabulary","Identify focus word",["L"]),
      G("spotit","Spot It — select all ___","Vocabulary","Identify all matching pictures",["L"]),
      V("sight","Sight Words","Reading","Read sight words with repetition",["L","S"]),
      G("spotit","Spot It — tap the sight word","Reading","Find a sight word when heard",["R","Rc"]),
      G("trace","Trace It — sight words","Writing","Trace the sight words",[]),
      V("read","Phonics 2 — Read the Chant","Reading","Read & comprehend a chant",["L","S","R"]),
      G("fillblank","Drag & Drop — missing word in chant","Phonics","Find the missing word",["L","R"]),
      G("tapspeak","Tap & Speak — read a line","Speaking","Read a chant line aloud",["S","R"]),
      V("read","Read With Me — decodable passage","Reading","Read & comprehend a decodable passage",["L","R","Rc","G"]),
      G("dragdrop","Drag & Drop — WH questions","Comprehension","Answer WH questions",["R","Rc","G"]),
      G("sentence","Reorder Jumbled Sentence (4 words)","Writing","Order a sentence correctly",["W","G"]),
    ]},
  ]},
]};

const EN_L3 = { level: "Level 3", grade: "Grade 4/5", weeks: [
  { week: "Week 1", theme: "Vowel Teams · Inferential Reading", sessions: [
    { session: "Session 1", type: "Teaching", blocks: [
      V("rhyme","Introduction to Focus Words + Rhyme Time","Vocabulary","Name core objects from everyday themes",["L","S"]),
      G("letters","Reorder Jumbled Letters (7–10 + decoys)","Spelling","Identify spelling with riddle clues",["R","W"]),
      V("story","Animated Story Time","Comprehension","Follow a story; main idea",["LC"]),
      G("dragdrop","Drag & Drop — pause-point questions","Comprehension","Recall key details",["LC"]),
      V("letter","Letter–Sound — Vowel Teams, R-controlled, Diphthongs","Phonics","Rules for vowel teams & variants",["L","S","R","W"]),
      G("fillblank","Drag & Drop — fill the blank","Phonics","Place correct blend into blank",["L","R"]),
      G("bottle","Fill the Bottle — sort by sound","Phonics","Sort words by start/end sound",["L","R"]),
      G("trace","Trace It — blend + word","Writing","Form the words learnt",["W"]),
    ]},
    { session: "Session 2", type: "Teaching", blocks: [
      V("recap","Recap on the Focus Words (Fry 400+)","Vocabulary","Recognize & name focus words quickly",["L","S"]),
      G("dragdrop","Drag & Drop — audio ↔ picture","Vocabulary","Identify focus word",["L"]),
      G("spotit","Spot It — select all ___","Vocabulary","Identify all matching pictures",["L"]),
      V("sight","Sight Words (Fry 400+)","Reading","Read sight words with repetition",["L","S"]),
      G("spotit","Spot It — tap the sight word","Reading","Find a sight word when heard",["R","Rc"]),
      V("read","Phonics 2 — Read the Chant","Reading","Read & comprehend a chant",["L","S","R"]),
      G("fillblank","Drag & Drop — missing word","Phonics","Find the missing word",["L","R"]),
      G("tapspeak","Tap & Speak","Speaking","Read a line aloud",["S","R"]),
      V("read","Read With Me — inferential passage","Reading","Comprehend inferential text",["L","R","Rc","G"]),
      G("dragdrop","Drag & Drop — WH questions","Comprehension","Answer WH questions",["R","Rc","G"]),
      G("sentence","Reorder Jumbled Sentence","Writing","Order a sentence correctly",["W","G"]),
    ]},
  ]},
]};

/* ============================ TAMIL ============================ */
const TA_L1 = { level: "Level 1", grade: "Grade 1/2", weeks: [
  { week: "Week 1", theme: "Focus Words · Letter Sounds · Tracing", sessions: [
    { session: "Session 1", type: "Teaching", blocks: [
      V("rhyme","Rhyme Time","Oral Language","Listen to rhyme; identify & say focus words",["L","S"]),
      G("dragdrop","Drag & Drop — picture for focus word","Vocabulary","Tap picture matching the focus word",["L"]),
      G("tapspeak","Tap & Speak — name the object","Speaking","Say the name of the object shown",["S"]),
      G("spotit","Spot It — find all ___","Vocabulary","Identify pictures matching focus word",["L"]),
      V("story","Story Time","Comprehension","Hear focus words in context",["L","LC","S"]),
      G("dragdrop","Drag & Drop — main character / WH","Comprehension","Identify character; answer WH",["L","LC","S"]),
      V("letter","Letter–Sound Correspondence","Phonics","Recognize letter–sound correspondence",["L","S","R"]),
      G("dragdrop","Drag & Drop — catch the same letters","Phonics","Catch letters falling with their sound",["L"]),
      G("sortit","Sort It — same letters in one bag","Phonics","Sort the same letters together",["L","S","G"]),
      G("dragdrop","Drag & Drop — letter for the sound","Phonics","Click the correct letter for the sound",["L","S","R","G"]),
      V("write","Let us Write — letter script & strokes","Writing","Show letter script, sound & strokes",["W"]),
      G("trace","Trace Letters — stroke order","Writing","Trace with finger; gentle stroke order",["L","W"]),
    ]},
    { session: "Session 2", type: "Teaching", blocks: [
      V("recap","Rhyme Time Recap","Oral Language","Recap focus words via picture/lyrics",["L","S"]),
      G("dragdrop","Drag & Drop — picture for focus word","Vocabulary","Tap picture matching focus word",["L"]),
      G("spotit","Spot It — find all ___","Vocabulary","Identify matching pictures",["L"]),
      V("blend","Blending","Phonics","Blend letters of a word to read it",["L","S","R"]),
      G("dragdrop","Drag & Drop — tap the flower (matching letter)","Phonics","Tap flowers with the matching letter",["L","G"]),
      G("blending","Blending Game — match word to object","Phonics","Blend letters; match word to object",["L","S","R","G"]),
      G("tapspeak","Tap & Speak — first letter sound","Speaking","Say the first letter sound of the object",["L","S","G"]),
      V("write","Let us Write — word & pronunciation","Writing","Show word, pronunciation & strokes",["W"]),
      G("trace","Tracing — words","Writing","Trace word path; stroke order",["W"]),
    ]},
    { session: "Session 3", type: "Revision", blocks: [
      V("recap","Recap video","Oral Language","Tap picture matching the focus word",["L"]),
      G("dragdrop","Letter–Sound games","Phonics","Finalized letter-sound games",["L"]),
      G("blending","Blending games","Phonics","Finalized blending games",["L","R"]),
    ]},
  ]},
]};

const TA_L2 = { level: "Level 2", grade: "Grade 3", weeks: [
  { week: "Week 1", theme: "Blending · Read With Me", sessions: [
    { session: "Session 1", type: "Teaching", blocks: [
      V("rhyme","Rhyme Time","Oral Language","Listen to rhyme; identify focus words",["L","S"]),
      G("dragdrop","Drag & Drop — picture for focus word","Vocabulary","Identify picture for focus word",["L"]),
      G("clue","Clue Words — find the connecting word","Vocabulary","Identify the logical link between words",["L"]),
      V("story","Story Time","Comprehension","Hear focus words in context",["L","LC","S"]),
      G("dragdrop","Drag & Drop — WH questions","Comprehension","Answer WH questions",["L","LC","S"]),
      V("blend","Blending","Phonics","Blend letters; singular & plural",["L","S","R","G"]),
      G("dragdrop","Drag & Drop — correct blend","Phonics","Drag the correct blend",["L","G"]),
      G("blending","Blending Game — word ↔ object","Phonics","Blend & match word to object",["L","S","R","G"]),
      G("tapspeak","Tap & Speak — first letter sound","Speaking","Say the first letter sound",["L","S","G"]),
      G("bottle","Fill the Bottle — same ending sound","Phonics","Group words by first/last letters",["R"]),
      V("write","Let us Write","Writing","Show word, pronunciation, strokes",["W"]),
      G("trace","Tracing — words","Writing","Trace word path; stroke order",["W"]),
    ]},
    { session: "Session 2", type: "Teaching", blocks: [
      V("recap","Rhyme Time Recap","Oral Language","Recap focus words",["L","S"]),
      G("dragdrop","Drag & Drop — picture for focus word","Vocabulary","Identify focus word",["L"]),
      G("spotit","Spot It — find all ___","Vocabulary","Identify matching pictures",["L"]),
      V("blend","Blending","Phonics","Blend letters to read words",["L","S","R","G"]),
      G("dragdrop","Drag & Drop — correct blend","Phonics","Drag the correct blend",["L","G"]),
      G("blending","Blending Game — word ↔ object","Phonics","Blend & match",["L","S","R","G"]),
      G("tapspeak","Tap & Speak — first letter sound","Speaking","Say the first letter sound",["L","S","G"]),
      G("bottle","Fill the Bottle — same ending sound","Phonics","Group words by letters",["R"]),
      V("read","Read With Me — decodable text","Reading","Read 4–5 line decodable text",["R","Rc"]),
      G("dragdrop","Drag & Drop — WH questions","Comprehension","Answer WH questions",["Rc"]),
      G("sentence","Reorder Jumbled Sentence (4 words)","Writing","Order the sentence correctly",["W","G"]),
      G("tapspeak","Tap & Speak — read sentences","Speaking","Read the sentences aloud",["S"]),
    ]},
    { session: "Session 3", type: "Revision", blocks: [
      V("recap","Recap video — timed slideshow","Oral Language","Recognize & name focus words quickly",["L"]),
      G("blending","Blending & Segmenting games","Phonics","Finalized games",["L","R"]),
      G("dragdrop","Read With Me games","Reading","Finalized games",["Rc"]),
    ]},
  ]},
]};

const TA_L3 = { level: "Level 3", grade: "Grade 4/5", weeks: [
  { week: "Week 1", theme: "Blending · Synonyms & Antonyms", sessions: [
    { session: "Session 1", type: "Teaching", blocks: [
      V("rhyme","Rhyme Time","Oral Language","Listen to rhyme; identify focus words",["L","S"]),
      G("clue","Clue Words — find the focus word (no pictures)","Vocabulary","Identify logical link; read & answer",["R"]),
      V("story","Story Time","Comprehension","Hear focus words in context",["L","LC","S"]),
      G("dragdrop","Drag & Drop — key story details","Comprehension","Recall & identify key details",["L","LC","S"]),
      V("blend","Blending — gender & person markers","Phonics","Blend letters; markers",["L","S","R","G"]),
      G("dragdrop","Drag & Drop — correct blend","Phonics","Drag the correct blend",["L","G"]),
      G("blending","Blending Game — word ↔ object","Phonics","Blend & match",["L","S","R","G"]),
      G("tapspeak","Tap & Speak — first letter sound","Speaking","Say the first letter sound",["L","S","G"]),
    ]},
    { session: "Session 2", type: "Teaching", blocks: [
      V("recap","Rhyme Time Recap","Oral Language","Recap focus words",["L","S"]),
      G("dragdrop","Drag & Drop — picture for focus word","Vocabulary","Identify focus word",["L"]),
      G("spotit","Spot It — find all ___","Vocabulary","Identify matching pictures",["L"]),
      V("blend","Blending","Phonics","Blend letters to read words",["L","S","R"]),
      G("dragdrop","Drag & Drop — correct blend","Phonics","Drag the correct blend",["L","G"]),
      G("blending","Blending Game — word ↔ object","Phonics","Blend & match",["L","S","R","G"]),
      G("tapspeak","Tap & Speak — first letter sound","Speaking","Say the first letter sound",["L","S","G"]),
      G("crossword","Crossword — synonyms / antonyms","Vocabulary","Tap the synonym / antonym",["R","G"]),
      V("read","Read With Me — decodable text","Reading","Read 4–5 line decodable text",["R","Rc"]),
      G("dragdrop","Drag & Drop — WH questions","Comprehension","Answer WH questions",["Rc"]),
      G("sentence","Reorder Jumbled Sentence","Writing","Order the sentence correctly",["W","G"]),
      G("tapspeak","Tap & Speak — read sentences","Speaking","Read the sentences aloud",["S"]),
    ]},
  ]},
]};

const CYCLE = {
  Maths:   { framework: "maths", strands: MATHS_FW, levels: [M_L1, M_L2, M_L3, M_L4, M_L5] },
  English: { framework: "lang",  strands: LANG_FW,  levels: [EN_L1, EN_L2, EN_L3] },
  Tamil:   { framework: "lang",  strands: LANG_FW,  levels: [TA_L1, TA_L2, TA_L3] },
};

Object.assign(window, { CYCLE, ANCHORS, MECH, MATHS_FW, LANG_FW });
