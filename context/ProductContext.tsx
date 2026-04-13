import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../types';

const MARKET_STORAGE_KEY = '@kisan_seva_marketplace';

interface ProductContextType {
  products: Product[];
  addProduct: (product: Product) => void;
  loadProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const stored = await AsyncStorage.getItem(MARKET_STORAGE_KEY);
      if (stored) {
        setProducts(JSON.parse(stored));
      } else {
        setProducts([]);
      }
    } catch {
      setProducts([]);
    }
  };

  const addProduct = async (product: Product) => {
    const updated = [product, ...products];
    setProducts(updated);
    try {
      await AsyncStorage.setItem(MARKET_STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error('Error saving products:', err);
    }
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, loadProducts }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProductContext must be used within a ProductProvider');
  }
  return context;
};
