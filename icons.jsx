/* icons.jsx — SVG icon set. Stroke-based, 1.6 weight, currentColor. */
const S = ({ d, w = 1.7, fill, children, vb = "0 0 24 24", ...p }) => (
  <svg viewBox={vb} fill={fill || "none"} stroke={fill ? "none" : "currentColor"}
       strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" {...p}>
    {d ? <path d={d} /> : children}
  </svg>
);

/* --- Nav / structural --- */
const IcGrid = (p) => <S {...p}><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></S>;
const IcModule = (p) => <S {...p}><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M8 4v16"/></S>;
const IcGame = (p) => <S {...p}><rect x="2.5" y="6.5" width="19" height="11" rx="4"/><path d="M7 11v3M5.5 12.5h3"/><circle cx="15.5" cy="11.5" r=".4" fill="currentColor"/><circle cx="18" cy="13.5" r=".4" fill="currentColor"/></S>;
const IcRepo = (p) => <S {...p}><path d="M4 7v10a2 2 0 0 0 2 2h12M4 7a2 2 0 0 1 2-2h9l3 3v4M4 7h11"/><path d="M8 11h6M8 15h4"/></S>;
const IcJourney = (p) => <S {...p}><circle cx="5" cy="6" r="2.2"/><circle cx="19" cy="18" r="2.2"/><path d="M7 7c4 1 4 4 0 5s-4 4 0 5M12.2 6.6h6.6"/></S>;
const IcSubject = (p) => <S {...p}><path d="M4 19.5V5a1 1 0 0 1 1-1h13a1 1 0 0 1 1 1v12H6a2 2 0 0 0-2 2.5zM6 17h13"/><path d="M9 8h6"/></S>;
const IcWorkflow = (p) => <S {...p}><rect x="3" y="4" width="6" height="5" rx="1.3"/><rect x="15" y="4" width="6" height="5" rx="1.3"/><rect x="9" y="15" width="6" height="5" rx="1.3"/><path d="M6 9v3a2 2 0 0 0 2 2h1M18 9v3a2 2 0 0 1-2 2h-1"/></S>;
const IcChart = (p) => <S {...p}><path d="M4 4v15a1 1 0 0 0 1 1h15"/><path d="M8 15l3-4 3 2 4-6"/></S>;
const IcSettings = (p) => <S {...p}><circle cx="12" cy="12" r="3"/><path d="M12 2.5v2.5M12 19v2.5M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2.5 12H5M19 12h2.5M4.2 19.8 6 18M18 6l1.8-1.8"/></S>;

/* --- Actions --- */
const IcPlus = (p) => <S {...p} d="M12 5v14M5 12h14" w={2}/>;
const IcSearch = (p) => <S {...p}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/></S>;
const IcBell = (p) => <S {...p}><path d="M18 8a6 6 0 1 0-12 0c0 7-3 8-3 8h18s-3-1-3-8M10.3 21a2 2 0 0 0 3.4 0"/></S>;
const IcDots = (p) => <S {...p} fill="currentColor"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></S>;
const IcChevR = (p) => <S {...p} d="m9 5 7 7-7 7"/>;
const IcChevL = (p) => <S {...p} d="m15 5-7 7 7 7"/>;
const IcChevD = (p) => <S {...p} d="m6 9 6 6 6-6"/>;
const IcArrowR = (p) => <S {...p} d="M5 12h14M13 6l6 6-6 6"/>;
const IcCheck = (p) => <S {...p} d="m5 13 4 4L19 7" w={2}/>;
const IcCheckCircle = (p) => <S {...p}><circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.3 2.3L16 9"/></S>;
const IcX = (p) => <S {...p} d="M6 6l12 12M18 6 6 18"/>;
const IcFilter = (p) => <S {...p} d="M3 5h18l-7 8v5l-4 2v-7L3 5z"/>;
const IcUpload = (p) => <S {...p}><path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M12 16V4M7 9l5-5 5 5"/></S>;
const IcDrag = (p) => <S {...p} fill="currentColor"><circle cx="9" cy="6" r="1.4"/><circle cx="15" cy="6" r="1.4"/><circle cx="9" cy="12" r="1.4"/><circle cx="15" cy="12" r="1.4"/><circle cx="9" cy="18" r="1.4"/><circle cx="15" cy="18" r="1.4"/></S>;
const IcClock = (p) => <S {...p}><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></S>;
const IcEye = (p) => <S {...p}><path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="2.6"/></S>;
const IcCopy = (p) => <S {...p}><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></S>;
const IcEdit = (p) => <S {...p}><path d="M16.5 4.5 19.5 7.5 9 18l-4 1 1-4 10.5-10.5zM14.5 6.5l3 3"/></S>;
const IcArchive = (p) => <S {...p}><rect x="3" y="4" width="18" height="4.5" rx="1.3"/><path d="M5 8.5V19a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8.5M10 12h4"/></S>;
const IcTrash = (p) => <S {...p} d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13"/>;
const IcLock = (p) => <S {...p}><rect x="4.5" y="10.5" width="15" height="10" rx="2"/><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5"/></S>;
const IcLink = (p) => <S {...p}><path d="M9 15l6-6M10.5 6.5l1.8-1.8a4 4 0 0 1 5.7 5.7l-1.8 1.8M13.5 17.5l-1.8 1.8a4 4 0 0 1-5.7-5.7l1.8-1.8"/></S>;
const IcSparkle = (p) => <S {...p}><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z"/></S>;
const IcUsers = (p) => <S {...p}><circle cx="9" cy="8" r="3"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0M16 6.2a3 3 0 0 1 0 5.6M20.5 19a5.5 5.5 0 0 0-3.5-5.1"/></S>;
const IcMsg = (p) => <S {...p} d="M21 12a8 8 0 0 1-11.5 7.2L4 20.5l1.3-5.5A8 8 0 1 1 21 12z"/>;
const IcLayers = (p) => <S {...p}><path d="M12 3 21 8l-9 5-9-5 9-5zM3.5 12.5 12 17l8.5-4.5M3.5 16.5 12 21l8.5-4.5"/></S>;
const IcTarget = (p) => <S {...p}><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r=".6" fill="currentColor"/></S>;
const IcFlask = (p) => <S {...p}><path d="M9 3h6M10 3v6L5.5 17a2 2 0 0 0 1.8 3h9.4a2 2 0 0 0 1.8-3L14 9V3M8 14h8"/></S>;
const IcPalette = (p) => <S {...p}><path d="M12 3a9 9 0 1 0 0 18c1.5 0 2-1 2-2 0-1.5 1-2 2.5-2H18a3 3 0 0 0 3-3c0-5-4-9-9-9z"/><circle cx="7.5" cy="11" r="1" fill="currentColor"/><circle cx="10" cy="7" r="1" fill="currentColor"/><circle cx="15" cy="7.5" r="1" fill="currentColor"/></S>;
const IcSliders = (p) => <S {...p}><path d="M5 21v-7M5 10V3M12 21v-9M12 8V3M19 21v-5M19 12V3"/><circle cx="5" cy="12" r="2"/><circle cx="12" cy="6" r="2"/><circle cx="19" cy="14" r="2"/></S>;

/* --- Content block types --- */
const IcVideo = (p) => <S {...p}><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M10.5 9.2v5.6l4.5-2.8-4.5-2.8z" fill="currentColor" stroke="none"/></S>;
const IcQuiz = (p) => <S {...p}><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M9 8.5a2 2 0 1 1 2.6 1.9c-.7.3-1.1.8-1.1 1.6M10.5 15.5h.01"/></S>;
const IcReading = (p) => <S {...p}><path d="M6 4h9l4 4v12H6z"/><path d="M14 4v4h4M9 13h6M9 16h4"/></S>;
const IcAudio = (p) => <S {...p}><path d="M4 9v6M8 6v12M12 3v18M16 7v10M20 10v4"/></S>;
const IcDoc = (p) => <S {...p}><path d="M7 3h7l4 4v14H7zM13 3v4h4M10 12h5M10 15h5"/></S>;

/* --- 14 game-type glyphs --- */
const GgDragDrop = (p) => <S {...p}><rect x="3" y="3.5" width="6" height="6" rx="1.3"/><rect x="13" y="14" width="8" height="6.5" rx="1.3" strokeDasharray="2.5 2"/><path d="M9 6.5h2.5a3 3 0 0 1 3 3V14"/></S>;
const GgTapSpeak = (p) => <S {...p}><rect x="9" y="3" width="6" height="10" rx="3"/><path d="M6 11a6 6 0 0 0 12 0M12 17v3M9 20h6"/></S>;
const GgSpotIt = (p) => <S {...p}><circle cx="7" cy="7" r="2.4"/><circle cx="17" cy="7" r="2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2.4"/><path d="m15.5 15.5 1.5 1.5 1.5-1.5" /></S>;
const GgMatch = (p) => <S {...p}><circle cx="5" cy="6.5" r="1.8"/><circle cx="5" cy="17.5" r="1.8"/><circle cx="19" cy="6.5" r="1.8"/><circle cx="19" cy="17.5" r="1.8"/><path d="M7 6.5h10M7 17.5h6"/></S>;
const GgTrace = (p) => <S {...p}><path d="M5 18c2-9 5-12 7-12s2 4-1 7 0 5 4 0" strokeDasharray="1 2.4"/><circle cx="5" cy="18" r="1.2" fill="currentColor" stroke="none"/></S>;
const GgBalloon = (p) => <S {...p}><circle cx="9" cy="8" r="4.5"/><path d="M9 12.5v2M9 16l2 4M14.5 11l4 9"/><circle cx="17" cy="7" r="2.6"/></S>;
const GgNumberLine = (p) => <S {...p}><path d="M3 12h18M6 10v4M12 10v4M18 10v4"/><path d="M10 5l2-2 2 2" /></S>;
const GgSignDrop = (p) => <S {...p}><path d="M5 8h4M5 16h4M19 8v8" opacity="0"/><text x="3.5" y="16" fontSize="13" fontFamily="monospace" fill="currentColor" stroke="none">&lt;</text><path d="M11 7v10" strokeDasharray="2 2"/><text x="14" y="16" fontSize="13" fontFamily="monospace" fill="currentColor" stroke="none">=</text></S>;
const GgBottle = (p) => <S {...p}><path d="M9 3h6M10 3v3l-2 2v11a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V8l-2-2V3"/><path d="M8 13h8" /><path d="M8 13c1.5 1 6.5 1 8 0v5H8z" fill="currentColor" stroke="none" opacity="0.18"/></S>;
const GgLetters = (p) => <S {...p}><rect x="3" y="8" width="5.5" height="5.5" rx="1" transform="rotate(-8 5.7 10.7)"/><rect x="10" y="9" width="5.5" height="5.5" rx="1" transform="rotate(6 12.7 11.7)"/><rect x="16.5" y="8" width="5.5" height="5.5" rx="1" transform="rotate(-5 19 10.7)"/></S>;
const GgSentence = (p) => <S {...p}><rect x="3" y="6" width="7" height="4.5" rx="1"/><rect x="12" y="6" width="9" height="4.5" rx="1"/><rect x="3" y="13.5" width="10" height="4.5" rx="1" strokeDasharray="2.5 2"/></S>;
const GgFillBlank = (p) => <S {...p}><path d="M3 8h5M16 8h5"/><rect x="9" y="5.5" width="6" height="5" rx="1" strokeDasharray="2.5 2"/><path d="M5 14h14"/></S>;
const GgBlending = (p) => <S {...p}><circle cx="6" cy="9" r="2.4"/><circle cx="14" cy="9" r="2.4"/><path d="M8 9h4M11 14l3 5"/><circle cx="14" cy="18" r="2.4"/></S>;
const GgCrossword = (p) => <S {...p}><rect x="9" y="3" width="5" height="5"/><rect x="9" y="8" width="5" height="5"/><rect x="4" y="8" width="5" height="5"/><rect x="14" y="8" width="5" height="5"/><rect x="9" y="13" width="5" height="5"/></S>;

Object.assign(window, {
  IcGrid, IcModule, IcGame, IcRepo, IcJourney, IcSubject, IcWorkflow, IcChart, IcSettings,
  IcPlus, IcSearch, IcBell, IcDots, IcChevR, IcChevL, IcChevD, IcArrowR, IcCheck, IcCheckCircle, IcX,
  IcFilter, IcUpload, IcDrag, IcClock, IcEye, IcCopy, IcEdit, IcArchive, IcTrash, IcLock, IcLink,
  IcSparkle, IcUsers, IcMsg, IcLayers, IcTarget, IcFlask, IcPalette, IcSliders,
  IcVideo, IcQuiz, IcReading, IcAudio, IcDoc,
  GgDragDrop, GgTapSpeak, GgSpotIt, GgMatch, GgTrace, GgBalloon, GgNumberLine, GgSignDrop,
  GgBottle, GgLetters, GgSentence, GgFillBlank, GgBlending, GgCrossword,
});
