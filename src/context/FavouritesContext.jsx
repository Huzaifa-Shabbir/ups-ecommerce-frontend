import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { getFavouritesByUser, toggleFavourite } from '../services/api';

const FavouritesContext = createContext(undefined);

export const FavouritesProvider = ({ children }) => {
  const { user, accessToken } = useAuth();
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadFavourites = useCallback(async () => {
    if (!user?.user_id) return;
    
    setLoading(true);
    try {
      const data = await getFavouritesByUser(user.user_id, accessToken);
      // API returns: { favourites: [{ product_Id: number, created_at: string }] }
      // Extract product IDs from favourites - API uses product_Id (capital I)
      const productIds = data.map(fav => {
        const id = fav.product_Id || fav.product_id;
        return typeof id === 'string' ? parseInt(id, 10) : Number(id);
      }).filter(id => !isNaN(id) && id > 0);
      setFavourites(productIds);
    } catch (err) {
      console.error('Failed to load favourites', err);
      setFavourites([]);
    } finally {
      setLoading(false);
    }
  }, [user?.user_id, accessToken]);

  // Load favourites when user logs in
  useEffect(() => {
    if (user?.user_id) {
      loadFavourites();
    } else {
      setFavourites([]);
    }
  }, [user?.user_id, loadFavourites]);

  const isFavourite = useCallback((productId) => {
    if (!productId) return false;
    // Normalize productId to number for comparison
    const productIdNum = typeof productId === 'string' ? parseInt(productId, 10) : Number(productId);
    return favourites.some(favId => {
      const favIdNum = typeof favId === 'string' ? parseInt(favId, 10) : Number(favId);
      return favIdNum === productIdNum;
    });
  }, [favourites]);

  const toggleFavouriteProduct = useCallback(async (productId) => {
    if (!user?.user_id) {
      alert('Please login to add favourites');
      return;
    }

    if (!productId) {
      console.error('Product ID is required');
      return;
    }

    // Normalize productId to number
    const productIdNum = typeof productId === 'string' ? parseInt(productId, 10) : Number(productId);
    
    if (isNaN(productIdNum)) {
      console.error('Invalid product ID:', productId);
      return;
    }

    try {
      const result = await toggleFavourite(user.user_id, productIdNum, accessToken);
      
      // API returns: { message: "Favourite toggled", result: { status: "added" } }
      // Status can be "added" or "removed"
      const status = result?.result?.status;
      
      if (status === 'added') {
        setFavourites(prev => {
          // Check if already exists to avoid duplicates
          const exists = prev.some(id => {
            const idNum = typeof id === 'string' ? parseInt(id, 10) : Number(id);
            return idNum === productIdNum;
          });
          return exists ? prev : [...prev, productIdNum];
        });
      } else if (status === 'removed') {
        setFavourites(prev => prev.filter(id => {
          const idNum = typeof id === 'string' ? parseInt(id, 10) : Number(id);
          return idNum !== productIdNum;
        }));
      } else {
        // If status is unknown, reload favourites from server
        loadFavourites();
      }
      
      return result;
    } catch (err) {
      console.error('Failed to toggle favourite', err);
      // Show user-friendly error message
      alert(err.message || 'Failed to update favourite. Please try again.');
      throw err;
    }
  }, [user?.user_id, accessToken, loadFavourites]);

  return (
    <FavouritesContext.Provider value={{ 
      favourites, 
      loading, 
      isFavourite, 
      toggleFavouriteProduct, 
      loadFavourites 
    }}>
      {children}
    </FavouritesContext.Provider>
  );
};

export const useFavourites = () => {
  const context = useContext(FavouritesContext);
  if (!context) throw new Error('useFavourites must be used within FavouritesProvider');
  return context;
};

