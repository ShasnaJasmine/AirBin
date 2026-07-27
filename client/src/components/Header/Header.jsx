import "./Header.css";
import { Moon, Sun } from "lucide-react";

function Header({ darkMode, toggleTheme }) {
  return (
    <header className="header">

    <h1 className="logo">
    Air<span>Bin</span>
</h1>

      <button
        className="theme-btn"
        onClick={toggleTheme}
      >
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

    </header>
  );
}

export default Header;