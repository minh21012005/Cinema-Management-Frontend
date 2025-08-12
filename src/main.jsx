import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import LoginPage from './pages/login.jsx';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import RegisterPage from './pages/register.jsx';
import { AuthWrapper } from './components/context/auth.context.jsx';
import PrivateRouteAdmin from './pages/admin/private.route.admin.jsx';
import AdminPage from './pages/admin/admin.jsx';
import ErrorPage from './pages/error.jsx';
import PrivateRouteManager from './pages/manager/private.route.manager.jsx';
import ManagerPage from './pages/manager/manager.jsx';
import PrivateRouteStaff from './pages/staff/private.route.manager.jsx';
import StaffPage from './pages/staff/staff.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/admin",
    element: (
      <PrivateRouteAdmin>
        <AdminPage />
      </PrivateRouteAdmin>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/manager",
    element: (
      <PrivateRouteManager>
        <ManagerPage />
      </PrivateRouteManager>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/staff",
    element: (
      <PrivateRouteStaff>
        <StaffPage />
      </PrivateRouteStaff>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
]);

createRoot(document.getElementById('root')).render(
  <AuthWrapper>
    < RouterProvider router={router} />
  </AuthWrapper>,
)
