// This module runs only on the server (Node.js). It must never be imported by
// client components because it uses `fs` and `path`, which are not available
// in the browser bundle.
import fs from "fs";
import path from "path";
import type { JournalEntry } from "@/data/trail";

// Generic key→value map used to hold parsed frontmatter fields.
type Frontmatter = Record<string, string>;

// Absolute path to the markdown blog directory, resolved at module load time.
const BLOGS_DIRECTORY = path.join(process.cwd(), "content", "blogs");

// Extracts YAML frontmatter and the markdown body from a raw file string.
// Returns { data: {}, body: raw } when the file has no frontmatter block.
// Strips surrounding quotes from field values so `title: "My Run"` and
// `title: My Run` both yield the plain string "My Run".
function parseFrontmatter(fileContents: string) {
  const frontmatterMatch = fileContents.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);

  if (!frontmatterMatch) {
    return { data: {}, body: fileContents.trim() };
  }

  const [, frontmatter, body] = frontmatterMatch;
  const data = frontmatter.split("\n").reduce<Frontmatter>((fields, line) => {
    // Use indexOf(":") rather than split(":") so values containing colons
    // (e.g. times like "06:30") are not accidentally truncated.
    const separatorIndex = line.indexOf(":");

    if (separatorIndex === -1) {
      return fields;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line
      .slice(separatorIndex + 1)
      .trim()
      .replace(/^["']|["']$/g, ""); // strip optional surrounding quotes

    return { ...fields, [key]: value };
  }, {});

  return { data, body: body.trim() };
}

// Converts an ISO date string ("2026-03-08") to a localised display string
// ("08 Mar 2026"). Appending T00:00:00 forces local-time parsing — without it,
// `new Date("2026-03-08")` is parsed as UTC midnight and can shift the displayed
// date back by one day in timezones west of UTC.
function formatDisplayDate(dateValue: string) {
  const date = new Date(`${dateValue}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateValue; // pass through unparseable values unchanged
  }

  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(date);
}

// Strips common markdown syntax so plain text can be stored in JournalEntry.body
// and rendered inside a <p> without showing raw markdown characters.
// Only handles the subset actually used in blog posts (headings, bold, italic,
// inline links). Does not handle code blocks, tables, or block quotes.
function markdownToPlainText(markdown: string) {
  return markdown
    .replace(/^#{1,6}\s+/gm, "")       // ## Heading → Heading
    .replace(/\*\*(.*?)\*\*/g, "$1")   // **bold** → bold
    .replace(/\*(.*?)\*/g, "$1")       // *italic* → italic
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1") // [text](url) → text
    .trim();
}

// Reads every .md file in content/blogs/, parses frontmatter + body, and
// returns an array of JournalEntry objects sorted newest-first.
// Returns [] (not an error) when the directory does not exist so the home page
// can silently fall back to the hardcoded journalEntries array.
export function getCmsBlogEntries(): JournalEntry[] {
  if (!fs.existsSync(BLOGS_DIRECTORY)) {
    return [];
  }

  return fs
    .readdirSync(BLOGS_DIRECTORY)
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const fullPath = path.join(BLOGS_DIRECTORY, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, body } = parseFrontmatter(fileContents);

      return {
        date: formatDisplayDate(data.date || ""),
        // title → route → filename (without .md) as cascading fallbacks
        routeName: data.title || data.route || fileName.replace(/\.md$/, ""),
        distance: data.distance || "Open",
        elevation: data.elevation || "Open",
        // excerpt from frontmatter, or first 160 chars of plain-text body
        reflection: data.excerpt || markdownToPlainText(body).slice(0, 160),
        body: markdownToPlainText(body)
      };
    })
    // Sort descending by date so the most recent post appears first.
    // Date.parse uses the already-localised display string; if it fails the
    // entry sorts to the end (NaN comparison).
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
}
