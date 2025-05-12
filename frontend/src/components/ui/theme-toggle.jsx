"use client"

import { Moon, Sun, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/context/ThemeContext"
import { useState, useEffect, useRef } from "react"

export function ThemeToggle({ className }) {
  const { theme, toggleTheme, colorScheme, setColorScheme, availableThemes } = useTheme()
  const [showColorPicker, setShowColorPicker] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowColorPicker(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleThemeToggle = () => {
    console.log("Theme toggle clicked, current theme:", theme)
    toggleTheme()
  }

  const handleColorSchemeChange = (scheme) => {
    console.log("Color scheme change:", scheme)
    setColorScheme(scheme)
    setShowColorPicker(false)
  }

  // Add class names for better styling targeting
  const toggleButton = `rounded-full border border-primary hover:bg-accent hover:text-accent-foreground transition-all duration-300 theme-toggle ${className}`
  const paletteButton = `rounded-full border border-primary hover:bg-accent hover:text-accent-foreground transition-all duration-300 theme-toggle`

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handleThemeToggle}
          className={toggleButton}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowColorPicker(!showColorPicker)}
          className={paletteButton}
          aria-label="Change color scheme"
        >
          <Palette className="h-5 w-5" />
        </Button>
      </div>

      {showColorPicker && (
        <div className="absolute right-0 mt-2 p-2 bg-card border border-border rounded-lg shadow-lg z-50 w-48 theme-selection-menu">
          <div className="text-sm font-medium text-card-foreground mb-2 px-2">Color Scheme</div>
          <div className="space-y-1">
            {availableThemes.map((scheme) => (
              <button
                key={scheme}
                onClick={() => handleColorSchemeChange(scheme)}
                className={`w-full text-left px-3 py-2 rounded-md flex items-center transition-colors ${
                  colorScheme === scheme
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full mr-2 ${
                    scheme === "purple"
                      ? "bg-purple-500"
                      : scheme === "blue"
                        ? "bg-blue-500"
                        : scheme === "green"
                          ? "bg-green-500"
                          : scheme === "amber"
                            ? "bg-amber-500"
                            : ""
                  }`}
                />
                <span className="capitalize">{scheme}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
