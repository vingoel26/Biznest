"use client"

import { createContext, useContext, useEffect, useState } from "react"

// Available themes
const THEMES = ["purple", "blue", "green", "amber"]

const ThemeContext = createContext({
  theme: "dark",
  colorScheme: "purple",
  toggleTheme: () => {},
  setColorScheme: () => {},
  availableThemes: THEMES,
})

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("dark")
  const [colorScheme, setColorScheme] = useState("purple")
  const [mounted, setMounted] = useState(false)

  // Initialize theme based on localStorage or system preference
  useEffect(() => {
    setMounted(true)
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem("theme")
    const savedColorScheme = localStorage.getItem("colorScheme") || "purple"

    if (savedTheme) {
      setTheme(savedTheme)
    } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark")
    } else {
      setTheme("light")
    }

    setColorScheme(savedColorScheme)

    // Add listener for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = (e) => {
      // Only update if user hasn't manually set a preference
      if (!localStorage.getItem("theme")) {
        setTheme(e.matches ? "dark" : "light")
      }
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  // Apply theme classes when theme or colorScheme changes
  useEffect(() => {
    if (!mounted) return

    // Only proceed if we're mounted to avoid SSR issues
    const root = document.documentElement
    const body = document.body

    // First clean all theme classes
    root.classList.remove("light", "dark")
    body.classList.remove("light", "dark")

    THEMES.forEach((t) => {
      root.classList.remove(`theme-${t}`)
      body.classList.remove(`theme-${t}`)
    })

    // Then apply the current theme and color scheme
    root.classList.add(theme)
    body.classList.add(theme)
    root.classList.add(`theme-${colorScheme}`)
    body.classList.add(`theme-${colorScheme}`)

    // Store in localStorage for persistence
    localStorage.setItem("theme", theme)
    localStorage.setItem("colorScheme", colorScheme)

    console.log(`Theme updated: ${theme}, Color scheme: ${colorScheme}`)
  }, [theme, colorScheme, mounted])

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "dark" ? "light" : "dark"
      console.log(`Toggling theme from ${prevTheme} to ${newTheme}`)
      return newTheme
    })
  }

  const changeColorScheme = (scheme) => {
    if (THEMES.includes(scheme)) {
      console.log(`Changing color scheme to: ${scheme}`)
      setColorScheme(scheme)
    }
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        colorScheme,
        toggleTheme,
        setColorScheme: changeColorScheme,
        availableThemes: THEMES,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
