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
import SeatListPage from './pages/manager/seat.list.jsx';
import RoomCreate from './pages/manager/room.create.jsx';
import MovieListPage from './pages/manager/movie.list.jsx';
import ShowTimeListPage from './pages/manager/showtime.list.jsx';
import FoodListPage from './pages/manager/food.list.jsx';
import ComboListPage from './pages/manager/combo.list.jsx';

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
        element: <CinemaListPage />,
      },
      {
        path: "cinemas/:id/rooms",
        element: <RoomListPage />,
      },
      {
        path: "cinemas/rooms/:id/seats",
        element: <SeatListPage />,
      },
      {
        path: "cinemas/:id/rooms/create",
        element: <RoomCreate />,
      },
      {
        path: "movies",
        element: <MovieListPage />,
      },
      {
        path: "cinemas/:id/showtime",
        element: <ShowTimeListPage />,
      },
      {
        path: "foods",
        element: <FoodListPage />,
      },
      {
        path: "combos",
        element: <ComboListPage />,
      },
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
