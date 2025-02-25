import { Box, Button } from "@mui/material";
import { Link, Outlet } from "react-router-dom";



const Home = () => {
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

