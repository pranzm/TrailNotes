// ── Type definitions ─────────────────────────────────────────────────────────

export type Stat = {
  label: string;
  value: string;
  detail: string;
};

export type JournalEntry = {
  date: string;        // display string, e.g. "12 Apr 2026"
  routeName: string;
  distance: string;
  elevation: string;
  reflection: string;  // short teaser shown in the collapsed card state
  body: string;        // full text revealed inside <details>
};

export type Route = {
  name: string;
  distance: string;
  // difficulty drives the colour variant on RouteCard via difficultyStyles map
  difficulty: "Easy" | "Moderate" | "Hard";
  terrain: string;
  location: string;
};

export type GearItem = {
  title: string;
  description: string;
};

// ── Static data ───────────────────────────────────────────────────────────────
// All arrays below are inlined rather than fetched so the home page has zero
// async dependencies and renders instantly. CMS markdown files take precedence
// over `journalEntries` when they exist (see src/app/page.tsx and getCmsBlogEntries).

export const stats: Stat[] = [
  {
    label: "Total Runs",
    value: "328",
    detail: "Logged across road, trail, and race days"
  },
  {
    label: "Total Distance",
    value: "4,860 km",
    detail: "Steady miles built through consistency"
  },
  {
    label: "Favourite Trail",
    value: "Nandi Hills",
    detail: "Climbs, wind, and early light near Bangalore"
  },
  {
    label: "Years Running",
    value: "8+",
    detail: "From fitness habit to endurance practice"
  }
];

// Fallback blog entries used when content/blogs/ contains no .md files.
// getCmsBlogEntries() returns [] in that case and page.tsx falls back here.
export const journalEntries: JournalEntry[] = [
  {
    date: "12 Apr 2026",
    routeName: "Morning Ridge Reset",
    distance: "14.2 km",
    elevation: "420 m",
    reflection:
      "A controlled aerobic effort over rolling dirt, focused on posture, quiet feet, and finishing with more patience than pace.",
    body:
      "The goal was not speed. It was rhythm. I kept the first climb deliberately quiet, letting the breathing settle before the trail opened into rolling dirt. The useful lesson was simple: when the effort stays honest early, the final kilometers become a place to practice form instead of negotiate with fatigue."
  },
  {
    date: "29 Mar 2026",
    routeName: "Lake Loop Tempo",
    distance: "10.0 km",
    elevation: "96 m",
    reflection:
      "Short surges between shaded sections. The route felt familiar, but the work was in staying relaxed when the pace settled in.",
    body:
      "Tempo work around a familiar loop can become mechanical, so I used this run to check small things: shoulders low, cadence steady, and no panic when the watch showed a faster split. The best part of the session was not the pace. It was learning to stay relaxed while still asking the body to work."
  },
  {
    date: "08 Mar 2026",
    routeName: "Forest Road Long Run",
    distance: "24.6 km",
    elevation: "610 m",
    reflection:
      "A nutrition rehearsal and reminder that good long runs are built from small decisions made before fatigue arrives.",
    body:
      "This was a long-run rehearsal more than a fitness test. I practiced drinking before thirst, eating before the low patch, and keeping the climbs conservative. The forest road made the effort feel calm, but the real work was discipline: making the right decision early enough that the final stretch still felt controlled."
  }
];

export const routes: Route[] = [
  {
    name: "Nandi Dawn Climb",
    distance: "18 km",
    difficulty: "Hard",
    terrain: "Road climb, broken shoulder, summit breeze",
    location: "Nandi Hills, Karnataka"
  },
  {
    name: "Cubbon Steady Loop",
    distance: "7.5 km",
    difficulty: "Easy",
    terrain: "Packed path, shaded road, city park",
    location: "Bangalore, Karnataka"
  },
  {
    name: "Turahalli Rock Trail",
    distance: "11 km",
    difficulty: "Moderate",
    terrain: "Granite, dry trail, short technical climbs",
    location: "South Bangalore"
  }
];

export const gearItems: GearItem[] = [
  {
    title: "Shoes",
    description:
      "Rotating dependable daily trainers with grippy trail shoes keeps the work specific without overcomplicating the kit."
  },
  {
    title: "Hydration",
    description:
      "Simple bottles, electrolytes on warm days, and enough discipline to drink before thirst becomes the signal."
  },
  {
    title: "Watch",
    description:
      "Data is useful when it supports intent: heart rate, effort, recovery, and honest notes after the run."
  },
  {
    title: "Training",
    description:
      "Build consistency first, sharpen gradually, recover deliberately, and keep the joy of movement in the plan."
  }
];
