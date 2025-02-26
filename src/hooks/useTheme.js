import { useState, useEffect } from 'react';

const themes = [
    'theme-pink', 'theme-green', 'theme-blue', 'theme-purple',
    'theme-lilac', 'theme-yellow', 'theme-white', 'theme-red', 'theme-gray'
];

function useTheme() {
    const [theme, setTheme] = useState('theme-pink');

    const switchTheme = () => {
        const randomTheme = themes[Math.floor(Math.random() * themes.length)];
        setTheme(randomTheme);
    };

    useEffect(() => {
        const interval = setInterval(switchTheme, 300000); // Troca a cada 5 minutos
        return () => clearInterval(interval);
    }, []);

    return { theme, switchTheme };
}

export default useTheme;