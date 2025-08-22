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
import PrivateRouteStaff from './pages/staff/private.route.manager.jsx';
import StaffPage from './pages/staff/staff.jsx';
import ManagerLayout from './pages/manager/index.jsx';
import CinemaListPage from './pages/manager/cinema.list.jsx';
import RoomListPage from './pages/manager/room.list.jsx';

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
        <ManagerLayout />
      </PrivateRouteManager>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <CinemaListPage />, // /manager
      },
      {
        path: "cinema/:id/rooms",
        element: <RoomListPage />,   // bạn tạo sau
      },
      // {
      //   path: "room/:id/seats",
      //   element: <SeatListPage />,   // bạn tạo sau
      // },
    ],
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
  {
    path: "/404",
    element: <ErrorPage />,
  }
]);

createRoot(document.getElementById('root')).render(
  <AuthWrapper>
    < RouterProvider router={router} />
  </AuthWrapper>,
)
