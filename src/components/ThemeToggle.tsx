
import React from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="relative hover:bg-primary/10 transition-colors"
    >
      <Sun className={`h-5 w-5 transition-all scale-100 rotate-0 ${theme === 'dark' ? 'scale-0 rotate-90' : ''}`} />
      <Moon className={`h-5 w-5 absolute transition-all scale-0 -rotate-90 ${theme === 'dark' ? 'scale-100 rotate-0' : ''}`} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
