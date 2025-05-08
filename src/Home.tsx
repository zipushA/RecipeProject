import { Box, Button, IconButton } from "@mui/material";
import { Link, Outlet } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import { useContext, useEffect } from "react";
import axios from "axios";
import { CatContext } from "./categoriesContext";


const Home = () => {
   const {categories, setCategories } = useContext(CatContext);
  const getCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/category");
      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };
   useEffect(() => {
      getCategories();
    }, [])
 return (
   
    <>
     <Box 
        position="fixed" 
        top={16} 
        right={16} 
        display="flex" 
        gap={2}
        zIndex={1000}
      >
        <Box 
      position="fixed" 
      top={16} 
      left={16} // מיקום בצד שמאל
    >
      <IconButton 
        component={Link} 
        to={"/"} // נתיב לעמוד הבית
        sx={{ bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}
      >
        <HomeIcon sx={{ color: 'white' }} /> {/* אייקון הבית */}
      </IconButton>
    </Box>
        
        <Button 
          component={Link} 
          to={"/SignIn"} // עדכון לנתיב הנכון
          variant="contained" 
          sx={{ bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}
        >
          <>{}</>
          SignIn
        </Button>
        <Button 
          component={Link} 
          to={"/Login"} // עדכון לנתיב הנכון
          variant="contained" 
          sx={{ bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}
        >
          Login
        </Button>
        <Button 
          component={Link} 
          to={"/GetRecipes"} // עדכון לנתיב הנכון
          variant="contained" 
          sx={{ bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}
        >
          GetRecipes
        </Button>
        <Button 
          component={Link} 
          to={"/AddRecipe"} // עדכון לנתיב הנכון
          variant="contained" 
          sx={{ bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}
        >
          AddRecipe
        </Button>
      </Box>
    <Outlet/>
    </>
 )
};

export default Home;

