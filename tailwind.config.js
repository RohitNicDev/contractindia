export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
  // Disable experimental features for older browsers
  corePlugins: {
    container: true,
  },
  future: {
    hoverOnlyWhenSupported: false, // Disable hover-only media query for Windows 7
  },
};
