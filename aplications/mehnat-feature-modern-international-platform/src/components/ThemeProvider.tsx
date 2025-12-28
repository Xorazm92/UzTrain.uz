import { createContext, useContext, useEffect, useState, useCallback } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  actualTheme: "dark" | "light"
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  actualTheme: "light",
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "uztrain-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )
  const [actualTheme, setActualTheme] = useState<"dark" | "light">("light")

  const updateTheme = useCallback((newTheme: Theme) => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")

    let resolvedTheme: "dark" | "light"

    if (newTheme === "system") {
      resolvedTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
    } else {
      resolvedTheme = newTheme
    }

    root.classList.add(resolvedTheme)
    setActualTheme(resolvedTheme)

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        "content",
        resolvedTheme === "dark" ? "#0f0f17" : "#ffffff"
      )
    }

    // Update CSS custom properties for smooth transitions
    root.style.setProperty('--theme-transition', 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)')

    // Apply theme-specific optimizations
    if (resolvedTheme === "dark") {
      root.style.setProperty('--scroll-thumb', 'rgba(255, 255, 255, 0.3)')
      root.style.setProperty('--scroll-track', 'rgba(255, 255, 255, 0.1)')
    } else {
      root.style.setProperty('--scroll-thumb', 'rgba(0, 0, 0, 0.3)')
      root.style.setProperty('--scroll-track', 'rgba(0, 0, 0, 0.1)')
    }
  }, [])

  useEffect(() => {
    updateTheme(theme)
  }, [theme, updateTheme])

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

    const handleChange = () => {
      if (theme === "system") {
        updateTheme("system")
      }
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [theme, updateTheme])

  const value = {
    theme,
    actualTheme,
    setTheme: (newTheme: Theme) => {
      localStorage.setItem(storageKey, newTheme)
      setTheme(newTheme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
