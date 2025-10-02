module.exports = {
  // Critical for AI code generation - explicit syntax
  semi: true, // Always use semicolons → avoids ASI ambiguity
  arrowParens: 'always', // Explicit → avoids AI parsing mistakes
  bracketSpacing: true, // Clearer object/array token boundaries

  // Code style consistency - AI pattern matching
  singleQuote: true, // Consistent string delimiters for AI tokenization
  quoteProps: 'as-needed', // Minimal quotes for cleaner AI parsing

  // Structural clarity for AI
  trailingComma: 'all', // Stable diffs, easier AI edits, clearer intent
  bracketSameLine: false, // Opening brackets on new line for clarity

  // Formatting that aids AI comprehension
  tabWidth: 2, // Standard, avoids wide indentation
  printWidth: 80, // Narrower → AI handles chunks better, fits context windows
  useTabs: false, // Spaces for consistent AI tokenization

  // Line ending consistency
  endOfLine: 'lf', // Consistent across OS and AI tools

  // Syntax clarity
  jsxSingleQuote: false, // JSX uses double quotes for distinction
  htmlWhitespaceSensitivity: 'css', // Preserve meaningful whitespace

  // Import organization and Tailwind sorting (AI-friendly plugins)
  plugins: [
    'prettier-plugin-organize-imports', // Auto-organize imports for AI clarity
    'prettier-plugin-tailwindcss', // Consistent Tailwind class order
  ],

  // Embedded language formatting
  embeddedLanguageFormatting: 'auto', // Format SQL, CSS in JS

  // Prose wrapping for markdown (when not ignored)
  proseWrap: 'preserve', // Preserve author intent in prose
};
