import { ThemeProvider } from "../components/ThemeContext";
import "../styles/tasks.css"; // Ensure global styles are applied

export default function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}