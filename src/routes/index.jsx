import { createBrowserRouter } from 'react-router-dom';

// Layouts
import MainLayout from '../layouts/MainLayout';

// Pages - Only Landing Page for now
import Home from '../pages/Home/Home';

// Create router - Landing page only
export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
    ],
  },
]);

export default router;