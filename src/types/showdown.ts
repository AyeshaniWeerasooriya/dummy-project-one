import showdown from "showdown";

// Create a single shared converter instance
const converter = new showdown.Converter({
  simplifiedAutoLink: true,
  strikethrough: true, // enable ~~strike~~
  simpleLineBreaks: true,
  tables: true,
  tasklists: true,
  ghCodeBlocks: true,
});

export default converter;
