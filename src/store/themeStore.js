import { create } from 'zustand';

const useThemeStore = create((set) => ({
    // 🎨 Core Colors — change here OR in index.css :root
    primaryColor: '#162646',
    secondaryColor: '#1e3a5f',
    accentColor: '#6366f1',
    ctaColor: '#f59e0b',

    // Typography
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",

    // Components
    borderRadius: 12,

    // Actions
    updateTheme: (newTheme) => set((state) => ({ ...state, ...newTheme })),
    setPrimaryColor: (color) => set({ primaryColor: color }),
    setAccentColor: (color) => set({ accentColor: color }),
    setFontFamily: (font) => set({ fontFamily: font }),
}));

export default useThemeStore;
