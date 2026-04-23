export type Theme = "bw" | "gold" | "light";

export function setTheme(theme: Theme) {
  try {
    if (theme === "bw") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", theme);
    }
    localStorage.setItem("mc-theme", theme);
  } catch {}
}

export function getTheme(): Theme {
  try {
    return (localStorage.getItem("mc-theme") as Theme) || "bw";
  } catch {
    return "bw";
  }
}
