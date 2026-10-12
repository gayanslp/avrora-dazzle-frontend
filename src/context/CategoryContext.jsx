import { createContext, useContext, useEffect, useState } from 'react';
import { fetchCategories, fetchSubCategories } from '../api/categoryApi';
import LogoLoader from '../components/LogoLoader';

const CategoryContext = createContext(null);

const getCategories = (data) => (
  Array.isArray(data) ? data : (data?.categories ?? [])
);

const getSubCategories = (data) => (
  Array.isArray(data) ? data : (data?.subCategories ?? data?.data ?? [])
);

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [allSubCategories, setAllSubCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    Promise.all([fetchCategories(), fetchSubCategories()])
      .then(([categoryData, subCategoryData]) => {
        if (!isMounted) return;

        setCategories(getCategories(categoryData));
        setAllSubCategories(getSubCategories(subCategoryData));
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <CategoryContext.Provider value={{ categories, allSubCategories, isLoading }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = () => {
  const context = useContext(CategoryContext);

  if (!context) {
    throw new Error('useCategories must be used inside CategoryProvider');
  }

  return context;
};
