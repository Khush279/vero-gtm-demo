/**
 * Reads a source file from disk so the /automations page can show the actual
 * code that runs each job. Server-only — pulls from process.cwd() at request
 * time so the snippet is never out of sync with the repo.
 *
 * Fails gracefully: if the file is missing (Worker A hasn't committed it yet,
 * or the path was renamed), we return a placeholder instead of crashing the
 * page. The whole point of /automations is to be reliable on the demo URL.
 */

import { promises as fs } from "node:fs";
import path from "node:path";

export type AutomationSource = {
  source: string;
  lineCount: number;
};

const PLACEHOLDER: AutomationSource = {
  source: "// Source not yet committed.\n",
  lineCount: 1,
};

export async function readAutomationSource(
  relativePath: string,
): Promise<AutomationSource> {
  // Normalise: strip a leading slash so path.join doesn't treat it as absolute.
  const rel = relativePath.replace(/^\/+/, "");
  const abs = path.join(process.cwd(), rel);

  try {
    const source = await fs.readFile(abs, "utf8");
    const lineCount = source.length === 0 ? 0 : source.split("\n").length;
    return { source, lineCount };
  } catch {
    return PLACEHOLDER;
  }
}
