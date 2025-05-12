"use client"

import { useTheme } from "@/context/ThemeContext"
import { Button } from "@/components/ui/button"
import { Check, Palette } from "lucide-react"
import { useState } from "react"

export function ThemeSelector() {
  const { colorScheme, setColorScheme, availableThemes } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  const themeColors = {
    purple: { bg: "bg-purple-500", text: "Purple" },
    blue: { bg: "bg-blue-500", text: "Blue" },
    green: { bg: "bg-green-500", text: "Green" },
    amber: { bg: "bg-amber-500", text: "Amber" },
  }

  const handleColorSchemeChange = (theme) => {
    console.log("Changing color scheme to:", theme)
    setColorScheme(theme)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 border-primary theme-selector"
      >
        <div className={`w-3 h-3 rounded-full ${themeColors[colorScheme].bg}`} />
        <span>Theme</span>
        <Palette className="h-4 w-4 ml-1" />
      </Button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 z-50 w-48 bg-card rounded-lg shadow-lg border border-border overflow-hidden theme-selection-menu">
          <div className="p-2">
            <div className="text-sm font-medium text-card-foreground mb-2 px-2">Color Theme</div>
            <div className="space-y-1">
              {availableThemes.map((theme) => (
                <button
                  key={theme}
                  onClick={() => handleColorSchemeChange(theme)}
                  className={`w-full text-left px-3 py-2 rounded-md flex items-center justify-between transition-colors ${
                    colorScheme === theme
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full mr-2 ${themeColors[theme].bg}`} />
                    <span>{themeColors[theme].text}</span>
                  </div>
                  {colorScheme === theme && <Check className="h-4 w-4" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
