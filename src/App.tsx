
import CatContextProvider from "./categoriesContext";
import Home from "./Home";
import UserContext from "./userContext";


function App() {
  return ( 
  <UserContext>
  <CatContextProvider>
    <Home/>
    </CatContextProvider>
  </UserContext>
  ); // סוגריים סגורים כאן
}
export default App;
