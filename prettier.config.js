module.exports = {
  semi: true, // Always use semicolons → avoids ASI ambiguity
  singleQuote: true, // Consistent string style
  trailingComma: 'all', // Stable diffs, easier AI edits
  tabWidth: 2, // Standard, avoids wide indentation
  printWidth: 80, // Narrower → AI handles chunks better
  bracketSpacing: true, // Clearer object/array tokens
  arrowParens: 'always', // Explicit → avoids AI mistakes
  endOfLine: 'lf', // Consistent across OS
  plugins: ['prettier-plugin-tailwindcss', 'prettier-plugin-organize-imports'],
};
