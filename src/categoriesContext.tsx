import axios from "axios";
import { createContext, ReactElement, useEffect, useState } from "react";

type catContextType = {
  categories: Array<{ Id: number; Name: string }> | null; 
  setCategories: (categories: Array<{ Id: number; Name: string }>) => void;
  loading:boolean;
};

// יצירת קונטקסט
export const CatContext = createContext<catContextType>({
  categories: null,
  setCategories: () => {},
  loading:true
});

const CatContextProvider = ({ children }: { children: ReactElement }) => {
  const [category, setCategory] = useState<Array<{ Id: number; Name: string }> | null>(null);
  const [loading, setLoading] = useState(true);
  const setCategories = (cats: Array<{ Id: number; Name: string }>) => {
    setCategory(cats);
    setLoading(false);
  };
  
  const getCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/category");
      setCategories(res.data);
      console.log(res.data)
    } catch (error) {
      console.error("Error fetching categories", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    getCategories();
  }, [])
  return (
    <CatContext.Provider value={{ categories: category, setCategories ,loading}}>
      {children}
    </CatContext.Provider>
  );
};

export default CatContextProvider;