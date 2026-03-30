import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useFavorites } from "../context/FavoritesContext";
import { useAuth } from "../context/AuthContext";
import { getCityImage } from "../services/api";

function DestinationCard({ place }) {
  const navigate = useNavigate();
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const { user } = useAuth();
  const [imgUrl, setImgUrl] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getCityImage(place.city).then((url) => {
      if (!cancelled) setImgUrl(url);
    });
    return () => { cancelled = true; };
  }, [place.city]);

  const existing = favorites.find((item) => item.city === place.city);

  const handleFavorite = (e) => {
    e.stopPropagation();
    if (!user) { alert("Please login to save favorites"); return; }
    if (existing) removeFavorite(existing._id);
    else addFavorite(place);
  };

  return (
    <div
      className="card"
      onClick={() => navigate("/details", { state: place })}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && navigate("/details", { state: place })}
    >
      {/* Favorite Button — uses CSS vars so it adapts to dark mode */}
      <div className="fav-btn" onClick={handleFavorite} title="Save to favorites">
        {existing ? (
          <FavoriteIcon className="fav-filled" style={{ fontSize: 18 }} />
        ) : (
          <FavoriteBorderIcon className="fav-empty" style={{ fontSize: 18 }} />
        )}
      </div>

      {/* Image or gradient placeholder */}
      {imgUrl ? (
        <img src={imgUrl} alt={place.city} loading="lazy" />
      ) : (
        <div className="card-bg-placeholder">🌍</div>
      )}

      {/* Overlay text */}
      <div className="card-overlay">
        <h3>{place.city}</h3>
        <p>{place.country}</p>
      </div>
    </div>
  );
}

export default DestinationCard;