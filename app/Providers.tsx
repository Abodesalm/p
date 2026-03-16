import { ThemeProvider } from "next-themes";

export default function Providers({ children }) {
  return (
    <ThemeProvider defaultTheme="system" attribute="class">
      <div className="text-dark dark:text-light bg-light dark:bg-dark transition-colors">
        {children}
      </div>
    </ThemeProvider>
  );
}
