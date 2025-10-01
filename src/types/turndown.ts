/* eslint-disable @typescript-eslint/no-explicit-any */
import TurndownService from "turndown";

const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  strongDelimiter: "**",
  emDelimiter: "_",
  bulletListMarker: "-",
});

turndown.addRule("strike", {
  filter: ["s", "del"],
  replacement: (content: string) => `~~${content}~~`,
});

turndown.addRule("underline", {
  filter: "u",
  replacement: (content: string) => `<u>${content}</u>`,
});

export default turndown;
