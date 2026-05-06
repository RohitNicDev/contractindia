import React, { useEffect } from 'react';
import { ConfigProvider, theme } from 'antd';
import useThemeStore from '../store/themeStore';

const ThemeProvider = ({ children }) => {
    const { primaryColor, secondaryColor, accentColor, fontFamily, borderRadius } = useThemeStore();

    useEffect(() => {
        // Sync to CSS variables for Tailwind 4 / Custom CSS
        const root = document.documentElement;
        root.style.setProperty('--primary-color', primaryColor);
        root.style.setProperty('--secondary-color', secondaryColor);
        root.style.setProperty('--accent-color', accentColor);
        root.style.setProperty('--font-family', fontFamily);
        root.style.setProperty('--border-radius', `${borderRadius}px`);

        // Optional: Add a subtle backdrop transition
        root.style.setProperty('transition', 'background-color 0.3s ease');
    }, [primaryColor, secondaryColor, accentColor, fontFamily, borderRadius]);

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: primaryColor,
                    borderRadius: borderRadius,
                    fontFamily: fontFamily,
                },
                algorithm: theme.defaultAlgorithm,
            }}
        >
            {children}
        </ConfigProvider>
    );
};

export default ThemeProvider;
