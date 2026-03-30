import { createContext, useContext, useState, useEffect } from "react";
import API from "../services/backendApi";
import { useAuth } from "./AuthContext";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) fetchFavorites();
    else setFavorites([]);
  }, [user]);

  const fetchFavorites = async () => {
    try {
      const res = await API.get("/favorites");
      setFavorites(res.data);
    } catch {}
  };

  const addFavorite = async (place) => {
    const res = await API.post("/favorites", place);
    setFavorites((prev) => [...prev, res.data]);
  };

  const removeFavorite = async (id) => {
    await API.delete(`/favorites/${id}`);
    setFavorites((prev) => prev.filter((f) => f._id !== id));
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);