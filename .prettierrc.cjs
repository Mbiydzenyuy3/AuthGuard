module.exports = {
  semi: true,
  singleQuote: true,
  printWidth: 100,
  tabWidth: 2,
  trailingComma: 'all',
  overrides: [
    {
      files: '*.ts',
      options: { parser: 'typescript' },
    },
    {
      files: '*.tsx',
      options: { parser: 'typescript' },
    },
    {
      files: '*.js',
      options: { parser: 'babel' },
    },
    {
      files: '*.jsx',
      options: { parser: 'babel' },
    },
    {
      files: '*.json',
      options: { parser: 'json' },
    },
    {
      files: '*.md',
      options: { parser: 'markdown' },
    },
  ],
};
