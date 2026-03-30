import Navbar from "../components/Navbar";
import DestinationCard from "../components/DestinationCard";
import { useFavorites } from "../context/FavoritesContext";

function Favorites() {
  const { favorites } = useFavorites();

  return (
    <div>
      <Navbar />

      <div className="favorites-container">
        <h1 className="favorites-title">Your Favorites</h1>
        <p className="favorites-subtitle">
          {favorites.length > 0
            ? `${favorites.length} saved destination${favorites.length !== 1 ? "s" : ""}`
            : "No favorites saved yet"}
        </p>

        {favorites.length === 0 ? (
          <div className="empty-favorites">
            <span className="empty-icon">🗺️</span>
            <h2>Nothing saved yet</h2>
            <p>Search for cities and tap the heart to save your favorite destinations.</p>
          </div>
        ) : (
          <div className="grid">
            {favorites.map((item) => (
              <DestinationCard key={item._id} place={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Favorites;