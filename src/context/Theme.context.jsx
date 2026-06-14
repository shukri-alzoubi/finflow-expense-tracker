import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({children})=>{
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(()=>{
        document.body.setAttribute('data-bs-theme', theme);
        localStorage.setItem('theme' ,theme);
    }, [theme]);

    const toggleTheme = ()=>{
        setTheme((prev) => prev === 'light' ? 'dark' : 'light');
    }

    return <ThemeContext.Provider value={{theme, toggleTheme, setTheme}}>
        {children}
    </ThemeContext.Provider>
}

/**
 * 
 * @returns {{
 *  theme: 'light' | 'dark',
 *  toggleTheme: ()=> void,
 *  setTheme: (theme: 'light' | 'dark') => void
 * }}
 */
export const useTheme = ()=> useContext(ThemeContext);