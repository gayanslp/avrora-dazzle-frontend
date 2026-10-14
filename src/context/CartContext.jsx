'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { 
  fetchCart, 
  addToCartApi, 
  updateCartItemQuantityApi, 
  removeFromCartApi, 
  clearCartApi 
} from '../api/cartApi';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Helper to normalize an item coming from backend or local storage
const normalizeCartItem = (item, prevItems = []) => {
  if (!item) return null;

  // Determine an ID first. If it has no ID, it's invalid data (e.g. empty object), so drop it.
  const itemId = item.id || item._id || item.productId || (item.product && typeof item.product === 'object' ? (item.product?._id || item.product?.id) : item.product);
  if (!itemId) return null;

  let name = 'Product';
  let price = 0;
  let currency = 'Rs ';
  let image = '';

  if (item.product && typeof item.product === 'object' && item.product !== null) {
    const prod = item.product;
    name = prod.name || item.name || 'Product';
    price = typeof prod.price === 'number' ? prod.price : (Number(item.price) || 0);
    currency = prod.currency || item.currency || 'Rs ';
    image = (prod.images && prod.images.length > 0) ? prod.images[0] : (item.image || '');
  } else {
    name = item.name || 'Product';
    price = Number(item.price) || 0;
    currency = item.currency || 'Rs ';
    image = item.image || (item.images && item.images[0]) || '';
    
    // If backend returns unpopulated item, try to find details in local state
    if ((name === 'Product' || price === 0) && prevItems && prevItems.length > 0) {
      const existing = prevItems.find(p => p.id === itemId || p.productId === itemId);
      if (existing) {
        name = existing.name || name;
        price = existing.price || price;
        currency = existing.currency || currency;
        image = existing.image || image;
      }
    }
  }

  // Drop corrupted ghost items from previous state bugs that have no real data
  if (name === 'Product' && price === 0 && !image) {
    return null;
  }

  const color = item.color && item.color !== 'undefined' ? item.color : 'Standard';
  const size = item.size && item.size !== 'undefined' ? item.size : 'Standard';
  const variant = (item.variant && !item.variant.includes('undefined')) 
    ? item.variant 
    : `${color} / ${size}`;

  return {
    ...item,
    id: itemId,
    _id: itemId,
    productId: itemId,
    name: name,
    price: price,
    currency: currency,
    image: image,
    quantity: Number(item.quantity || item.qty) || 1,
    qty: Number(item.quantity || item.qty) || 1,
    color: color,
    size: size,
    variant: variant
  };
};

export const CartProvider = ({ children }) => {
  // Helper to load guest cart safely from localStorage (defaults to [] empty array)
  const getGuestCart = () => {
    if (typeof window === 'undefined') return [];
    try {
      const localData = localStorage.getItem('avora_cart');
      if (localData) {
        const parsed = JSON.parse(localData);
        if (Array.isArray(parsed)) {
          return parsed.map(normalizeCartItem).filter(Boolean);
        }
      }
    } catch (e) {
      console.error("Failed to read cart from localStorage", e);
    }
    return [];
  };

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const syncInProgress = useRef(false);

  // Synchronize backend cart or fallback to local cart
  const syncCart = useCallback(async () => {
    if (syncInProgress.current) return;
    syncInProgress.current = true;
    
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      setLoading(true);
      try {
        const data = await fetchCart();
        if (data && Array.isArray(data.items)) {
          setCartItems(prev => {
            const normalized = data.items.map(i => normalizeCartItem(i, prev)).filter(Boolean);
            if (normalized.length > 0) {
              try {
                localStorage.setItem('avora_cart', JSON.stringify(normalized));
              } catch (e) {
                console.error(e);
              }
              return normalized;
            } else {
              // Backend returned 0 items. Check if local cart has items to upload
              const localItems = getGuestCart();
              if (localItems.length > 0) {
                // Return localItems immediately so UI doesn't flicker, then sync
                setTimeout(async () => {
                  for (const locItem of localItems) {
                    try {
                      await addToCartApi({
                        productId: locItem.productId || locItem.id,
                        qty: locItem.quantity || locItem.qty || 1,
                        size: locItem.size || 'Standard',
                        color: locItem.color || 'Standard'
                      });
                    } catch (e) {
                      console.error("Failed to upload local item to backend cart:", e);
                    }
                  }
                  const refreshed = await fetchCart();
                  if (refreshed && Array.isArray(refreshed.items) && refreshed.items.length > 0) {
                    setCartItems(currentPrev => {
                      const refreshedNorm = refreshed.items.map(i => normalizeCartItem(i, currentPrev)).filter(Boolean);
                      try { localStorage.setItem('avora_cart', JSON.stringify(refreshedNorm)); } catch (e) {}
                      return refreshedNorm;
                    });
                  }
                }, 0);
                return localItems;
              } else {
                try { localStorage.setItem('avora_cart', JSON.stringify([])); } catch (e) {}
                return [];
              }
            }
          });
        }
      } catch (err) {
        console.error("Failed to fetch cart from backend:", err);
        // On error (e.g. 401/403 or network failure), preserve items from localStorage!
        const local = getGuestCart();
        setCartItems(local);
      } finally {
        setLoading(false);
        setIsInitialized(true);
        syncInProgress.current = false;
      }
    } else {
      const local = getGuestCart();
      setCartItems(local);
      setIsInitialized(true);
      syncInProgress.current = false;
    }
  }, []);

  // Fetch cart on mount and when token changes (or auth event fired)
  useEffect(() => {
    syncCart();

    const handleStorageChange = (e) => {
      if (!e.key || e.key === 'token') {
        syncCart();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [syncCart]);

  // Persist cart to localStorage whenever cartItems changes
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem('avora_cart', JSON.stringify(cartItems));
      } catch (e) {
        console.error("Failed to save cart to localStorage", e);
      }
    }
  }, [cartItems, isInitialized]);

  const updateLocalAddToCart = (newItem, quantityToAdd) => {
    setCartItems((prevItems) => {
      const targetId = newItem.productId || newItem.id;
      const existingIndex = prevItems.findIndex(item => 
        (item.id === targetId || item.productId === targetId || item.id === newItem.id) &&
        item.size === newItem.size &&
        item.color === newItem.color
      );

      let updated;
      if (existingIndex > -1) {
        updated = [...prevItems];
        const currentQty = updated[existingIndex].quantity || updated[existingIndex].qty || 1;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: currentQty + quantityToAdd,
          qty: currentQty + quantityToAdd
        };
      } else {
        updated = [...prevItems, { ...newItem, quantity: quantityToAdd, qty: quantityToAdd }];
      }

      try {
        localStorage.setItem('avora_cart', JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to update cart in localStorage", e);
      }
      return updated;
    });
  };

  // ADD TO CART (CRUD: Create/Update)
  const addToCart = async (rawItem) => {
    const quantityToAdd = rawItem.quantity || rawItem.qty || 1;
    const formattedItem = normalizeCartItem({
      ...rawItem,
      quantity: quantityToAdd,
      qty: quantityToAdd
    });

    // 1. Immediately update local state and localStorage so the UI updates instantly
    updateLocalAddToCart(formattedItem, quantityToAdd);
    setIsCartDrawerOpen(true);
    triggerToast(`Added ${formattedItem.name || 'Item'} to cart!`);

    // 2. If authenticated, also sync with the backend
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      try {
        const payload = {
          productId: formattedItem.productId || formattedItem.id,
          qty: quantityToAdd,
          size: formattedItem.size || 'Standard',
          color: formattedItem.color || 'Standard'
        };
        const updatedCartData = await addToCartApi(payload);
        if (updatedCartData && Array.isArray(updatedCartData.items)) {
          setCartItems(prev => {
            const normalized = updatedCartData.items.map(i => normalizeCartItem(i, prev)).filter(Boolean);
            try {
              localStorage.setItem('avora_cart', JSON.stringify(normalized));
            } catch (e) {
              console.error(e);
            }
            return normalized;
          });
        }
      } catch (err) {
        console.warn("Backend add to cart warning:", err.message);
        // The item is already safely preserved in local state and localStorage
      }
    }
  };

  // REMOVE FROM CART (CRUD: Delete)
  const removeFromCart = async (id) => {
    setCartItems(prev => {
      const updated = prev.filter(item => item && item.id !== id && item._id !== id && item.productId !== id);
      try {
        localStorage.setItem('avora_cart', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      try {
        await removeFromCartApi(id);
      } catch (err) {
        console.error("Error removing item from backend cart:", err);
      }
    }
  };

  // UPDATE QUANTITY (CRUD: Update)
  const updateQuantity = async (id, deltaOrNewQty, isDelta = true) => {
    const targetItem = cartItems.find(item => item && (item.id === id || item._id === id || item.productId === id));
    if (!targetItem) return;

    const currentQty = targetItem.quantity || targetItem.qty || 1;
    let newQty = isDelta ? currentQty + deltaOrNewQty : deltaOrNewQty;

    if (newQty <= 0) {
      await removeFromCart(id);
      return;
    }

    setCartItems(prev => {
      const updated = prev.map(item => 
        (item && (item.id === id || item._id === id || item.productId === id)) 
          ? { ...item, quantity: newQty, qty: newQty } 
          : item
      );
      try {
        localStorage.setItem('avora_cart', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      try {
        await updateCartItemQuantityApi(id, newQty);
      } catch (err) {
        console.error("Error updating quantity in backend cart:", err);
      }
    }
  };

  // CLEAR CART (CRUD: Delete all)
  const clearCart = async () => {
    setCartItems([]);
    try {
      localStorage.removeItem('avora_cart');
    } catch (e) {
      console.error(e);
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      try {
        await clearCartApi();
      } catch (err) {
        console.error("Error clearing backend cart:", err);
      }
    }
  };

  const openCartDrawer = () => setIsCartDrawerOpen(true);
  const closeCartDrawer = () => setIsCartDrawerOpen(false);

  const totalItems = cartItems.reduce((acc, item) => acc + (item.quantity || item.qty || 0), 0);
  const subtotal = cartItems.reduce((acc, item) => acc + ((item.price || 0) * (item.quantity || item.qty || 0)), 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      loading,
      isInitialized,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      fetchUserCart: syncCart,
      isCartDrawerOpen,
      openCartDrawer,
      closeCartDrawer,
      totalItems,
      subtotal,
      toastMessage,
      triggerToast
    }}>
      {children}
    </CartContext.Provider>
  );
};
