
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import SignIn from './SignIn.tsx'
import Login from './Login.tsx'
import GetRecipes from './GetRecipes.tsx'
import AddRecipe from './AddRecipe.tsx'
import EditRecipe from './EditRecipe.tsx'

const routes = createBrowserRouter([
 
    {
    path: '*', // דף הבית הראשי

    element: 
    <App />,
    
     
        // קומפוננטת Home
        children: [
          { path: "Login", element: <Login /> },
          { path: 'SignIn', element: <SignIn /> },
          { path: 'GetRecipes', element: <GetRecipes />},
          { path: 'AddRecipe', element: <AddRecipe /> },
          { path: 'edit-recipe/:id', element: <EditRecipe /> }

    
        ],
      },
   ] );
createRoot(document.getElementById('root')!).render(

  <RouterProvider router={routes} />,
)

