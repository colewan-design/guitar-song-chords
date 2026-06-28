import React, { createContext, useContext, useState } from 'react';

const FavouritesContext = createContext();

export function FavouritesProvider({ children }) {
  const [favourites, setFavourites] = useState([]);

  const toggle = (song) => {
    setFavourites((prev) =>
      prev.find((s) => s.id === song.id)
        ? prev.filter((s) => s.id !== song.id)
        : [...prev, song]
    );
  };

  const isFavourite = (id) => favourites.some((s) => s.id === id);

  return (
    <FavouritesContext.Provider value={{ favourites, toggle, isFavourite }}>
      {children}
    </FavouritesContext.Provider>
  );
}

export const useFavourites = () => useContext(FavouritesContext);
