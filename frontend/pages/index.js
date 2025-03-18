import Link from "next/link";
import { useTheme } from "../components/ThemeContext";

export default function Home() {
  const { darkMode, setDarkMode } = useTheme();
  return (
    <div className={darkMode ? "dark-mode" : "light-mode"} style={{ padding: "20px" }}>
      <h1>Welcome to AI Productivity App</h1>
      <p>Task scheduling and note management in one place.</p>
      <button onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>
      <Link href="/tasks">
        <button style={{ padding: "10px", backgroundColor: "blue", color: "white", border: "none", cursor: "pointer" }}>
          Go to Task Manager
        </button>
      </Link>
    </div>
  );
}