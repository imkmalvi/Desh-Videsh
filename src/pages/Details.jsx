import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getWeather } from "../services/api";
import { useFavorites } from "../context/FavoritesContext";
import { useAuth } from "../context/AuthContext";

function Details() {
  const location = useLocation();
  const navigate = useNavigate();
  const place = location.state;

  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);

  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const { user } = useAuth();

  useEffect(() => {
    if (!place?.city) return;
    setLoadingWeather(true);
    getWeather(place.city).then((data) => {
      setWeather(data);
      setLoadingWeather(false);
    });
  }, [place]);

  const existing = favorites.find((item) => item.city === place?.city);

  const handleFavorite = () => {
    if (!user) { alert("Login required"); return; }
    if (existing) removeFavorite(existing._id);
    else addFavorite(place);
  };

  if (!place) {
    return (
      <div>
        <Navbar />
        <div style={{ padding: "120px 40px", textAlign: "center" }}>
          <h2 style={{ fontFamily: "Playfair Display, serif" }}>No destination data found.</h2>
          <button
            onClick={() => navigate("/")}
            style={{
              marginTop: 20, padding: "10px 24px", borderRadius: 10,
              border: "none", background: "var(--accent)", color: "#fff",
              fontFamily: "inherit", cursor: "pointer", fontSize: 14,
            }}
          >
            Go back home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      {/* Hero */}
      <div className="details-hero">
        <div className="details-overlay">
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            style={{
              position: "absolute", top: 84, left: 40,
              background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: 10, padding: "8px 16px",
              color: "#fff", cursor: "pointer", display: "flex",
              alignItems: "center", gap: 6, fontSize: 13, fontFamily: "inherit",
            }}
          >
            <ArrowBackIcon style={{ fontSize: 16 }} />
            Back
          </button>

          <h1>{place.city}</h1>
          <p>{place.country}</p>
        </div>

        {/* Favorite button */}
        <div className="details-fav" onClick={handleFavorite} title="Save to favorites">
          {existing ? (
            <FavoriteIcon style={{ color: "#e53935" }} />
          ) : (
            <FavoriteBorderIcon style={{ color: "#555" }} />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="details-container">
        <div className="details-grid">
          {[
            { label: "Region", value: place.region || "—" },
            { label: "Population", value: place.population?.toLocaleString() || "—" },
            { label: "Latitude", value: place.latitude ?? "—" },
            { label: "Longitude", value: place.longitude ?? "—" },
          ].map((item) => (
            <div key={item.label} className="info-box">
              <h4>{item.label}</h4>
              <p>{item.value}</p>
            </div>
          ))}
        </div>

        {/* Weather */}
        <div className="weather-box">
          <h2>Current Weather</h2>
          {loadingWeather ? (
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Loading weather data…</p>
          ) : weather ? (
            <div className="weather-data">
              <div className="weather-stat">
                <span className="icon">🌡</span>
                <span>{weather.main.temp}°C</span>
              </div>
              <div className="weather-stat">
                <span className="icon">🌤</span>
                <span style={{ textTransform: "capitalize" }}>
                  {weather.weather[0].description}
                </span>
              </div>
              <div className="weather-stat">
                <span className="icon">💧</span>
                <span>{weather.main.humidity}% humidity</span>
              </div>
              <div className="weather-stat">
                <span className="icon">💨</span>
                <span>{weather.wind?.speed} m/s wind</span>
              </div>
            </div>
          ) : (
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
              Weather data unavailable for this city.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Details;