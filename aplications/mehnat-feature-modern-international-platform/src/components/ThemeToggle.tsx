import { Moon, Sun, Monitor, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/components/ThemeProvider"
import { useTranslation } from "react-i18next"

export function ThemeToggle() {
  const { setTheme, theme, actualTheme } = useTheme()
  const { t } = useTranslation()

  const getThemeIcon = () => {
    if (theme === "system") {
      return <Monitor className="h-4 w-4" />
    }
    return actualTheme === "dark" ?
      <Moon className="h-4 w-4" /> :
      <Sun className="h-4 w-4" />
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 px-0 hover:bg-primary/10 hover:text-primary transition-all duration-200 relative"
          aria-label={t('theme.toggle', 'Toggle theme')}
        >
          <div className="relative">
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute inset-0 h-4 w-4 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center">
            <Sun className="mr-2 h-4 w-4" />
            <span>{t('theme.light', 'Light')}</span>
          </div>
          {theme === "light" && <Check className="h-4 w-4 text-primary" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center">
            <Moon className="mr-2 h-4 w-4" />
            <span>{t('theme.dark', 'Dark')}</span>
          </div>
          {theme === "dark" && <Check className="h-4 w-4 text-primary" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center">
            <Monitor className="mr-2 h-4 w-4" />
            <span>{t('theme.system', 'System')}</span>
          </div>
          {theme === "system" && <Check className="h-4 w-4 text-primary" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
