"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Moon, Sun, Palette, Check, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/context/ThemeContext"

const ThemeSettings = () => {
  const navigate = useNavigate()
  const { theme, toggleTheme, colorScheme, setColorScheme, availableThemes } = useTheme()
  const [systemTheme, setSystemTheme] = useState("light")
  const [useSystemTheme, setUseSystemTheme] = useState(!localStorage.getItem("theme"))

  useEffect(() => {
    // Check system theme
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    setSystemTheme(mediaQuery.matches ? "dark" : "light")

    const handleChange = (e) => {
      setSystemTheme(e.matches ? "dark" : "light")
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  const handleSystemThemeToggle = () => {
    if (useSystemTheme) {
      // Switch to manual theme selection
      localStorage.setItem("theme", theme)
      setUseSystemTheme(false)
    } else {
      // Switch to system theme
      localStorage.removeItem("theme")
      const newTheme = systemTheme
      if (theme !== newTheme) {
        toggleTheme()
      }
      setUseSystemTheme(true)
    }
  }

  const handleColorSchemeChange = (scheme) => {
    console.log("Changing color scheme to:", scheme)
    setColorScheme(scheme)
  }

  const themeColors = {
    purple: { bg: "bg-purple-500", text: "Purple" },
    blue: { bg: "bg-blue-500", text: "Blue" },
    green: { bg: "bg-green-500", text: "Green" },
    amber: { bg: "bg-amber-500", text: "Amber" },
  }

  return (
    <div className="bg-background text-foreground min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mr-4">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Theme Settings</h1>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-semibold text-card-foreground">Appearance</h2>
            <p className="text-muted-foreground mt-1">Customize how BizNest looks and feels</p>
          </div>

          <div className="p-6 space-y-8">
            {/* Light/Dark Mode */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-card-foreground">Theme Mode</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ThemeCard
                  title="Light"
                  icon={<Sun className="h-5 w-5" />}
                  active={!useSystemTheme && theme === "light"}
                  onClick={() => {
                    if (theme === "dark") toggleTheme()
                    setUseSystemTheme(false)
                  }}
                  preview="bg-white border border-gray-200"
                />

                <ThemeCard
                  title="Dark"
                  icon={<Moon className="h-5 w-5" />}
                  active={!useSystemTheme && theme === "dark"}
                  onClick={() => {
                    if (theme === "light") toggleTheme()
                    setUseSystemTheme(false)
                  }}
                  preview="bg-gray-900 border border-gray-700"
                />

                <ThemeCard
                  title="System"
                  icon={<Palette className="h-5 w-5" />}
                  active={useSystemTheme}
                  onClick={handleSystemThemeToggle}
                  preview={`${systemTheme === "dark" ? "bg-gray-900 border border-gray-700" : "bg-white border border-gray-200"}`}
                  description={`Currently ${systemTheme}`}
                />
              </div>
            </div>

            {/* Color Schemes */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-card-foreground">Color Scheme</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {availableThemes.map((scheme) => (
                  <ColorSchemeCard
                    key={scheme}
                    title={themeColors[scheme].text}
                    colorClass={themeColors[scheme].bg}
                    active={colorScheme === scheme}
                    onClick={() => handleColorSchemeChange(scheme)}
                  />
                ))}
              </div>
            </div>

            {/* Theme Preview */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-card-foreground">Preview</h3>
              <div className="border border-border rounded-lg overflow-hidden">
                <div className="bg-primary text-primary-foreground p-4">
                  <div className="flex justify-between items-center">
                    <div className="font-bold">BizNest</div>
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-primary-foreground/30"></div>
                      <div className="w-3 h-3 rounded-full bg-primary-foreground/30"></div>
                      <div className="w-3 h-3 rounded-full bg-primary-foreground/30"></div>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-background">
                  <div className="flex space-x-4 mb-4">
                    <div className="w-1/3 h-8 bg-card rounded border border-border"></div>
                    <div className="w-1/3 h-8 bg-accent rounded"></div>
                    <div className="w-1/3 h-8 bg-primary text-primary-foreground rounded flex items-center justify-center text-xs">
                      Button
                    </div>
                  </div>
                  <div className="h-24 bg-card border border-border rounded-lg p-3">
                    <div className="w-2/3 h-4 bg-muted rounded mb-2"></div>
                    <div className="w-full h-4 bg-muted rounded mb-2"></div>
                    <div className="w-1/2 h-4 bg-muted rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const ThemeCard = ({ title, icon, active, onClick, preview, description }) => {
  return (
    <button
      onClick={onClick}
      className={`relative rounded-lg border ${
        active ? "border-primary ring-2 ring-primary/30" : "border-border"
      } p-4 transition-all hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/30`}
    >
      <div className="flex flex-col items-center">
        <div className={`w-full h-24 rounded-md mb-4 ${preview}`}></div>
        <div className="flex items-center">
          {icon}
          <span className="ml-2 font-medium text-card-foreground">{title}</span>
        </div>
        {description && <span className="text-xs text-muted-foreground mt-1">{description}</span>}
      </div>
      {active && (
        <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
          <Check className="h-3 w-3" />
        </div>
      )}
    </button>
  )
}

const ColorSchemeCard = ({ title, colorClass, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`relative rounded-lg border ${
        active ? "border-primary ring-2 ring-primary/30" : "border-border"
      } p-4 transition-all hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/30`}
    >
      <div className="flex flex-col items-center">
        <div className={`w-12 h-12 rounded-full mb-3 ${colorClass}`}></div>
        <span className="font-medium text-card-foreground">{title}</span>
      </div>
      {active && (
        <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
          <Check className="h-3 w-3" />
        </div>
      )}
    </button>
  )
}

export default ThemeSettings
