import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";

function SearchBar({ onSearch }) {
  const [city, setCity] = useState("");

  const handleSearch = () => {
    const trimmed = city.trim();
    if (!trimmed) return;
    onSearch(trimmed);
  };

  return (
    <div className="search-bar">
      <input
        className="search-native-input"
        placeholder="Search for a city..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        style={{
          flex: 1,
          border: "none",
          outline: "none",
          padding: "14px 18px",
          fontSize: "15px",
          fontFamily: "inherit",
          background: "transparent",
          color: "inherit",
        }}
      />
      <button
        className="search-btn"
        onClick={handleSearch}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <SearchIcon style={{ fontSize: 18 }} />
        Search
      </button>
    </div>
  );
}

export default SearchBar;