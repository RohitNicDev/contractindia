import { useState, useEffect } from "react";
import useThemeStore from "../../store/themeStore";

const FONT_OPTIONS = [
    {
        name: "Inter",
        value: "'Inter', system-ui, sans-serif",
        url: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
        category: "Modern",
    },
    {
        name: "Poppins",
        value: "'Poppins', sans-serif",
        url: "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap",
        category: "Modern",
    },
    {
        name: "Roboto",
        value: "'Roboto', sans-serif",
        url: "https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap",
        category: "Modern",
    },
    {
        name: "Montserrat",
        value: "'Montserrat', sans-serif",
        url: "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap",
        category: "Bold",
    },
    {
        name: "Nunito",
        value: "'Nunito', sans-serif",
        url: "https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700&display=swap",
        category: "Friendly",
    },
    {
        name: "Lato",
        value: "'Lato', sans-serif",
        url: "https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap",
        category: "Clean",
    },
    {
        name: "Raleway",
        value: "'Raleway', sans-serif",
        url: "https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;600;700&display=swap",
        category: "Stylish",
    },
    {
        name: "Playfair Display",
        value: "'Playfair Display', serif",
        url: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;700&display=swap",
        category: "Elegant",
    },
    {
        name: "Merriweather",
        value: "'Merriweather', serif",
        url: "https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&display=swap",
        category: "Elegant",
    },
    {
        name: "DM Sans",
        value: "'DM Sans', sans-serif",
        url: "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap",
        category: "Clean",
    },
    {
        name: "Outfit",
        value: "'Outfit', sans-serif",
        url: "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap",
        category: "Modern",
    },
    {
        name: "Noto Sans",
        value: "'Noto Sans', sans-serif",
        url: "https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;700&display=swap",
        category: "Universal",
    },
];

// Load all fonts into the document
const loadFonts = () => {
    FONT_OPTIONS.forEach((font) => {
        if (!document.querySelector(`link[href="${font.url}"]`)) {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = font.url;
            document.head.appendChild(link);
        }
    });
};

const PREVIEW_TEXT = "ContractsIndia™ — Integrated Solution For Construction & Infrastructure";

const FontSettings = () => {
    const { fontFamily, setFontFamily } = useThemeStore();
    const [selected, setSelected] = useState(fontFamily);
    const [saved, setSaved] = useState(false);
    const [activeCategory, setActiveCategory] = useState("All");

    const categories = ["All", ...new Set(FONT_OPTIONS.map((f) => f.category))];

    useEffect(() => {
        loadFonts();
    }, []);

    const applyFont = (fontValue) => {
        // Update CSS variable globally
        document.documentElement.style.setProperty("--font-family", fontValue);
        // Update Zustand store
        setFontFamily(fontValue);
        // Persist to localStorage
        localStorage.setItem("selectedFont", fontValue);
        setSelected(fontValue);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    const filteredFonts =
        activeCategory === "All"
            ? FONT_OPTIONS
            : FONT_OPTIONS.filter((f) => f.category === activeCategory);

    const currentFontName =
        FONT_OPTIONS.find((f) => f.value === selected)?.name || "Custom";

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            {/* Header */}
            <div className="max-w-4xl mx-auto mb-8">
                <div className="flex items-center gap-3 mb-1">
                    <span className="text-3xl">🔤</span>
                    <h1
                        className="text-3xl font-bold"
                        style={{ color: "var(--primary-color)" }}
                    >
                        Font Settings
                    </h1>
                </div>
                <p className="text-gray-500 ml-12">
                    यहाँ से पूरे project की font family एक क्लिक में बदलें।
                </p>

                {/* Current font badge */}
                <div className="ml-12 mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium text-white"
                    style={{ backgroundColor: "var(--primary-color)" }}>
                    <span>Current:</span>
                    <span style={{ fontFamily: selected }}>{currentFontName}</span>
                </div>
            </div>

            {/* Category Filter */}
            <div className="max-w-4xl mx-auto mb-6 flex flex-wrap gap-2">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className="px-4 py-1.5 rounded-full text-sm font-medium border transition-all cursor-pointer"
                        style={
                            activeCategory === cat
                                ? {
                                    backgroundColor: "var(--primary-color)",
                                    color: "#fff",
                                    borderColor: "var(--primary-color)",
                                }
                                : {
                                    backgroundColor: "#fff",
                                    color: "#555",
                                    borderColor: "#ddd",
                                }
                        }
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Font Grid */}
            <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredFonts.map((font) => {
                    const isActive = selected === font.value;
                    return (
                        <div
                            key={font.name}
                            onClick={() => applyFont(font.value)}
                            className="cursor-pointer rounded-2xl border-2 p-5 transition-all duration-200 hover:shadow-md"
                            style={{
                                borderColor: isActive ? "var(--primary-color)" : "#e5e7eb",
                                backgroundColor: isActive ? "var(--primary-color)" : "#fff",
                            }}
                        >
                            {/* Font name + category */}
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <span
                                        className="font-semibold text-base"
                                        style={{ color: isActive ? "#fff" : "#111" }}
                                    >
                                        {font.name}
                                    </span>
                                    {isActive && (
                                        <span className="ml-2 text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">
                                            ✓ Active
                                        </span>
                                    )}
                                </div>
                                <span
                                    className="text-xs px-2 py-0.5 rounded-full"
                                    style={{
                                        backgroundColor: isActive
                                            ? "rgba(255,255,255,0.2)"
                                            : "#f3f4f6",
                                        color: isActive ? "#fff" : "#6b7280",
                                    }}
                                >
                                    {font.category}
                                </span>
                            </div>

                            {/* Preview Text */}
                            <p
                                className="text-lg leading-snug"
                                style={{
                                    fontFamily: font.value,
                                    color: isActive ? "rgba(255,255,255,0.9)" : "#374151",
                                }}
                            >
                                {PREVIEW_TEXT}
                            </p>

                            {/* Alphabet preview */}
                            <p
                                className="mt-2 text-sm tracking-wide"
                                style={{
                                    fontFamily: font.value,
                                    color: isActive ? "rgba(255,255,255,0.6)" : "#9ca3af",
                                }}
                            >
                                Aa Bb Cc 1 2 3 — Regular Bold
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Save Toast */}
            <div
                className="fixed bottom-6 right-6 flex items-center gap-2 px-5 py-3 rounded-xl text-white font-medium shadow-lg transition-all duration-300"
                style={{
                    backgroundColor: "var(--primary-color)",
                    opacity: saved ? 1 : 0,
                    transform: saved ? "translateY(0)" : "translateY(20px)",
                    pointerEvents: "none",
                }}
            >
                ✅ Font applied to entire project!
            </div>
        </div>
    );
};

export default FontSettings;
