import { createContext, useContext, useEffect, useState } from 'react';
import { fetchCategories, fetchSubCategories } from '../api/categoryApi';

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-brand-loader text-2xl font-black tracking-[0.2em] text-slate-900">
          AVRORA <span className="font-light text-cyan-600">DAZZLE</span>
        </div>
      </div>
    );
  }

  return (
    <CategoryContext.Provider value={{ categories, allSubCategories }}>
      <div className="animate-navigation-ready">{children}</div>
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
