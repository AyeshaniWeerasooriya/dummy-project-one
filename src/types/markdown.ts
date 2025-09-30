import MarkdownIt from "markdown-it";

const md = new MarkdownIt({
  html: true, // Enable raw HTML inside Markdown
  linkify: true, // Autoconvert plain URLs to <a> links
  typographer: true, // Smart quotes, ellipses, dashes
});

export default md;
