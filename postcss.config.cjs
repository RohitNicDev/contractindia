module.exports = {
  plugins: {
    "@tailwindcss/postcss": {},
    autoprefixer: {
      overrideBrowserslist: ['Chrome >= 109', 'Firefox >= 115', 'Safari >= 12', 'Edge >= 109'],
      flexbox: 'no-2009',  // Use modern flexbox syntax
      cascade: true,
      add: true,           // Add vendor prefixes
    },
  },
};
