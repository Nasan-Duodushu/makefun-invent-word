// Invent a Word We Need — coin one new English word and define it in a single
// clear line of at most 140 characters. The gap it fills: the dread of a
// message already read twice and still unanswered. Writes /output/entry.txt.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const LIMIT = 140;

// Reply + dread: sayable, spellable, instantly recognisable.
const WORD = "Replydread";
const DEFINITION =
  "the low-grade dread of opening a message you have already read twice without answering.";

class Entry {
  readonly text: string;

  constructor(word: string, definition: string) {
    // Collapse any accidental double spaces so the line stays clean.
    this.text = `${word} (n.): ${definition}`.replace(/\s+/g, " ").trim();
  }

  get length(): number {
    return [...this.text].length;
  }

  validate(): void {
    if (this.length < 1 || this.length > LIMIT) {
      throw new Error(`entry must be 1-${LIMIT} chars, got ${this.length}`);
    }
    if (this.text.includes("\n") || this.text.includes("\r")) {
      throw new Error("entry must be a single line");
    }
    // A coined word needs a name, a part of speech, and a definition.
    if (!/^[A-Z][a-z]+ \(n\.\): [a-z]/.test(this.text)) {
      throw new Error("entry must be a coined word with its definition");
    }
    // The word names itself once; the definition does the explaining.
    const mentions = this.text.split(WORD).length - 1;
    if (mentions !== 1) {
      throw new Error("coined word must appear exactly once");
    }
  }

  save(): string {
    this.validate();
    const target = join(OUTPUT_DIR, "entry.txt");
    mkdirSync(OUTPUT_DIR, { recursive: true });
    writeFileSync(target, this.text + "\n", "utf8");
    return target;
  }
}

const entry = new Entry(WORD, DEFINITION);
const target = entry.save();
console.log(`${entry.length} chars -> ${target}`);
console.log(entry.text);
